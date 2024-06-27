import { SUPABASE_ANON_KEY } from '$env/static/private';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import type { Database } from '$lib/schema';
import { createServerClient } from '@supabase/ssr';
import type { RequestEvent } from '@sveltejs/kit';
import type { inferAsyncReturnType } from '@trpc/server';

export async function createContext(event: RequestEvent) {
	// if there's auth cookie it'll be authenticated by this helper
	const supabase = createServerClient<Database>(PUBLIC_SUPABASE_URL, SUPABASE_ANON_KEY, {
		cookies: {
			get: (key) => event.cookies.get(key),
			/**
			 * Note: You have to add the `path` variable to the
			 * set and remove method due to sveltekit's cookie API
			 * requiring this to be set, setting the path to an empty string
			 * will replicate previous/standard behaviour (https://kit.svelte.dev/docs/types#public-types-cookies)
			 */
			set: (key, value, options) => {
				event.cookies.set(key, value, { ...options, path: '/' });
			},
			remove: (key, options) => {
				event.cookies.delete(key, { ...options, path: '/' });
			}
		}
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

	const { user } = await event.locals.safeGetSession();

	return {
		requestOrigin: event.request.headers.get('origin'),
		event,
		user,

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
