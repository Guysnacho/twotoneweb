import { createContext } from '$lib/server/trpc/context';
import { init } from '@aptabase/web';
import { createTRPCSvelteServer } from 'trpc-svelte-query/server';
import { trpcRouter } from './router';

init('A-US-3188236203'); // 👈 this is where you enter your App Key

export const trpcServer = createTRPCSvelteServer({
	batching: { enabled: true },
	endpoint: '/api/trpc',
	router: trpcRouter,
	createContext: createContext,
	onError: ({ path, error, ctx }) =>
		console.log(
			`request to ${path} from ${ctx?.requestOrigin || ctx?.event.platform} failed with error ${
				error.message
			}`
		)
});
