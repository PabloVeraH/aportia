import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../common/supabase.service';

@Injectable()
export class DonationsService {
  constructor(private readonly supabase: SupabaseService) { }

  async searchProducts(query: string) {
    const { data, error } = await this.supabase.getClient()
      .from('products')
      .select('id, name, unit')
      .ilike('name', `%${query}%`)
      .eq('active', true)
      .eq('is_deleted', false)
      .limit(10);

    if (error) return [];
    return data;
  }

  async createDonation(payload: any, userId: string) {
    const client = this.supabase.getClient();

    // Start transaction logic (Supabase doesn't support complex transactions via REST easily,
    // so we trust the Edge Function or do strict sequence)
    // For Phase 4 MVP we do sequence: check donor -> insert donation -> insert items

    // 1. Check or Create Donor (Ideally this logic moves to DB function for atomicity,
    // but simplified here for NodeJS control)
    let donorId = payload.donor_id; // If existing selected

    if (!donorId && payload.donor_rut) {
      // Try to find
      const { data: existing } = await client.from('donors').select('id').eq('rut', payload.donor_rut).single();
      if (existing) {
        donorId = existing.id;
      } else {
        // Create
        const { data: newDonor, error: donorError } = await client.from('donors').insert({
          rut: payload.donor_rut,
          first_name: payload.donor_first_name,
          last_name: payload.donor_last_name,
          email: payload.donor_email,
          created_by: userId
        }).select().single();

        if (donorError) throw new Error(donorError.message);
        donorId = newDonor.id;
      }
    }

    // 2. Insert Donation
    const { data: donation, error: donationError } = await client.from('donations').insert({
      center_id: payload.center_id,
      donor_id: donorId,
      received_at: payload.received_at || new Date(),
      status: 'pending', // Default
      created_by: userId
    }).select().single();

    if (donationError) throw new Error(donationError.message);

    // 3. Insert Items
    const items = payload.items.map((item: any) => ({
      donation_id: donation.id,
      product_id: item.product_id,
      quantity: item.quantity,
      unit: item.unit, // redundant but in schema
      created_by: userId
    }));

    const { error: itemsError } = await client.from('donation_items').insert(items);
    if (itemsError) {
      // Rollback strategy: hard delete donation?
      // For now, throw.
      throw new Error(itemsError.message);
    }

    return donation;
  }
}
