import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

export interface DonationItemInput {
  product_id: string;
  quantity: number;
  unit: string;
}

export interface CreateDonationPayload {
  center_id: string;
  received_at?: string;
  donor_rut?: string;
  donor_first_name?: string;
  donor_last_name?: string;
  donor_email?: string; // Optional
  donor_id?: string; // If existing
  items: DonationItemInput[];
}

export function useDonations() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchDonor = async (rut: string) => {
    if (!rut) return null;
    try {
      const { data, error } = await supabase
        .from('donors')
        .select('*')
        .eq('rut', rut)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (err: any) {
      console.error('Error searching donor:', err);
      return null;
    }
  };

  const createDonation = async (payload: CreateDonationPayload) => {
    if (!user) {
      setError('No user logged in');
      return false;
    }
    setLoading(true);
    setError(null);

    try {
      // 1. Check or Create Donor
      let donorId = payload.donor_id;

      if (!donorId && payload.donor_rut) {
        // Try to find by RUT again just in case
        const { data: existing } = await supabase
          .from('donors')
          .select('id')
          .eq('rut', payload.donor_rut)
          .maybeSingle();

        if (existing) {
          donorId = existing.id;
        } else {
          // Create new donor
          const { data: newDonor, error: donorError } = await supabase
            .from('donors')
            .insert({
              rut: payload.donor_rut,
              first_name: payload.donor_first_name,
              last_name: payload.donor_last_name,
              email: payload.donor_email,
              created_by: user.id
            })
            .select()
            .single();

          if (donorError) throw new Error(`Error creating donor: ${donorError.message}`);
          donorId = newDonor.id;
        }
      }

      if (!donorId) {
        throw new Error('Could not identify or create donor');
      }

      // 2. Insert Donation
      const { data: donation, error: donationError } = await supabase
        .from('donations')
        .insert({
          center_id: payload.center_id,
          donor_id: donorId,
          received_at: payload.received_at || new Date().toISOString(),
          status: 'pending',
          created_by: user.id
        })
        .select()
        .single();

      if (donationError) throw new Error(`Error creating donation: ${donationError.message}`);

      // 3. Insert Items
      if (payload.items.length > 0) {
        const itemsToInsert = payload.items.map(item => ({
          donation_id: donation.id,
          product_id: item.product_id,
          quantity: item.quantity,
          unit: item.unit,
          created_by: user.id
        }));

        const { error: itemsError } = await supabase
          .from('donation_items')
          .insert(itemsToInsert);

        if (itemsError) throw new Error(`Error adding items: ${itemsError.message}`);
      }

      return true;
    } catch (err: any) {
      console.error('Error in createDonation:', err);
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { createDonation, searchDonor, loading, error };
}
