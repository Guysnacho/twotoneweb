import { greetingRouter, searchRouter, sotdRouter, authRouter } from '../routers';
import { router } from './t';

export const trpcRouter = router({
	auth: authRouter,
	sotd: sotdRouter,
	greeting: greetingRouter,
	search: searchRouter
});

export type TrpcRouter = typeof router;
