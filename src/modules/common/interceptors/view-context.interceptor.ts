import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { SupabaseService } from '../supabase.service';

@Injectable()
export class ViewContextInterceptor implements NestInterceptor {
  constructor(private readonly supabase: SupabaseService) { }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const activeCenterId = request.cookies['x-active-center-id'];

    return next.handle().pipe(
      switchMap(async (data) => {
        let myCenters: any[] = [];
        if (user) {
          const { data: roles } = await this.supabase.getClient()
            .from('user_center_roles')
            .select('center_id, centers(name)')
            .eq('user_id', user.id)
            .eq('active', true);

          if (roles) {
            myCenters = roles.map((r: any) => ({
              id: r.center_id,
              name: r.centers.name
            }));
          }
        }

        if (typeof data === 'object' && data !== null) {
          return {
            ...data,
            user,
            activeCenterId,
            myCenters,
            lang: request.cookies['lang'] || 'es-CL',
            theme: request.cookies['theme'] || 'light'
          };
        }
        return data;
      }),
    );
  }
}
