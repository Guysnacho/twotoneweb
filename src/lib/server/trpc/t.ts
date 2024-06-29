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
		let builtCtx = {
			user: ctx.user,
			spotifyToken: '',
			appleToken: '',
			soundcloudToken: ''
		};

		console.debug('preferred service - ' + meta?.service);
		switch (meta?.service as 'spotify' | 'apple' | 'soundcloud' | 'all') {
			// enrich context with tokens
			case 'spotify':
				builtCtx.soundcloudToken = await fetchSpotifyToken();
				break;
			case 'apple':
				builtCtx.appleToken = await fetchAppleToken();
				break;
			case 'soundcloud':
				builtCtx.soundcloudToken = await fetchSoundcloudToken();
				break;
			case 'all':
				builtCtx.spotifyToken = await fetchSpotifyToken();
				builtCtx.appleToken = await fetchAppleToken();
				builtCtx.soundcloudToken = await fetchSoundcloudToken();
				break;
			default:
				throw new TRPCError({ code: 'BAD_REQUEST', message: 'Unsupported service provided' });
		}
		return next({
			ctx: builtCtx
		});
	})
);

export const publicProc = t.procedure;
