import { trpcServer } from '$lib/server/trpc/trpcServer';

export const load = async (event) => {
	return {
		greeting: await trpcServer.greeting.greet.ssr(event),
	};
};
