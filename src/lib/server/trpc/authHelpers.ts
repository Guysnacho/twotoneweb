import { APPLE_SERVICE_KEY, ISS_ID, KEY_ID, SEARCH_SECRET } from '$env/static/private';
import { fetchSavedToken, saveToken } from '$lib/musicHelper';
import { TRPCError } from '@trpc/server';
import { stringify } from 'querystring';

import jswt from 'jsonwebtoken';

export const fetchSpotifyToken = async () => {
	// Fetch spotify auth token
	const authorization = await fetch('https://accounts.spotify.com/api/token', {
		method: 'POST',
		headers: {
			Authorization: 'Basic ' + SEARCH_SECRET,
			'Content-Type': 'application/x-www-form-urlencoded',
			'Cache-Control': 'max-age=3600'
		},
		body: stringify({
			grant_type: 'client_credentials'
		})
	});

	if (!authorization.ok) {
		throw new TRPCError({
			code: 'FORBIDDEN',
			message: 'Something went wrong while fetching auth token, try again in a minute.'
		});
	}

	const searchToken = (await authorization.json()).access_token;
	console.debug('Successfully fetched spotify token - %s', searchToken);
	return searchToken;
};

export const fetchAppleToken = async () => {
	const token = await fetchSavedToken();
	console.debug('Token present in db ? ' + token !== undefined);

	// If we have an unexpired token
	if (token !== undefined && token !== '') {
		return token;
	} else {
		const issued_at = new Date();

		let appleJwt = '';
		console.log('jswt');
		console.log(jswt);
		try {
			appleJwt = jswt.sign(
				{},
				'-----BEGIN PRIVATE KEY-----\n' + APPLE_SERVICE_KEY + '\n-----END PRIVATE KEY-----',
				{
					algorithm: 'ES256',
					expiresIn: '24h',
					issuer: ISS_ID,
					header: { alg: 'ES256', kid: KEY_ID }
				}
			);
		} catch (error) {
			console.error(error);
			throw new Error('Ran into an issue calling Apple');
		}
		console.debug('Successfully built developer token - %s', appleJwt);
		await saveToken(appleJwt, issued_at);
		return appleJwt;
	}
};

export const fetchSoundcloudToken = async () => {
	// Fetch spotify auth token
	const authorization = await fetch('https://accounts.spotify.com/api/token', {
		method: 'POST',
		headers: {
			Authorization: 'Basic ' + SEARCH_SECRET,
			'Content-Type': 'application/x-www-form-urlencoded',
			'Cache-Control': 'max-age=3600'
		},
		body: stringify({
			grant_type: 'client_credentials'
		})
	});

	if (!authorization.ok) {
		throw new TRPCError({
			code: 'FORBIDDEN',
			message: 'Something went wrong while fetching auth token, try again in a minute.'
		});
	}

	const searchToken = (await authorization.json()).access_token;
	console.debug('Successfully fetched spotify token - %s', searchToken);
	return searchToken;
};
