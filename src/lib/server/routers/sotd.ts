import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { router, superSecretProc } from '../trpc/t';

export const sotdRouter = router({
	getById: superSecretProc
		.input(
			z.object({
				id: z.string().min(1).describe('User id for sotd results // Must be TwoTone ID')
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
		}),
	getPageById: superSecretProc
		.input(
			z.object({
				id: z.string().min(1).describe('User id for sotd results // Must be TwoTone ID'),
				page: z.number().min(1).describe('Page number of feed // Must be at least page 1')
			})
		)
		.query(async ({ ctx: { supabase }, input: { id, page } }) => {
			const supabaseQuery = await supabase
				.from('sotd')
				.select(
					'id, content, created_at, song(service_id, title, album, artists, album_art, explicit, preview_url)'
				)
				.eq('user_id', id)
				.order('created_at', { ascending: false })
				.range(page * 10, page * 10 + 10)
				.limit(10);
			if (supabaseQuery.error) {
				throw new TRPCError({ code: 'FORBIDDEN' });
			}
			console.debug(`Fetched Page ${page} Songs of the day for user ${id}`);

			return supabaseQuery.data;
		}),
	getFeed: superSecretProc.query(
		async ({
			ctx: {
				supabase,
				session: { user }
			}
		}) => {
			const { data, error, count } = await supabase
				.from('sotd')
				.select(
					'id, content, created_at, song(service_id, title, album, artists, album_art, explicit, preview_url), user:users(*)'
				)
				.order('created_at', { ascending: false })
				.limit(15);

			if (error) {
				throw error;
			}

			console.debug('Fetched Feed for user %s', user.id);
			return data;
		}
	),
	getFeedPage: superSecretProc
		.input(
			z.object({
				page: z.number().min(1).describe('Page number of feed // Must be at least page 1')
			})
		)
		.query(
			async ({
				input: { page },
				ctx: {
					supabase,
					session: { user }
				}
			}) => {
				const { data, error, count } = await supabase
					.from('sotd')
					.select(
						'id, content, created_at, song(service_id, title, album, artists, album_art, explicit, preview_url), user:users(*)'
					)
					.order('created_at', { ascending: false })
					.range(page * 15, page * 15 + 15)
					.limit(15);

				if (error) {
					throw error;
				}

				console.debug(`Fetched page ${page} of Feed for user ${user.id}`);
				return data;
			}
		)
});
