import SuperJSON from 'superjson';
import { createTRPCSvelte, httpBatchLink } from 'trpc-svelte-query';
import type { TrpcRouter } from './server/trpc/router';

export const trpc = createTRPCSvelte<TrpcRouter>({
	transformer: SuperJSON,
	links: [
		httpBatchLink({
			// here's our batching!
			url: '/api/trpc' // to api handlers we defined before
		})
	]
});
