import SuperJSON from 'superjson';
import { createTRPCSvelte, httpBatchLink } from 'trpc-svelte-query';

export const trpc = createTRPCSvelte({
	transformer: SuperJSON,
	links: [
		httpBatchLink({
			// here's our batching!
			url: '/api/trpc' // to api handlers we defined before
		})
	]
});
