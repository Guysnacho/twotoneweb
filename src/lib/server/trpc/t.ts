import { APPLE_SERVICE_KEY, ISS_ID, KEY_ID, SEARCH_SECRET } from '$env/static/private';
import { fetchSavedToken, saveToken } from '$lib/musicHelper';
import { TRPCError, initTRPC } from '@trpc/server';
import { stringify } from 'querystring';
import SuperJSON from 'superjson';
import type { Context } from './context';

import * as jswt from 'jsonwebtoken';

export const t = initTRPC.context<Context>().create({
	transformer: SuperJSON
});

export const router = t.router;

//Check if user request is authed

export const superSecretProc = t.procedure.use(
	t.middleware(({ ctx, next }) => {
		if (!ctx.session || !ctx.session.user) {
			throw new TRPCError({ code: 'UNAUTHORIZED' });
		}
		return next({
			ctx: {
				// infers the `session` as non-nullable
				session: { ...ctx.session, user: ctx.session.user }
			}
		});
	})
);

export const spicySearchProc = t.procedure.use(
	t.middleware(async ({ ctx, next }) => {
		if (!ctx.session || !ctx.session.user) {
			throw new TRPCError({ code: 'UNAUTHORIZED' });
		}
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
		console.debug('Successfully fetched token - %s', searchToken);
		return next({
			ctx: {
				// infers the `session` as non-nullable
				session: { ...ctx.session, user: ctx.session.user },
				// enrich context with auth token
				searchToken
			}
		});
	})
);

export const appleSearchProc = t.procedure.use(
	t.middleware(async ({ ctx, next }) => {
		if (!ctx.session || !ctx.session.user) {
			throw new TRPCError({ code: 'UNAUTHORIZED' });
		}

		const token = await fetchSavedToken();
		console.debug('Token present in db ? ' + token !== undefined);

		// If we have an unexpired token
		if (token !== undefined && token !== '') {
			return next({
				ctx: {
					// infers the `session` as non-nullable
					session: { ...ctx.session, user: ctx.session.user },
					// enrich context with auth token
					appleSearchToken: token
				}
			});
		} else {
			const issued_at = new Date();

			const appleJwt = jswt.sign(
				{},
				'-----BEGIN PRIVATE KEY-----\n' + APPLE_SERVICE_KEY + '\n-----END PRIVATE KEY-----',
				{
					algorithm: 'ES256',
					expiresIn: '24h',
					issuer: ISS_ID,
					header: { alg: 'ES256', kid: KEY_ID }
				}
			);
			console.debug('Successfully built developer token - %s', appleJwt);
			await saveToken(appleJwt, issued_at);
			return next({
				ctx: {
					// infers the `session` as non-nullable
					session: { ...ctx.session, user: ctx.session.user },
					// enrich context with auth token
					appleSearchToken: appleJwt
				}
			});
		}
	})
);

export const publicProc = t.procedure;
