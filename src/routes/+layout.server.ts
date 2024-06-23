import { trpcServer } from '$lib/server/trpc/trpcServer';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	const { session, user } = await event.locals.safeGetSession();

	return {
		session,
		user,
		trpc: trpcServer.hydrateToClient(event)
	};
};
