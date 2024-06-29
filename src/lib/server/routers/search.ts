import { APPLE_API_HOST, MUSIC_API_HOST } from '$env/static/private';
import { filterSongs, formatAppleResults, formatSpotifyResults } from '$lib/musicHelper';
import { TRPCError } from '@trpc/server';
import querystring from 'querystring';
import { z } from 'zod';
import { betterSearchProc, router, spicySearchProc } from '../trpc/t';

export const searchRouter = router({
	/**
	 * Spotify search, default
	 */
	song: spicySearchProc
		.meta({ service: 'spotify' })
		.input(
			z.object({
				query: z.string().min(2).describe('text used to search for song')
			})
		)
		.query(async ({ ctx: { searchToken, supabase }, input: { query } }) => {
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
				const filteredSongs = filterSongs(supaResults.data, spottyResults);

				console.debug('sending results');
				return [...supaResults.data, ...filteredSongs];
			}

			return formatSpotifyResults(spottyResponse.tracks.items);
		}),
	reconcile: betterSearchProc
		.meta({ service: 'all' })
		.input(
			z.object({
				service: z
					.enum(['spotify', 'apple'])
					.describe("User's preferred service // invalid service provided"),
				title: z
					.string()
					.min(2)
					.describe("Song title we're searching for // Song title we're searching for"),
				artist: z
					.string()
					.min(2)
					.describe("Artist we're searching for // Artist we're searching for")
			})
		)
		.mutation(
			async ({
				ctx: { spotifyToken, appleToken, supabase },
				input: { service, artist, title }
			}) => {
				console.debug(`Song search for ${title} by ${artist}`);
				if (query.length < 2) {
					throw new TRPCError({ code: 'BAD_REQUEST', message: 'Title not long enough...' });
				}

				const serviceFetch = fetch(
					`$MUSIC_API_HOST?${querystring.stringify({ q: query, type: 'track', limit: 7 })}`,
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

					const filteredSongs = filterSongs(supaResults.data, spottyResults);
					console.debug('sending results');
					return [...supaResults.data, ...filteredSongs];
				}

				return formatSpotifyResults(spottyResponse.tracks.items);
			}
		),
	spotify: betterSearchProc
		.meta({ service: 'spotify' })
		.input(
			z.object({
				query: z
					.string()
					.min(2)
					.describe("text used to search for song // song title and artist we're searching for")
			})
		)
		.query(async ({ ctx: { spotifyToken, supabase }, input: { query } }) => {
			if (query.length < 2) {
				throw new TRPCError({ code: 'BAD_REQUEST', message: 'Title not long enough...' });
			}

			console.debug('Song search for ' + query);

			const supabaseQuery = supabase
				.rpc('search_songs_by_service', {
					prefix: query.replaceAll(' ', '+'),
					selected_service: 'spotify'
				})
				.limit(3);
			const serviceFetch = fetch(
				`${MUSIC_API_HOST}?${querystring.stringify({ q: query, type: 'track', limit: 7 })}`,
				{
					headers: {
						Authorization: 'Bearer ' + spotifyToken
					}
				}
			);

			const [supaResults, serviceResults] = await Promise.all([supabaseQuery, serviceFetch]);

			if (supaResults.error) {
				console.error('Supabase search query failed');
				console.error(supaResults.error);
				throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: supaResults.error.message });
			}
			const spottyResponse = await serviceResults.json();

			if (spottyResponse.error) {
				console.error(spottyResponse.error);
				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: 'Ran into an issue calling Spotify',
					cause: spottyResponse.error.message
				});
			}

			console.debug('new spotty response');
			console.debug(spottyResponse);

			// Remove duplicate record from service is service id matches
			if (supaResults.data?.length) {
				const spottyResults = formatSpotifyResults(spottyResponse.tracks.items);

				const filteredSongs = filterSongs(supaResults.data, spottyResults);
				console.debug('sending results');
				return [...supaResults.data, ...filteredSongs];
			}

			return formatSpotifyResults(spottyResponse.tracks.items);
		}),
	apple: betterSearchProc
		.meta({ service: 'apple' })
		.input(
			z.object({
				query: z.string().min(2).describe('text used to search for song')
			})
		)
		.query(async ({ ctx: { appleToken, supabase }, input: { query } }) => {
			if (query.length < 2) {
				throw new TRPCError({ code: 'BAD_REQUEST', message: 'Title not long enough...' });
			}

			console.debug('Song search for ' + query);

			const supabaseQuery = supabase
				.rpc('search_songs_by_service', {
					prefix: query.replaceAll(' ', '+'),
					selected_service: 'apple'
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
						Authorization: 'Bearer ' + appleToken
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

				const filteredSongs = filterSongs(supaResults.data, appleResults);
				console.debug('sending results');
				return [...supaResults.data, ...filteredSongs];
			}

			return formatAppleResults(appleResponse);
		})
});
