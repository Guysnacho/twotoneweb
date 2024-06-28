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
	greet: publicProc.query(async ({ ctx: { user } }) => {
		return `Good ${getTimeOfDay()}${
			user?.user_metadata.username ? ' ' + user?.user_metadata.username : ''
		}!`;
	}),
	greetWTime: publicProc
		.input(
			z.object({
				date: z.date({}).describe('text used to search for song')
			})
		)
		.query(async ({ ctx: { user }, input: { date } }) => {
			console.debug('Greeting event with date');
			console.debug(date);
			return `Good ${getTimeOfWithDate(date)}${user?.user_metadata.username}!`;
		})
});
