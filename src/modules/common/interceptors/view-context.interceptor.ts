import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ViewContextInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const activeCenterId = request.cookies['x-active-center-id'];

    return next.handle().pipe(
      map(data => {
        if (typeof data === 'object' && data !== null) {
          return {
            ...data,
            user,
            activeCenterId,
            lang: request.cookies['lang'] || 'es-CL',
            theme: request.cookies['theme'] || 'light'
          };
        }
        return data;
      }),
    );
  }
}
