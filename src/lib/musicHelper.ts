import type { IReleaseMatch } from 'musicbrainz-api';
import { supabase } from './supabaseClient';

/**
 * @deprecated
 */
export interface DeezerServiceResult {
	id: string;
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
	artist: DeezerArtist;
	album: DeezerAlbum;
	type: string;
}

/**
 * @deprecated
 */
export interface DeezerAlbum {
	id: string;
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

/**
 * @deprecated
 */
export interface DeezerArtist {
	id: string;
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

export interface SpotifyTrack {
	album: SpotifyAlbum;
	artists: SpotifyArtist[];
	disc_number: number;
	duration_ms: number;
	explicit: boolean;
	external_ids: SpotifyExternalIDS;
	external_urls: SpotifyExternalUrls;
	href: string;
	id: string;
	is_local: boolean;
	name: string;
	popularity: number;
	preview_url: string;
	track_number: number;
	type: string;
	uri: string;
}

export interface SpotifyAlbum {
	album_type: string;
	artists: SpotifyArtist[];
	external_urls: SpotifyExternalUrls;
	href: string;
	id: string;
	images: SpotifyImage[];
	name: string;
	release_date: Date;
	release_date_precision: string;
	total_tracks: number;
	type: string;
	uri: string;
}

export interface SpotifyArtist {
	external_urls: SpotifyExternalUrls;
	href: string;
	id: string;
	name: string;
	type: string;
	uri: string;
}

export interface SpotifyExternalUrls {
	spotify: string;
}

export interface SpotifyImage {
	height: number;
	url: string;
	width: number;
}

export interface SpotifyExternalIDS {
	isrc: string;
}

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

/**
 * @deprecated
 * @description Trims song api response
 * @param songList
 * @returns formattedList
 */
export const formatDeezerResults = (songList: DeezerServiceResult[]) => {
	const formattedList = songList.map((song) => {
		return {
			service_id: song.id,
			title: song.title,
			album: song.album.title,
			artists: song.artist.name,
			album_art: song.album.cover_big,
			preview_url: song.preview,
			explicit: song.explicit_lyrics
		};
	});
	return formattedList;
};

/**
 * @description Trims song api response
 * @param songList
 * @returns formattedList
 */
export const formatSpotifyResults = (songList: SpotifyTrack[]) => {
	const formattedList = songList.map((song) => {
		let artistList: undefined | string = undefined;
		song.artists.forEach((val) => {
			!artistList ? (artistList = val.name) : (artistList = artistList + `, ${val.name}`);
		});
		return {
			service_id: song.id,
			title: song.name,
			album: song.album.name,
			artists: artistList,
			album_art:
				song.album.images.length >= 2 ? song.album.images[1].url : song.album.images[1].url,
			preview_url: song.external_urls?.spotify,
			stream_url: song.preview_url,
			explicit: song.explicit,
			isrc: song?.external_ids?.isrc
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

/**
 * Fetch Apple token from DB and check if its expired
 * @returns
 */
export const fetchSavedToken = async () => {
	console.debug('Fetching token');
	const { data } = await supabase
		.from('service_tokens')
		.select('*')
		.order('issued_at', { ascending: true })
		.limit(1)
		.maybeSingle();
	if (!data) {
		console.debug('Apple Token not found');
		return undefined;
	}
	const current = Math.round(new Date().getTime() / 1000);
	if (current >= data!.expired_at) {
		console.debug('Apple Token expired');
		return undefined;
	}
	console.debug('Apple Token retrieved');
	return data?.token;
};

/**
 * Save generated token in DB for refetching later
 * @param token
 * @param issued_at
 * @param expired_at
 */
export const saveToken = async (token: string, issued_at: Date) => {
	await supabase.from('service_tokens').delete();
	const expired_at = new Date();
	expired_at.setDate(issued_at.getDate() + 1);

	const { error } = await supabase
		.from('service_tokens')
		.insert({ expired_at: expired_at.valueOf(), issued_at: issued_at.valueOf(), token });
	if (error) {
		console.debug({ expired_at, issued_at, token });
		console.debug(error);
		throw error;
	} else console.debug('Successfully saved token');
};
