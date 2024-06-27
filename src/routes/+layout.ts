import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';
import { trpc } from '$lib/trpc';
import { createBrowserClient, createServerClient, isBrowser, parse } from '@supabase/ssr';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async (event) => {
	event.depends('supabase:auth');

	const supabase = isBrowser()
		? createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
				global: {
					fetch
				},
				cookies: {
					get(key) {
						const cookie = parse(document.cookie);
						return cookie[key];
					}
				}
		  })
		: createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
				global: {
					fetch
				},
				cookies: {
					get() {
						return JSON.stringify(event.data.session);
					}
				}
		  });

	const { data: userData } = await supabase.auth.getUser();
	/**
	 * It's fine to use `getSession` here, because on the client, `getSession` is
	 * safe, and on the server, it reads `session` from the `LayoutData`, which
	 * safely checked the session using `safeGetSession`.
	 */

	return { supabase, user: userData?.user, trpc };
};
