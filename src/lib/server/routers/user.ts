import { TRPCError } from '@trpc/server';
import { router, superSecretProc } from '../trpc/t';

export const userRouter = router({
	delete: superSecretProc.mutation(async ({ ctx: { user, supabase } }) => {
		console.debug('User delete request recieved');

		supabase.auth.admin
			.deleteUser(user.id)
			.then(async (res) => {
				if (res.error?.status) {
					throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: res.error.message });
				} else if (res.data.user) {
					return { id: user.id, deleted_at: new Date() };
				} else {
					throw new TRPCError({
						code: 'INTERNAL_SERVER_ERROR',
						message: 'Error during account deletion, try again later'
					});
				}
			})
			.catch((err) => {
				console.debug(err);
				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: 'Error during account deletion, try again later'
				});
			});
	})
});
