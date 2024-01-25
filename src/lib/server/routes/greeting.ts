import { TRPCError } from '@trpc/server';
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
	greet: publicProc.query(async ({ ctx: { supabase, session } }) => {
		console.log('attempting greet');

		const profile = await supabase
			.from('users')
			.select('*')
			.eq('user_id', '0101d7f5-07f2-46a4-a19e-5b7a6a31e823')
			.single();
		if (profile.error) {
			throw new TRPCError({ code: 'BAD_REQUEST' });
		}
		const name = profile.data.username;
		return `Good ${getTimeOfDay()}${name ? `, ${name}!` : '!'}`;
	})
});
