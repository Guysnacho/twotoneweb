import { sotdRouter } from '$lib/routes/sotd';
import type { Context } from '$lib/trpc/context';
import { TRPCError, initTRPC, type inferRouterInputs, type inferRouterOutputs } from '@trpc/server';
import superJson from 'superjson';

export const t = initTRPC.context<Context>().create({
	transformer: superJson
});

export const router = t.router({
	sotd: sotdRouter
});

// export type definition of API
export type Router = typeof router;

export type RouterInputs = inferRouterInputs<Router>;

export type RouterOutputs = inferRouterOutputs<Router>;

//Check if user request is authed
const isAuthed = t.middleware(({ ctx, next }) => {
	if (!ctx.session || !ctx.session.user) {
		throw new TRPCError({ code: 'UNAUTHORIZED' });
	}
	return next({
		ctx: {
			session: { ...ctx.session, user: ctx.session.user }
		}
	});
});

export const superSecretProc = t.procedure.use(isAuthed);

export const publicProc = t.procedure;
