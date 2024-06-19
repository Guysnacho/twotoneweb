import { APPLE_SERVICE_KEY, ISS_ID, KEY_ID, SEARCH_SECRET } from '$env/static/private';
import { fetchSavedToken, saveToken } from '$lib/musicHelper';
import { TRPCError, initTRPC } from '@trpc/server';
import * as jose from 'jose';
import { stringify } from 'querystring';
import SuperJSON from 'superjson';
import type { Context } from './context';

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
		}

		const issued_at = new Date().getMilliseconds();
		const expires_at = new Date().getMilliseconds() + 1000 * 60; //* 60 * 24,
		const appleKey = await jose.importPKCS8(APPLE_SERVICE_KEY, 'ECDH-ES');
		console.debug('Successfully built Apple Music Key - %s', appleKey.type);

		// Build
		const jwt = await new jose.EncryptJWT({
			iss: ISS_ID,
			iat: issued_at,
			// (Milli -> second) -> 1 min -> 1 hour -> 24 hours
			exp: expires_at,
			origin: [
				'http://localhost',
				'http://localhost:5173',
				'https://twotone.app',
				'https://www.twotone.app'
			]
		})
			.setProtectedHeader({ kid: KEY_ID, alg: 'ECDH-ES', enc: 'A128CBC-HS256' })
			.encrypt(appleKey);

		console.debug('Successfully built developer token - %s', jwt);

		await saveToken(jwt, issued_at, expires_at);
		return next({
			ctx: {
				// infers the `session` as non-nullable
				session: { ...ctx.session, user: ctx.session.user },
				// enrich context with auth token
				appleSearchToken: jwt
			}
		});
	})
);

export const publicProc = t.procedure;
