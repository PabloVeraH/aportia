import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../common/supabase.service';

@Injectable()
export class ProductsService {
  constructor(private readonly supabase: SupabaseService) { }

  async findAll(accessToken: string = '') {
    const { data, error } = await this.supabase.getClientForUser(accessToken)
      .from('products')
      .select('*')
      .eq('is_deleted', false)
      .order('name');

    if (error) throw new Error(error.message);
    return data;
  }

  async findOne(id: string, accessToken: string = '') {
    const { data, error } = await this.supabase.getClientForUser(accessToken)
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  async create(payload: any, userId: string, accessToken: string = '') {
    const { data, error } = await this.supabase.getClientForUser(accessToken)
      .from('products')
      .insert({
        name: payload.name,
        unit: payload.unit,
        barcode: payload.barcode,
        active: payload.active === 'on' || payload.active === true,
        created_by: userId
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  async update(id: string, payload: any, userId: string, accessToken: string = '') {
    const { data, error } = await this.supabase.getClientForUser(accessToken)
      .from('products')
      .update({
        name: payload.name,
        unit: payload.unit,
        barcode: payload.barcode,
        active: payload.active === 'on' || payload.active === true,
        updated_by: userId,
        updated_at: new Date()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  async remove(id: string, userId: string, accessToken: string = '') {
    const { error } = await this.supabase.getClientForUser(accessToken)
      .from('products')
      .update({
        is_deleted: true,
        deleted_by: userId,
        deleted_at: new Date()
      })
      .eq('id', id);

    if (error) throw new Error(error.message);
    return true;
  }
}
