import { LASTFM_API_HOST, LASTFM_KEY } from '$env/static/private';
import { formatLastFmResults } from '$lib/musicHelper';
import { supabase } from '$lib/supabaseClient';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { router, superSecretProc } from '../trpc/t';

export const searchRouter = router({
	song: superSecretProc
		.input(
			z.object({
				query: z.string().min(2).describe('text used to search for song')
			})
		)
		.query(async ({ input: { query } }) => {
			if (query.length < 2) {
				throw new TRPCError({ code: 'BAD_REQUEST', message: 'Title not long enough...' });
			}

			console.log('Query Attempt');

			const supabaseQuery = await supabase
				.from('song')
				.select('*')
				.textSearch('full_title', query, {
					type: 'phrase'
				})
				.limit(3);
			const serviceFetch = await fetch(
				`${LASTFM_API_HOST}/?method=track.search&track=${query}&limit=10&api_key=${LASTFM_KEY}&format=json`
			);
			const lastFmResults = (await serviceFetch.json()).results.trackmatches.track;
			if (supabaseQuery.error) {
				throw new TRPCError({ code: 'FORBIDDEN' });
			}

			if (supabaseQuery.data?.length) {
				return [...supabaseQuery.data, ...formatLastFmResults(lastFmResults)];
			}
			return formatLastFmResults(lastFmResults);
		})
});
