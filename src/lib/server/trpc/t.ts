import { TRPCError, initTRPC } from '@trpc/server';
import SuperJSON from 'superjson';
import type { Context } from './context';

export const t = initTRPC.context<Context>().create({
	transformer: SuperJSON
});

export const router = t.router;

//Check if user request is authed

export const superSecretProc = t.procedure.use(t.middleware(({ ctx, next }) => {
	if (!ctx.session || !ctx.session.user) {
		throw new TRPCError({ code: 'UNAUTHORIZED' });
	}
	return next({
		ctx: {
			// infers the `session` as non-nullable
			session: { ...ctx.session, user: ctx.session.user }
		}
	});
}));

export const publicProc = t.procedure;
