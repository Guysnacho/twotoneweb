import type { RequestEvent } from '@sveltejs/kit';
import { createSupabaseServerClient } from '@supabase/auth-helpers-sveltekit';
import type { inferAsyncReturnType } from '@trpc/server';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '$env/static/private';
import type { Database } from '$lib/schema';

export async function createContext(event: RequestEvent) {
	// if there's auth cookie it'll be authenticated by this helper
	const supabase = createSupabaseServerClient<Database>({
		event: event,
		supabaseKey: SUPABASE_ANON_KEY,
		supabaseUrl: SUPABASE_URL
	});

	// native sends these instead of cookie auth
	if (event.request.headers.has('authorization') && event.request.headers.has('refresh-token')) {
		const accessToken = event.request.headers.get('authorization')?.split('Bearer ').pop();
		const refreshToken = event.request.headers.get('refresh-token');
		if (accessToken && typeof refreshToken === 'string') {
			await supabase.auth.setSession({
				access_token: accessToken,
				refresh_token: refreshToken
			});
		}
	}

	const {
		data: { session }
	} = await supabase.auth.getSession();

	return {
		requestOrigin: event.request.headers.get('origin'),

		/**
		 * The Supabase user session
		 */
		session,

		/**
		 * The Supabase instance with the authenticated session on it (RLS works)
		 *
		 * You should import `supabaseAdmin` from packages/app/utils/supabase/admin  in case you want to
		 * do anything on behalf of the service role (RLS doesn't work - you're admin)
		 */
		supabase
	};
}

export type Context = inferAsyncReturnType<typeof createContext>;
