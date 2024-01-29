import { LASTFM_API_HOST, LASTFM_KEY } from '$env/static/private';
import { HttpCodes } from '$lib/constants';
import { formatLastFmResults, isValidSearchRequest } from '$lib/musicHelper';
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
		.textSearch('full_title', query, {
			type: 'phrase'
		})
		.limit(3);
	const serviceFetch = await fetch(
		`${LASTFM_API_HOST}/?method=track.search&track=${query}&limit=10&api_key=${LASTFM_KEY}&format=json`
	);
	const lastFmResults = (await serviceFetch.json()).results.trackmatches.track;

	if (supabaseQuery.data?.length) {
		return json([...supabaseQuery.data, ...formatLastFmResults(lastFmResults)]);
	}
	return json(formatLastFmResults(lastFmResults));
}) satisfies RequestHandler;

