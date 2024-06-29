import { TRPCError } from '@trpc/server';

import { z } from 'zod';
import { publicProc, router, superSecretProc } from '../trpc/t';

export const announcementsRouter = router({
	get: publicProc.query(async ({ ctx: { supabase } }) => {
		const { data, error } = await supabase.storage
			.from('static')
			.download('notifications/announcements.json');
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
	}),
	announce: superSecretProc
		.input(z.object({ announcements: z.array(z.string()) }))
		.mutation(async ({ input, ctx: { supabase, session } }) => {
			const { data, error } = await supabase
				.from('users')
				.select('id,role')
				.eq('id', session?.user.id)
				.single();
			if (error) {
				throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message });
			} else if (data.role !== 'ADMIN') {
				// email alert
				console.debug('Unauthorized user');
				throw new TRPCError({
					code: 'UNAUTHORIZED',
					message: "Not allooowwwed...so you really shouldn've been able to do that. Noted."
				});
			} else {
				console.debug('Attempting update');
				const { data, error } = await supabase.storage
					.from('static')
					.update(
						'notifications/announcements.json',
						JSON.stringify({ features: input.announcements })
					);
				if (error) {
					throw new TRPCError({
						code: 'INTERNAL_SERVER_ERROR',
						message: error.message
					});
				} else {
					console.debug('Mission accomplished. Announcements updated - ' + data?.path);
					return 'mission accomplished';
				}
			}
		})
});
