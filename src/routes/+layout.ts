import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';
import { trpcRouter } from '$lib/server/trpc/router';
import { createBrowserClient, createServerClient, isBrowser } from '@supabase/ssr';
import { httpBatchLink } from '@trpc/client';
import SuperJSON, { parse } from 'superjson';
import { createTRPCSvelte } from 'trpc-svelte-query';
import { LayoutLoad } from './$types';

export const load: LayoutLoad = async (event) => {
	depends('supabase:auth');

	const trpc = createTRPCSvelte<typeof trpcRouter>({
		links: [
			httpBatchLink({
				url: 'http://localhost:5173/api/trpc',
				fetch: event.fetch
			})
		],
		transformer: SuperJSON
	});

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
						return JSON.stringify(data.session);
					}
				}
		  });

	/**
	 * It's fine to use `getSession` here, because on the client, `getSession` is
	 * safe, and on the server, it reads `session` from the `LayoutData`, which
	 * safely checked the session using `safeGetSession`.
	 */
	const {
		data: { session }
	} = await supabase.auth.getSession();

	return { supabase, session, trpc };
};
