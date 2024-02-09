import { randomUUID } from 'crypto';
import type { IReleaseMatch } from 'musicbrainz-api';

/**
 * @description Trims song api response
 * @param songList
 * @returns formattedList
 */
export const formatSongResults = (songList: [any]) => {
	const formattedList = songList.map((song) => {
		return {
			id: song.id,
			title: song.title.split(' - ')[1],
			artist: song.title.split(' - ')[0],
			genres: song.genre,
			year: song.year,
			label: song.label,
			thumbnail: song.thumb,
			cover: song.cover_image
		};
	});

	console.log('formattedList');
	console.log(formattedList);
	return formattedList;
};

export const formatMusicBrainzResults = (songList: IReleaseMatch[]) => {
	const formattedList = songList.map((song) => {
		return {
			id: song.id,
			title: song.title,
			artists: song['artist-credit']?.map((artist) => artist.name).toString
		};
	});
	return formattedList;
};

export const formatLastFmResults = (
	songList: [
		{
			name: string;
			artist: string;
			url: string;
			streamable: string;
			listeners: number;
			image: [
				{
					'#text': string;
					size: 'small';
				},
				{
					'#text': string;
					size: 'medium';
				},
				{
					'#text': string;
					size: 'large';
				},
				{
					'#text': string;
					size: 'extralarge';
				}
			];
			mbid: string;
		}
	]
) => {
	const formattedList = songList.map((song) => {
		return {
			id: randomUUID() as string,
			title: song.name,
			artists: song.artist,
			album_art: song.image[2]['#text'] || ''
		};
	});
	return formattedList;
};

/**
 * Validates search request
 * @param
 * @returns result of auth validation
 */
export const isValidSearchRequest = (url: URL) => {
	if (!url.searchParams.has('track') || url.searchParams.get('track')?.length == 0)
		return undefined;
	return url.searchParams.get('track') as string;
};
