import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SupabaseService } from '../common/supabase.service';
import { AuthResponse } from '@supabase/supabase-js';

@Injectable()
export class AuthService {
  constructor(private readonly supabase: SupabaseService) { }

  async signIn(email: string, password: string): Promise<AuthResponse> {
    const { data, error } = await this.supabase
      .getClient()
      .auth.signInWithPassword({
        email,
        password,
      });

    if (error) {
      throw new UnauthorizedException(error.message);
    }

    return { data, error };
  }
}
