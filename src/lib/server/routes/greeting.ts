import { publicProc, router } from '../trpc/t';

function getTimeOfDay() {
	const today = new Date();
	const curHr = today.getHours();

	if (curHr < 4) {
		return 'night';
	} else if (curHr < 12) {
		return 'morning';
	} else if (curHr < 18) {
		return 'afternoon';
	} else {
		return 'night';
	}
}

export const greetingRouter = router({
	greet: publicProc.query(async ({ ctx: { session, supabase } }) => {
		return `Good ${getTimeOfDay()}${
			session?.user.user_metadata.username ? ' ' + session?.user.user_metadata.username : ''
		}!`;
	})
});
