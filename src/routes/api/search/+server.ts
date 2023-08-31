import { MUSIC_API_HOST, MUSIC_KEY, MUSIC_SECRET } from '$env/static/private';
import { HttpCodes } from '$lib/constants';
import { formatSongResults } from '$lib/musicHelper';
import { error, json, type RequestHandler } from '@sveltejs/kit';

/**
 * @description Search Discogs for a song
 */
export const GET = (async ({ url }) => {
	if (!isValidSearchRequest(url)) {
		throw error(HttpCodes.BADREQUEST, {
			code: HttpCodes.BADREQUEST,
			message: 'Invalid search request'
		});
	}

	// const session = await supabase.auth.getSession();
	// session.data.session.
	// supabase.auth.admin.getUserById()

	return fetch(
		`${MUSIC_API_HOST}/database/search?query=${url.searchParams.get(
			'song'
		)}&type=release&key=${MUSIC_KEY}&secret=${MUSIC_SECRET}&per_page=20`
	)
		.then(async (res) => {
			const data = await res.json();
			return json({ items: data.pagination.items, results: formatSongResults(data.results) });
		})
		.catch((err) => {
			throw error(HttpCodes.INTERNALERROR, { code: HttpCodes.INTERNALERROR, message: err.message });
		});
}) satisfies RequestHandler;

/**
 * Validates search request
 * @param
 * @returns result of auth validation
 */
const isValidSearchRequest = (url: URL) => {
	if (!url.searchParams.has('song')) return false;
	return true;
};
