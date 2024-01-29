import {
	LASTFM_API_HOST,
	LASTFM_KEY,
	MUSIC_API_HOST,
	MUSIC_KEY,
	MUSIC_SECRET
} from '$env/static/private';
import { HttpCodes } from '$lib/constants';
import { formatLastFmResults } from '$lib/musicHelper';
import { supabase } from '$lib/supabaseClient';
import { error, json, type RequestHandler } from '@sveltejs/kit';

/**
 * @description Search Discogs for a song
 */
export const GET = (async ({ url }) => {
	const query = isValidSearchRequest(url);
	if (query === undefined) {
		throw error(HttpCodes.BADREQUEST, {
			code: HttpCodes.BADREQUEST,
			message: 'Invalid search request'
		});
	}

	const supabaseQuery = await supabase
		.from('song')
		.select('*')
		.textSearch('full_title', query)
		.limit(3);
	const serviceFetch = await fetch(
		`${LASTFM_API_HOST}/?method=track.search&track=${query}&limit=10&api_key=${LASTFM_KEY}&format=json`
	);
	const lastFmResults = (await serviceFetch.json()).results.trackmatches.track;
	console.log(supabaseQuery);
	console.log(lastFmResults);

	return json(formatLastFmResults(lastFmResults));
}) satisfies RequestHandler;

/**
 * Validates search request
 * @param
 * @returns result of auth validation
 */
const isValidSearchRequest = (url: URL) => {
	if (!url.searchParams.has('track') || url.searchParams.get('track')?.length == 0)
		return undefined;
	return url.searchParams.get('track') as string;
};
