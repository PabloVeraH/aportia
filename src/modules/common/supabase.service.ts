import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private client: SupabaseClient;

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_ANON_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase URL and Key must be defined in .env');
    }

    this.client = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false, // Server-side environment
      },
    });
  }

  getClient(): SupabaseClient {
    return this.client;
  }
}
