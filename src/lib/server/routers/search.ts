import { MUSIC_API_HOST } from '$env/static/private';
import { formatDeezerResults } from '$lib/musicHelper';
import { supabase } from '$lib/supabaseClient';
import { TRPCError } from '@trpc/server';
import querystring from 'querystring';
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

			const supabaseQuery = supabase
				.from('song')
				.select('*')
				.textSearch('full_title', query, {
					type: 'phrase'
				})
				.limit(3);
			const serviceFetch = fetch(
				`${MUSIC_API_HOST}/search?${querystring.stringify({ q: query, limit: 7 })}`
			);

			const [supaResults, serviceResults] = await Promise.all([supabaseQuery, serviceFetch]);

			if (supaResults.error) {
				throw new TRPCError({ code: 'FORBIDDEN' });
			}

			// Remove duplicate record from service is service id matches
			if (supaResults.data?.length) {
				const deezResults = formatDeezerResults((await serviceResults.json()).data);
				const savedServiceIds = supaResults.data
					.map((supaResult) => supaResult.service_id)
					.toString();
				const filteredDeez = deezResults.filter(
					(result) => !savedServiceIds.includes(result.service_id)
				);
				return [...supaResults.data, ...filteredDeez];
			}

			return formatDeezerResults((await serviceResults.json()).data);
		})
});
