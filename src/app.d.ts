// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
/// <reference types="@sveltejs/kit" />

import { User, SupabaseClient } from '@supabase/supabase-js';
declare global {
	declare namespace App {
		interface Locals {
			supabase: SupabaseClient<Database>;
			safeGetSession: () => Promise<{ user: User | null }>;
			user: User | null;
		}
		// interface PageData {}
		interface Error {
			code: number;
		}
		// interface Platform {}
	}
}
