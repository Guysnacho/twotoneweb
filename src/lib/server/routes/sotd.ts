import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { router, superSecretProc } from '../trpc/t';

export const sotdRouter = router({
	getById: superSecretProc
		.input(
			z.object({
				id: z.string()
			})
		)
		.query(async ({ ctx: { supabase }, input: { id } }) => {
			const supabaseQuery = await supabase
				.from('sotd')
				.select('*')
				.eq('user_id', id)
				.order('created_at')
				.limit(12);
			if (supabaseQuery.error) {
				throw new TRPCError({ code: 'FORBIDDEN' });
			}
			console.debug('Fetched Songs of the day for user %s', id);

			return supabaseQuery.data;
		})
});
