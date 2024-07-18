import {
	announcementsRouter,
	greetingRouter,
	searchRouter,
	sotdRouter,
	userRouter
} from '../routers';
import { router } from './t';

export const trpcRouter = router({
	sotd: sotdRouter,
	greeting: greetingRouter,
	search: searchRouter,
	announcements: announcementsRouter,
	user: userRouter
});

export type TrpcRouter = typeof trpcRouter;
