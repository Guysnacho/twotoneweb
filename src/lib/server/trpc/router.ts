import { announcementsRouter, greetingRouter, searchRouter, sotdRouter } from '../routers';
import { router } from './t';

export const trpcRouter = router({
	sotd: sotdRouter,
	greeting: greetingRouter,
	search: searchRouter,
	announcements: announcementsRouter
});
