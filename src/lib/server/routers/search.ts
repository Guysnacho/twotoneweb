import { MUSIC_API_HOST } from '$env/static/private';
import { formatSpotifyResults } from '$lib/musicHelper';
import { supabase } from '$lib/supabaseClient';
import { TRPCError } from '@trpc/server';
import querystring from 'querystring';
import { z } from 'zod';
import { router, spicySearchProc } from '../trpc/t';

export const searchRouter = router({
	song: spicySearchProc
		.input(
			z.object({
				query: z.string().min(2).describe('text used to search for song')
			})
		)
		.query(async ({ ctx: { searchToken }, input: { query } }) => {
			if (query.length < 2) {
				throw new TRPCError({ code: 'BAD_REQUEST', message: 'Title not long enough...' });
			}

			console.debug('Song search for ' + query);

			const supabaseQuery = supabase
				.from('song')
				.select('*')
				.textSearch('full_title', query, {
					type: 'phrase'
				})
				.limit(3);
			const serviceFetch = fetch(
				`${MUSIC_API_HOST}?${querystring.stringify({ q: query, type: 'track', limit: 7 })}`,
				{
					headers: {
						Authorization: 'Bearer ' + searchToken
					}
				}
			);

			const [supaResults, serviceResults] = await Promise.all([supabaseQuery, serviceFetch]);

			if (supaResults.error) {
				throw new TRPCError({ code: 'FORBIDDEN' });
			}
			const spottyResponse = await serviceResults.json();

			// Remove duplicate record from service is service id matches
			if (supaResults.data?.length) {
				const spottyResults = formatSpotifyResults(spottyResponse.tracks.items);
				const savedServiceIds = supaResults.data
					.map((supaResult) => supaResult.service_id)
					.toString();
				const filteredSongs = spottyResults.filter(
					(result) => !savedServiceIds.includes(result.service_id)
				);
				return [...supaResults.data, ...filteredSongs];
			}

			return formatSpotifyResults(spottyResponse.tracks.items);
		})
});
