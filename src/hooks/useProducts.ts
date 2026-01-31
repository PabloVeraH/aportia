import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

export interface Product {
  id: string;
  name: string;
  unit: string;
  barcode?: string;
  active: boolean;
  created_at?: string;
}

export interface ProductInput {
  name: string;
  unit: string;
  barcode?: string;
  active: boolean;
}

export function useProducts() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchProducts = useCallback(async (query: string): Promise<Product[]> => {
    if (!query || query.length < 3) return [];

    // Search is read-only, generally safe without extra loading state blocking UI
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, unit, active')
        .ilike('name', `%${query}%`)
        .eq('active', true)
        .eq('is_deleted', false)
        .limit(10);

      if (error) throw error;
      return data || [];
    } catch (err: any) {
      console.error('Error searching products:', err);
      return [];
    }
  }, []);

  const findAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_deleted', false)
        .order('name');

      if (error) throw error;
      return data as Product[];
    } catch (err: any) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const findOne = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Product;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createProduct = async (payload: ProductInput) => {
    if (!user) return false;
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase
        .from('products')
        .insert({
          ...payload,
          created_by: user.id
        });

      if (error) throw error;
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (id: string, payload: ProductInput) => {
    if (!user) return false;
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase
        .from('products')
        .update({
          ...payload,
          updated_by: user.id,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!user) return false;
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase
        .from('products')
        .update({
          is_deleted: true,
          deleted_by: user.id,
          deleted_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    searchProducts,
    findAll,
    findOne,
    createProduct,
    updateProduct,
    deleteProduct
  };
}
