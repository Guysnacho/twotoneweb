import { TRPCError } from '@trpc/server';
import SuperJSON from 'superjson';

import { publicProc, router } from '../trpc/t';

export const announcementsRouter = router({
	get: publicProc.query(async ({ ctx: { supabase } }) => {
		const { data, error } = await supabase.storage
			.from('static')
			.download('notifications/announcements.json', { transform: { format: 'origin' } });
		if (data) {
			console.debug('Fetched announcements');
			const string = await data.text();
			console.debug(string);
			const parsed = JSON.parse(string);
			console.debug(parsed);
			return parsed;
		}

		if (error) {
			console.debug('Issue while fetching announcements');
			throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message });
		} else {
			console.debug('No announcements');
			throw new TRPCError({ code: 'NOT_FOUND' });
		}
	})
});
