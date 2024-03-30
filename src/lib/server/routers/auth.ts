import { z } from 'zod';
import { publicProc, router } from '../trpc/t';
import { SECRET } from '$env/static/private';
import { TRPCError } from '@trpc/server';

export const authRouter = router({
	getSecret: publicProc.query(async () => {
		return SECRET;
	}),
	signUp: publicProc
		.input(
			z.object({
				secret: z.string().describe('Service user auth secret'),
				username: z.string().describe('Username // Tunji'),
				email: z.string().describe('Email // your@email.acme'),
				password: z.string().describe('Password // SuperSafe123')
			})
		)
		.query(async ({ ctx: { supabase }, input }) => {
			if (input.secret !== SECRET)
				throw new TRPCError({ message: 'Incorrect service secret', code: 'FORBIDDEN' });

			return supabase.auth.admin
				.createUser({
					email: input.email,
					password: input.password,
					user_metadata: {
						username: input.username
					}
				})
				.then((res) => {
					if (res.error?.status) {
						throw new TRPCError({
							code: 'INTERNAL_SERVER_ERROR',
							message: res.error.message
						});
					} else if (res.data?.user) {
						return {
							username: res.data.user.user_metadata.username,
							created_at: res.data.user.created_at,
							email_confirm: res.data.user.email_confirmed_at != null
						};
					} else {
						console.error('Error during account creation');
						console.error(res.error?.message);

						throw new TRPCError({
							code: 'INTERNAL_SERVER_ERROR',
							message: 'Error during account creation'
						});
					}
				})
				.catch((err) => {
					console.error('Error during account creation');
					console.error(err);

					throw new TRPCError({
						code: 'INTERNAL_SERVER_ERROR',
						message: 'Error during account creation'
					});
				});
		})
});
