import { MUSIC_API_HOST } from '$env/static/private';
import { HttpCodes } from '$lib/constants';
import { formatDeezerResults, isValidSearchRequest } from '$lib/musicHelper';
import { supabase } from '$lib/supabaseClient';
import { error, json, type RequestHandler } from '@sveltejs/kit';
import querystring from 'querystring';

/**
 * @description Search deezer for a song
 */
export const GET = (async ({ url }) => {
	const track = isValidSearchRequest(url);

	if (track === undefined) {
		throw error(HttpCodes.BADREQUEST, {
			code: HttpCodes.BADREQUEST,
			message: 'Invalid search request'
		});
	}

	const supabaseQuery = supabase
		.from('song')
		.select('*')
		.textSearch('full_title', track, {
			type: 'phrase'
		})
		.limit(3);
	const serviceFetch = fetch(`${MUSIC_API_HOST}/search?${querystring.stringify({ q: track })}`);

	const [supaResults, serviceResults] = await Promise.all([supabaseQuery, serviceFetch]);

	if (supaResults.data?.length) {
		return json([...supaResults.data, ...formatDeezerResults((await serviceResults.json()).data)]);
	}

	return json(formatDeezerResults((await serviceResults.json()).data));
}) satisfies RequestHandler;
