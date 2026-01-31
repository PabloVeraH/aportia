import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export interface Product {
  id: string;
  name: string;
  unit: string;
}

export function useProducts() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchProducts = async (query: string): Promise<Product[]> => {
    if (!query || query.length < 3) return [];

    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, unit')
        .ilike('name', `%${query}%`)
        .eq('active', true)
        .eq('is_deleted', false)
        .limit(10);

      if (error) throw error;
      return data || [];
    } catch (err: any) {
      console.error('Error searching products:', err);
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  return { searchProducts, loading, error };
}
