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

export const superSecretProc = t.procedure.use(
	t.middleware(({ ctx, next }) => {
		if (!ctx.user) {
			throw new TRPCError({ code: 'UNAUTHORIZED' });
		}
		return next({
			ctx: {
				user: ctx.user
			}
		});
	})
);

export const spicySearchProc = t.procedure.use(
	t.middleware(async ({ ctx, next }) => {
		if (!ctx.user) {
			throw new TRPCError({ code: 'UNAUTHORIZED' });
		}
		const searchToken = await fetchSpotifyToken();

		return next({
			ctx: {
				user: ctx.user,
				// enrich context with auth token
				searchToken
			}
		});
	})
);

export const betterSearchProc = t.procedure
	.input(z.object({ service: z.enum(['spotify', 'apple', 'soundcloud']) }))
	.use(
		t.middleware(async ({ ctx, next }) => {
			if (!ctx.user) {
				throw new TRPCError({ code: 'UNAUTHORIZED' });
			}

			let searchToken = '';
			switch (ctx.event.request.headers.get('service')) {
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
