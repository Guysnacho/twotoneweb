import { TRPCError, initTRPC } from '@trpc/server';
import SuperJSON from 'superjson';
import type { Context } from './context';

import { z } from 'zod';
import { fetchAppleToken, fetchSoundcloudToken, fetchSpotifyToken } from './authHelpers';

export const t = initTRPC.context<Context>().create({
	transformer: SuperJSON
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

export const betterSearchProc = t.procedure
	.meta(
		z.object({
			service: z.enum(['spotify', 'apple', 'soundcloud'])
		})
	)
	.use(
		enforceUserIsAuthed.unstable_pipe(async (opts) => {
			const { ctx, meta, next } = opts;
			let searchToken = '';
			switch (meta?.service as 'spotify' | 'apple' | 'soundcloud') {
				case 'spotify':
					searchToken = await fetchSpotifyToken();
					break;
				case 'apple':
					searchToken = await fetchAppleToken();
					break;
				case 'soundcloud':
					searchToken = await fetchSoundcloudToken();
					break;
				default:
					throw new TRPCError({ code: 'BAD_REQUEST', message: 'Unsupported service provided' });
			}
			return next({
				ctx: {
					user: ctx.user,
					// enrich context with auth token
					searchToken
				}
			});
		})
	);

export const publicProc = t.procedure;
