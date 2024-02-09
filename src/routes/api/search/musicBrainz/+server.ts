import { HttpCodes } from '$lib/constants';
import { mbApi } from '$lib/musicBrainzClient';
import { formatMusicBrainzResults, isValidSearchRequest } from '$lib/musicHelper';
import { supabase } from '$lib/supabaseClient';
import { error, json, type RequestHandler } from '@sveltejs/kit';

/**
 * @description Search Discogs for a song
 */
export const GET = (async ({ url }) => {
	const track = isValidSearchRequest(url);
	const artist = url.searchParams.get('artist');

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
	const serviceFetch = mbApi.search('release', {
		query: `query=${track}`,
		artist: artist || undefined,
		inc: ['genres', 'tags'],
		limit: 15
	});

	const [supaResults, serviceResults] = await Promise.all([supabaseQuery, serviceFetch]);

	if (supaResults.data?.length) {
		return json([...supaResults.data, ...formatMusicBrainzResults(serviceResults.releases)]);
	}

	// const coverApi = new CoverArtArchiveApi()
	// const cover = await coverApi.getReleaseCovers("0c03fac2-05b9-4d20-bac4-dcecb4cc9560")
	// console.log(cover);

	return json(serviceResults.releases);
}) satisfies RequestHandler;
