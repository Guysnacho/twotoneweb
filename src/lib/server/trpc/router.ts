import { greetingRouter, sotdRouter } from '../routes';
import { router } from './t';

export const trpcRouter = router({
	sotd: sotdRouter,
	greeting: greetingRouter
});

export type TrpcRouter = typeof router
