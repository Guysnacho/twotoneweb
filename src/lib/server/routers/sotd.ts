import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { router, superSecretProc } from '../trpc/t';

export const sotdRouter = router({
	getById: superSecretProc
		.input(
			z.object({
				id: z.string().min(1).describe('User id for sotd results')
			})
		)
		.query(async ({ ctx: { supabase }, input: { id } }) => {
			const supabaseQuery = await supabase
				.from('sotd')
				.select(
					'id, content, created_at, song(service_id, title, album, artists, album_art, explicit, preview_url)'
				)
				.eq('user_id', id)
				.order('created_at', { ascending: false })
				.limit(10);
			if (supabaseQuery.error) {
				throw new TRPCError({ code: 'FORBIDDEN' });
			}
			console.debug('Fetched Songs of the day for user %s', id);

			return supabaseQuery.data;
		})
});
