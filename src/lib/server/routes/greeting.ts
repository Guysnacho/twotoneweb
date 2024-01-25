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
	greet: publicProc.query(async () => {
		console.log('attempting greet');

		return `Good ${getTimeOfDay()}!`;
	})
});
