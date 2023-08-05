import { createClient } from '@supabase/supabase-js';
import type { Database } from './schema';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '$env/static/private';

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
