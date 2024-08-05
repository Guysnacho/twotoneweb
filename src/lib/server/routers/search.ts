import { APPLE_API_HOST, MUSIC_API_HOST, SOUNDCLOUD_API_HOST } from '$env/static/private';
import {
	filterSongs,
	formatAppleResults,
	formatSoundcloudResults,
	formatSpotifyResults
} from '$lib/musicHelper';
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
				.rpc('search_songs_by_service', {
					prefix: query.replaceAll(' ', '+'),
					selected_service: 'spotify'
				})
				.limit(3);
			const serviceFetch = fetch(
				`${MUSIC_API_HOST}/search?${querystring.stringify({ q: query, type: 'track', limit: 7 })}`,
				{
					headers: {
						Authorization: 'Bearer ' + searchToken
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
				serviceId: z.string().describe('ID of the song in question // ID of the song in question')
			})
		)
		.mutation(
			async ({
				ctx: { spotifyToken, appleToken, soundcloudToken, supabase },
				input: { service, serviceId }
			}) => {
				console.debug(`Song reconcile started for song id ${serviceId} on ${service}`);
				if (!service || !serviceId) {
					throw new TRPCError({
						code: 'BAD_REQUEST',
						message: 'Either your service or song were empty'
					});
				}
				let serviceFetch;
				let serviceResults = [];

				switch (service) {
					case 'apple':
						serviceFetch = await fetch(`${APPLE_API_HOST}/us/songs/${serviceId}`, {
							headers: {
								Authorization: 'Bearer ' + appleToken
							}
						});
						serviceResults = formatAppleResults((await serviceFetch.json()).data);
						break;
					case 'spotify':
						serviceFetch = await fetch(`${MUSIC_API_HOST}/tracks/${serviceId}`, {
							headers: {
								Authorization: 'Bearer ' + spotifyToken
							}
						});
						serviceResults = formatSpotifyResults([await serviceFetch.json()]);
						break;
					default:
						throw new TRPCError({
							code: 'NOT_FOUND',
							message: 'Either your service, artist, or title were empty'
						});
						break;
				}
				if (serviceResults.length < 1) {
					throw new TRPCError({
						code: 'INTERNAL_SERVER_ERROR',
						message: 'Oop, something went wrong. Please submit some feedback from your settings'
					});
				} else {
					const { status, error } = await supabase.from('song').insert(serviceResults[0]);
					if (error) {
						console.error(error);
						throw new TRPCError({
							code: 'INTERNAL_SERVER_ERROR',
							message: 'So close, something went wrong during the save.'
						});
					} else {
						return status;
					}
				}
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
				`${MUSIC_API_HOST}/search?${querystring.stringify({ q: query, type: 'track', limit: 7 })}`,
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
				console.error('Supabase search query failed');
				console.error(supaResults.error);
				throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: supaResults.error.message });
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
		}),
	soundcloud: betterSearchProc
		.meta({ service: 'soundcloud' })
		.input(
			z.object({
				query: z.string().min(2).describe('text used to search for song')
			})
		)
		.query(async ({ ctx: { soundcloudToken, supabase }, input: { query } }) => {
			if (query.length < 2) {
				throw new TRPCError({ code: 'BAD_REQUEST', message: 'Title not long enough...' });
			}

			console.debug('Song search for ' + query);

			const supabaseQuery = supabase
				.rpc('search_songs_by_service', {
					prefix: query.replaceAll(' ', '+'),
					selected_service: 'soundcloud'
				})
				.limit(3);
			const serviceFetch = fetch(
				`${SOUNDCLOUD_API_HOST}/tracks?${querystring.stringify({
					q: query,
					access: 'playable,preview,blocked',
					limit: 10
				})}`,
				{
					headers: {
						Authorization: 'OAuth ' + soundcloudToken
					}
				}
			);

			const [supaResults, serviceResults] = await Promise.all([supabaseQuery, serviceFetch]);

			if (supaResults.error) {
				throw new TRPCError({ code: 'FORBIDDEN' });
			}

			if (!serviceResults.ok) {
				console.error('Soundcloud search error - ');
				console.error(serviceResults.status);
				console.error(serviceResults.statusText);
				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: 'Something went wrong checking with ☁️, try again later :)'
				});
			}

			const soundcloudResponse = (await serviceResults.json()).results.songs.data;

			// Remove duplicate record from service is service id matches
			if (supaResults.data?.length) {
				const soundcloudResults = formatSoundcloudResults(soundcloudResponse);

				const filteredSongs = filterSongs(supaResults.data, soundcloudResults);
				console.debug('sending results');
				return [...supaResults.data, ...filteredSongs];
			}

			return formatSoundcloudResults(soundcloudResponse);
		})
});
