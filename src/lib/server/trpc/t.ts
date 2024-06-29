import { TRPCError, initTRPC } from '@trpc/server';
import SuperJSON from 'superjson';
import type { Context, Meta } from './context';

import { fetchAppleToken, fetchSoundcloudToken, fetchSpotifyToken } from './authHelpers';

export const t = initTRPC
	.context<Context>()
	.meta<Meta>()
	.create({
		transformer: SuperJSON,
		defaultMeta: {
			service: 'spotify'
		}
	});

export const router = t.router;

//Check if user request is authed
const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
	if (!ctx.session) {
		throw new TRPCError({ code: 'UNAUTHORIZED' });
	}

	return next({
		ctx: {
			// infers the `user` as non-nullable
			user: { ...ctx.session.user }
		}
	});
});

export const superSecretProc = t.procedure.use(enforceUserIsAuthed);

export const spicySearchProc = t.procedure.use(
	enforceUserIsAuthed.unstable_pipe(async (opts) => {
		const { ctx } = opts;
		const searchToken = await fetchSpotifyToken();

		return opts.next({
			ctx: {
				user: { ...ctx.session?.user },

				// enrich context with auth token
				searchToken
			}
		});
	})
);

export const betterSearchProc = t.procedure.use(
	enforceUserIsAuthed.unstable_pipe(async (opts) => {
		const { ctx, meta, next } = opts;
		let spotifyToken = '';
		let appleToken = '';
		let soundcloudToken = '';
		let builtCtx = {};

		console.debug('preferred service - ' + meta?.service);
		switch (meta?.service as 'spotify' | 'apple' | 'soundcloud' | 'all') {
			case 'spotify':
				spotifyToken = await fetchSpotifyToken();
				builtCtx = {
					user: ctx.user,
					// enrich context with auth token
					spotifyToken
				};
				break;
			case 'apple':
				appleToken = await fetchAppleToken();
				builtCtx = {
					user: ctx.user,
					// enrich context with auth token
					appleToken
				};
				break;
			case 'soundcloud':
				soundcloudToken = await fetchSoundcloudToken();
				builtCtx = {
					user: ctx.user,
					// enrich context with auth token
					soundcloudToken
				};
				break;
			case 'all':
				spotifyToken = await fetchSpotifyToken();
				appleToken = await fetchAppleToken();
				soundcloudToken = await fetchSoundcloudToken();
				return next({
					ctx: {
						user: ctx.user,
						// all service tokens
						spotifyToken,
						appleToken,
						soundcloudToken
					}
				});
			default:
				throw new TRPCError({ code: 'BAD_REQUEST', message: 'Unsupported service provided' });
		}
		return next({
			ctx: builtCtx
		});
	})
);

export const publicProc = t.procedure;
