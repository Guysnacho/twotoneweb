import type { Database } from '$lib/schema';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { router, superSecretProc } from '../trpc/t';

export type SotdWLikes = {
	following: boolean;
	liked: boolean;
	likes: number;
	user: Database['public']['Tables']['users']['Row'];
	song: Database['public']['Tables']['song']['Row'];
} & Database['public']['Tables']['sotd']['Row'];

export type SotdWLikesById = {
	liked: boolean;
	likes: number;
	user: Database['public']['Tables']['users']['Row'];
	song: Database['public']['Tables']['song']['Row'];
} & Database['public']['Tables']['sotd']['Row'];

export const sotdRouter = router({
	/**
	 * @deprecated
	 */
	getById: superSecretProc
		.input(
			z.object({
				id: z.string().describe('User id for sotd results // Must be TwoTone ID')
			})
		)
		.query(async ({ ctx: { supabase }, input: { id } }) => {
			const { data, error } = await supabase
				.from('sotd')
				.select(
					'id, content, created_at, song(service_id, title, album, artists, album_art, explicit, preview_url)'
				)
				.eq('user_id', id)
				.order('created_at', { ascending: false })
				.limit(10);
			if (error) {
				throw new TRPCError({ code: 'FORBIDDEN' });
			}
			console.debug(`Fetched Songs of the day for user ${id}`);

			return data;
		}),
	getPageById: superSecretProc
		.input(
			z.object({
				id: z.string().describe('User id for sotd results // Must be TwoTone ID'),
				page: z.number().describe('Page number of feed // Must be at least page 1')
			})
		)
		.query(async ({ ctx: { supabase }, input: { id, page } }) => {
			const { data, error } = await supabase
				.rpc('get_sotd_w_likes_by_user_id', { persona: id })
				.order('created_at', { ascending: false })
				.range(page * 10, page * 10 + 10)
				.limit(10)
				.returns<SotdWLikesById[]>();
			if (error) {
				throw new TRPCError({ code: 'FORBIDDEN' });
			}
			console.debug(`Fetched Page ${page} Songs of the day for user ${id}`);

			return data;
		}),
	getFeed: superSecretProc.query(
		async ({
			ctx: {
				supabase,
				session: { user }
			}
		}) => {
			const { data, error } = await supabase
				.from('sotd')
				.select(
					'id, content, created_at, song(service_id, title, album, artists, album_art, explicit, preview_url), user:users(*)'
				)
				.order('created_at', { ascending: false })
				.limit(15);

			if (error) {
				throw error;
			}

			console.debug(`Fetched Feed for user ${user.id}`);
			return data;
		}
	),
	getFeedPage: superSecretProc
		.input(
			z.object({
				page: z.number().describe('Page number of feed // Must be at least page 1')
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
				const { data, error } = await supabase
					.rpc('get_sotd_w_likes_following_by_user_id', { persona: user.id }, { count: 'exact' })
					.range(page * 15, page * 15 + 15)
					.limit(15)
					.returns<SotdWLikes[]>();

				if (error) {
					throw error;
				}

				console.debug(`Fetched page ${page} of Feed for user ${user.id}`);
				return data;
			}
		)
});
