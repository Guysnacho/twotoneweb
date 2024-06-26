import { createContext } from '$lib/server/trpc/context';
import { createTRPCSvelteServer } from 'trpc-svelte-query/server';
import { trpcRouter } from './router';

export const trpcServer = createTRPCSvelteServer({
	batching: { enabled: true },
	endpoint: '/api/trpc',
	router: trpcRouter,
	createContext: createContext,
	onError: ({ path, error, ctx }) =>
		console.debug(`request to ${path} from ${ctx?.requestOrigin} failed with error ${error.message}`)
});
