import { randomUUID } from 'crypto';
import type { IReleaseMatch } from 'musicbrainz-api';

export interface ServiceResult {
	id: number;
	readable: boolean;
	title: string;
	title_short: string;
	title_version: string;
	link: string;
	duration: number;
	rank: number;
	explicit_lyrics: boolean;
	explicit_content_lyrics: number;
	explicit_content_cover: number;
	preview: string;
	md5_image: string;
	artist: Artist;
	album: Album;
	type: string;
}

export interface Album {
	id: number;
	title: string;
	cover: string;
	cover_small: string;
	cover_medium: string;
	cover_big: string;
	cover_xl: string;
	md5_image: string;
	tracklist: string;
	type: string;
}

export interface Artist {
	id: number;
	name: string;
	link: string;
	picture: string;
	picture_small: string;
	picture_medium: string;
	picture_big: string;
	picture_xl: string;
	tracklist: string;
	type: string;
}

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

export const formatDeezerResults = (songList: ServiceResult[]) => {
	const formattedList = songList.map((song) => {
		return {
			service_id: song.id,
			title: song.title,
			album: song.album.title,
			artists: song.artist.name,
			album_art: song.album.cover_medium,
			preview_url: song.preview
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
