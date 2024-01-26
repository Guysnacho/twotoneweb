import { greetingRouter, sotdRouter } from '../routers';
import { router } from './t';

export const trpcRouter = router({
	sotd: sotdRouter,
	greeting: greetingRouter
});

export type TrpcRouter = typeof router
