import { trpcServer } from '$lib/server/trpc/trpcServer';
import type { LayoutServerLoad } from './$types';

/**
 * This file is necessary to ensure protection of all routes in the `private`
 * directory. It makes the routes in this directory _dynamic_ routes, which
 * send a server request, and thus trigger `hooks.server.ts`.
 **/
export const load: LayoutServerLoad = async (event) => {
	const { user } = await event.locals.safeGetSession();

	return {
		user,
		trpc: trpcServer.hydrateToClient(event)
	};
};
