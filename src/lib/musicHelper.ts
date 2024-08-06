import type { IReleaseMatch } from 'musicbrainz-api';
import type { Database } from './schema';
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

export interface AppleResults {
	id: string;
	type: string;
	href: string;
	attributes: Attributes;
}

export interface Attributes {
	albumName: string;
	genreNames: string[];
	trackNumber: number;
	releaseDate: Date;
	durationInMillis: number;
	isrc: string;
	artwork: Artwork[];
	composerName: string;
	url: string;
	playParams: PlayParams;
	discNumber: number;
	hasCredits: boolean;
	hasLyrics: boolean;
	isAppleDigitalMaster: boolean;
	name: string;
	previews: Preview[];
	contentRating: string;
	artistName: string;
}

export interface Artwork {
	width: number;
	height: number;
	url: string;
	bgColor: string;
	textColor1: string;
	textColor2: string;
	textColor3: string;
	textColor4: string;
}

export interface PlayParams {
	id: string;
	kind: string;
}

export interface Preview {
	url: string;
}

export interface SoundCloudResults {
	kind: SoundcloudResultKind;
	id: number;
	created_at: string;
	duration: number;
	commentable: boolean;
	comment_count: number;
	sharing: SoundCloudSharing;
	tag_list: string;
	streamable: boolean;
	embeddable_by: SoundCloudEmbeddableBy;
	purchase_url: null | string;
	purchase_title: null | string;
	genre: null | string;
	title: string;
	description: null | string;
	label_name: null | string;
	release: null | string;
	key_signature: null | string;
	isrc: null | string;
	bpm: null;
	release_year: number | null;
	release_month: number | null;
	release_day: number | null;
	license: SoundCloudLicense;
	uri: string;
	user: SoundCloudUser;
	permalink_url: string;
	artwork_url: null | string;
	stream_url: null | string;
	download_url: null | string;
	waveform_url: string;
	available_country_codes: null;
	secret_uri: null;
	user_favorite: null;
	user_playback_count: null;
	playback_count: number;
	download_count: number;
	favoritings_count: number;
	reposts_count: number;
	downloadable: boolean;
	access: SoundCloudAccess;
	policy: null;
	monetization_model: null;
}

export enum SoundCloudAccess {
	Blocked = 'blocked',
	Playable = 'playable'
}

export enum SoundCloudEmbeddableBy {
	All = 'all'
}

export enum SoundcloudResultKind {
	Track = 'track'
}

export enum SoundCloudLicense {
	AllRightsReserved = 'all-rights-reserved',
	CcByNcNd = 'cc-by-nc-nd'
}

export enum SoundCloudSharing {
	Public = 'public'
}

export interface SoundCloudUser {
	avatar_url: string;
	id: number;
	kind: SoundCloudUserKind;
	permalink_url: string;
	uri: string;
	username: string;
	permalink: string;
	created_at: string;
	last_modified: string;
	first_name: null | string;
	last_name: null | string;
	full_name: string;
	city: null | string;
	description: null | string;
	country: null | string;
	track_count: number;
	public_favorites_count: number;
	reposts_count: number;
	followers_count: number;
	followings_count: number;
	plan: SoundCloudPlan;
	myspace_name: null;
	discogs_name: null;
	website_title: null | string;
	website: null | string;
	comments_count: number;
	online: boolean;
	likes_count: number;
	playlist_count: number;
	subscriptions: SoundCloudSubscription[];
}

export enum SoundCloudUserKind {
	User = 'user'
}

export enum SoundCloudPlan {
	Free = 'Free',
	ProUnlimited = 'Pro Unlimited'
}

export interface SoundCloudSubscription {
	product: SoundCloudProduct;
}

export interface SoundCloudProduct {
	id: ID;
	name: SoundCloudPlan;
}

export enum ID {
	CreatorProUnlimited = 'creator-pro-unlimited',
	Free = 'free'
}

export type FormattedSong = {
	service_id: string;
	title: string;
	album: string;
	artists: string;
	album_art: string;
	preview_url: string;
	stream_url: string;
	explicit: boolean;
	isrc: string;
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
export const formatSpotifyResults = (songList: SpotifyTrack[]): [] => {
	const formattedList = songList.map((song) => {
		let artistList: string | undefined = undefined;
		song.artists.forEach((val) => {
			!artistList ? (artistList = val.name) : (artistList = artistList + `, ${val.name}`);
		});
		return {
			service_id: song.id,
			title: song.name,
			album: song.album.name,
			artists: artistList,
			album_art:
				song.album.images.length >= 2 ? song.album.images[1].url : song.album.images[0].url,
			preview_url: song.external_urls?.spotify,
			stream_url: song.preview_url,
			explicit: song.explicit,
			isrc: song?.external_ids?.isrc,
			service_name: 'spotify'
		};
	});
	return formattedList;
};

/**
 * @description Trims apple song api response
 * @param songList
 * @returns formattedList
 */
export const formatAppleResults = (songList: AppleResults[]) => {
	const formattedList = songList.map((song) => {
		return {
			service_id: song.id,
			title: song.attributes.name,
			album: song.attributes.albumName,
			artists: song.attributes.artistName,
			album_art:
				song.attributes.artwork && song.attributes.artwork.length > 0
					? song.attributes.artwork[0].url.replace('{h}', '300').replace('{w}', '300')
					: song.attributes.artwork?.url
					? song.attributes.artwork.url.replace('{h}', '300').replace('{w}', '300')
					: '',
			preview_url: song.attributes?.url,
			stream_url:
				song.attributes?.previews && song.attributes.previews.length > 0
					? song.attributes?.previews[0].url
					: song.attributes?.previews?.url
					? song.attributes?.previews?.url
					: '',
			explicit: song.attributes.contentRating == 'explicit',
			isrc: song.attributes.isrc,
			service_name: 'apple'
		};
	});
	return formattedList;
};

/**
 * @description Trims soundcloud song api response
 * @param songList
 * @returns formattedList
 */
export const formatSoundcloudResults = (songList: SoundCloudResults[]) => {
	const formattedList = songList.map((song) => {
		return {
			service_id: song.id,
			title: song.title,
			album: '',
			artists: song.user.full_name,
			album_art: song.artwork_url,
			preview_url: song.permalink_url,
			stream_url: song.stream_url,
			explicit: false,
			isrc: song.isrc,
			service_name: 'soundcloud'
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
	console.debug(data);
	const current = new Date();
	// Not sure why this isn't working yet
	if (current >= new Date(data.expired_at)) {
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

export const filterSongs = (
	supaResults: Database['public']['Tables']['song']['Row'][],
	serviceResults: {
		service_id: string;
		title: string;
		album: string;
		artists: string;
		album_art: string;
		preview_url: string;
		stream_url: string;
		explicit: boolean;
		isrc: string;
	}[]
) => {
	const savedTitles = [''];
	const savedArtists = [''];
	const savedServiceIds = supaResults
		.map((supaResult) => {
			savedTitles.push(supaResult.title.toLocaleLowerCase());
			savedArtists.push(supaResult.artists.toLocaleLowerCase());
			return supaResult.service_id;
		})
		.toString();

	// If service id matches or if title and artist match
	const filteredSongs = serviceResults.filter((result) => {
		if (savedServiceIds.includes(result.service_id)) {
			return false;
		} else if (
			// todo - Drop this if later, now that we're saving per service
			savedArtists.includes(result.artists.toLocaleLowerCase()) &&
			savedTitles.includes(result.title.toLocaleLowerCase())
		) {
			return false;
		}
		return true;
	});

	return filteredSongs;
};
