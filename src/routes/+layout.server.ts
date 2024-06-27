import { trpcServer } from '$lib/server/trpc/trpcServer';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	const { user } = await event.locals.safeGetSession();

	return {
		user,
		trpc: trpcServer.hydrateToClient(event)
	};
};
