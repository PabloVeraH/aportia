import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../common/supabase.service';

@Injectable()
export class DashboardService {
  constructor(private readonly supabase: SupabaseService) { }

  async getUserCenters(userId: string) {
    const client = this.supabase.getClient();

    // Check if system admin
    const { data: globalRole } = await client
      .from('global_roles')
      .select('role')
      .eq('user_id', userId)
      .eq('active', true)
      .eq('is_deleted', false)
      .single();

    const isSystemAdmin = globalRole?.role === 'system_admin';

    // Get user centers
    const { data: userCenters, error } = await client
      .from('user_center_roles')
      .select(`
        center_id,
        role,
        centers (
          id,
          name
        )
      `)
      .eq('user_id', userId)
      .eq('active', true);

    if (error) {
      console.error('Error fetching user centers:', error);
      return { isSystemAdmin: false, centers: [] };
    }

    return {
      isSystemAdmin,
      centers: userCenters.map((uc: any) => ({
        id: uc.center_id,
        name: uc.centers.name,
        role: uc.role
      }))
    };
  }
}
