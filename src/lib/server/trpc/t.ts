import { SEARCH_SECRET } from '$env/static/private';
import { TRPCError, initTRPC } from '@trpc/server';
import { stringify } from 'querystring';
import SuperJSON from 'superjson';
import type { Context } from './context';
import { init, trackEvent } from '@aptabase/web';

init('A-US-3188236203'); // 👈 this is where you enter your App Key

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
		trackEvent('spotify_token_request');
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
			trackEvent('spotify_token_request', {
				status: authorization.status,
				message: authorization.statusText
			});
			throw new TRPCError({
				code: 'FORBIDDEN',
				message: 'Something went wrong while fetching auth token, try again in a minute.'
			});
		}

		const searchToken = (await authorization.json()).access_token;
		console.debug('Successfully fetched token - %s', searchToken);
		trackEvent('spotify_token_request_success', { searchToken });
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

export const publicProc = t.procedure;
