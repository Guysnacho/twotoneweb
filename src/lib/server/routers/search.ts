import { APPLE_API_HOST, MUSIC_API_HOST } from '$env/static/private';
import { formatAppleResults, formatSpotifyResults } from '$lib/musicHelper';
import { supabase } from '$lib/supabaseClient';
import { TRPCError } from '@trpc/server';
import querystring from 'querystring';
import { z } from 'zod';
import { betterSearchProc, router, spicySearchProc } from '../trpc/t';

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
				.rpc('search_songs', { prefix: query.replaceAll(' ', '+') })
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
				const savedTitles = [''];
				const savedArtists = [''];
				const savedServiceIds = supaResults.data
					.map((supaResult) => {
						savedTitles.push(supaResult.title.toLocaleLowerCase());
						savedArtists.push(supaResult.artists.toLocaleLowerCase());
						return supaResult.service_id;
					})
					.toString();
				// If service id matches or if title and artist match
				const filteredSongs = spottyResults.filter((result) => {
					if (savedServiceIds.includes(result.service_id)) {
						return false;
					} else if (
						savedArtists.includes(result.artists.toLocaleLowerCase()) &&
						savedTitles.includes(result.title.toLocaleLowerCase())
					) {
						return false;
					}
					return true;
				});
				console.debug('sending results');
				return [...supaResults.data, ...filteredSongs];
			}

			return formatSpotifyResults(spottyResponse.tracks.items);
		}),
	spotify: betterSearchProc
		.input(
			z.object({
				query: z
					.string()
					.min(2)
					.describe("text used to search for song // song title and artist we're searching for")
			})
		)
		.query(async ({ ctx: { searchToken }, input: { query } }) => {
			if (query.length < 2) {
				throw new TRPCError({ code: 'BAD_REQUEST', message: 'Title not long enough...' });
			}

			console.debug('Song search for ' + query);

			const supabaseQuery = supabase
				.rpc('search_songs_by_service', {
					prefix: query.replaceAll(' ', '+'),
					selected_service: 'SPOTIFY'
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
				const savedTitles = [''];
				const savedArtists = [''];
				const savedServiceIds = supaResults.data
					.map((supaResult) => {
						savedTitles.push(supaResult.title.toLocaleLowerCase());
						savedArtists.push(supaResult.artists.toLocaleLowerCase());
						return supaResult.service_id;
					})
					.toString();
				// If service id matches or if title and artist match
				const filteredSongs = spottyResults.filter((result) => {
					if (savedServiceIds.includes(result.service_id)) {
						return false;
					} else if (
						// todo - Drop this if later, now that we're saving per service
						savedArtists.includes(result.artists.toLocaleLowerCase()) &&
						savedTitles.includes(result.title.toLocaleLowerCase())
					) {
						return false;
					}
					return true;
				});
				console.debug('sending results');
				return [...supaResults.data, ...filteredSongs];
			}

			return formatSpotifyResults(spottyResponse.tracks.items);
		}),
	apple: betterSearchProc
		.input(
			z.object({
				query: z.string().min(2).describe('text used to search for song')
			})
		)
		.query(async ({ ctx: { appleSearchToken }, input: { query } }) => {
			if (query.length < 2) {
				throw new TRPCError({ code: 'BAD_REQUEST', message: 'Title not long enough...' });
			}

			console.debug('Song search for ' + query);

			const supabaseQuery = supabase
				.rpc('search_songs_by_service', {
					prefix: query.replaceAll(' ', '+'),
					selected_service: 'APPLE'
				})
				.limit(3);
			//	Find storefronts
			// TODO impl propper storefront use
			//  const serviceFetch = fetch(
			// 	`https://api.music.apple.com/v1/storefronts?${querystring.stringify({
			// 		offset: 100
			// 	})}`,
			// 	{
			// 		headers: {
			// 			Authorization: 'Bearer ' + appleSearchToken
			// 		}
			// 	}
			// );
			const serviceFetch = fetch(
				`${APPLE_API_HOST}/us/search?${querystring.stringify({
					term: query,
					types: ['songs'],
					limit: 7
				})}`,
				{
					headers: {
						Authorization: 'Bearer ' + appleSearchToken
					}
				}
			);

			const [supaResults, serviceResults] = await Promise.all([supabaseQuery, serviceFetch]);

			if (supaResults.error) {
				throw new TRPCError({ code: 'FORBIDDEN' });
			}

			if (!serviceResults.ok) {
				console.error('Apple search error - ');
				console.error(serviceResults.status);
				console.error(serviceResults.statusText);
				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: 'Something went wrong checking with 🍎, try again later :)'
				});
			}

			const appleResponse = (await serviceResults.json()).results.songs.data;

			// Remove duplicate record from service is service id matches
			if (supaResults.data?.length) {
				const appleResults = formatAppleResults(appleResponse);
				const savedTitles: string[] = [];
				const savedArtists: string[] = [];
				const savedServiceIds = supaResults.data
					.map((supaResult) => {
						savedTitles.push(supaResult.title.toLocaleLowerCase());
						savedArtists.push(supaResult.artists.toLocaleLowerCase());
						return supaResult.service_id;
					})
					.toString();
				// If service id matches or if title and artist match
				const filteredSongs = appleResults.filter((result) => {
					if (savedServiceIds.includes(result.service_id)) {
						return false;
					} else if (
						savedArtists.includes(result.artists.toLocaleLowerCase()) &&
						savedTitles.includes(result.title.toLocaleLowerCase())
					) {
						return false;
					}
					return true;
				});
				console.debug('sending results');
				return [...supaResults.data, ...filteredSongs];
			}

			return formatAppleResults(appleResponse);
		})
});
