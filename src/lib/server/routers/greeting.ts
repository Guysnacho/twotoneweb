import { z } from 'zod';
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

function getTimeOfWithDate(date: Date) {
	const curHr = date.getHours();

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
		const { data, error } = await supabase
			.from('users')
			.select('*')
			.eq('id', session?.user.id)
			.single();
		const name = data!.username;
		return `Good ${getTimeOfDay()}${name ? ' ' + name : ''}!`;
	}),
	greetWTime: publicProc
		.input(
			z.object({
				date: z.date({}).describe('text used to search for song')
			})
		)
		.query(async ({ ctx: { session, supabase }, input: { date } }) => {
			const { data, error } = await supabase
				.from('users')
				.select('*')
				.eq('id', session?.user.id)
				.single();
			console.debug('Greeting event with date');
			const name = data!.username;
			return `Good ${getTimeOfWithDate(date)}${name}!`;
		})
});
