import { createClient } from '@supabase/supabase-js';
import { SUPABASE_ANON_KEY } from '$env/static/private';
import type { Database } from './schema';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';

export const supabase = createClient<Database>(PUBLIC_SUPABASE_URL || '', SUPABASE_ANON_KEY || '');
