import { HttpCodes } from '$lib/constants';
import { supabase } from '$lib/supabaseClient';
import { error, json, type RequestHandler } from '@sveltejs/kit';

/**
 * @description Handle password reset
 */
export const POST: RequestHandler = async ({ request }) => {
	const payload: {
		email: string;
		password: string;
		token: string;
		tokenHash: string;
	} | null = await isValidResetRequest(request);

	if (!payload) {
		throw error(HttpCodes.BADREQUEST, {
			code: HttpCodes.BADREQUEST,
			message: 'Invalid recovery request'
		});
	}

	return await supabase.auth
		.verifyOtp({
			token_hash: payload.tokenHash,
			type: 'recovery'
		})
		.then(async (res) => {
			console.log('Verified OTP');
			console.log(res);
			if (res.error) {
				console.log('Verified OTP | Error');
				console.log(res.error);
				throw error(res.error.status || HttpCodes.INTERNALERROR, {
					code: res.error?.status || HttpCodes.INTERNALERROR,
					message: res.error?.message
				});
			}
			return await supabase.auth.admin
				.updateUserById(res.data.user?.id || '', { password: payload.password })
				.then(async (res) => {
					console.log('Returned user by id');
					console.log(res);

					if (res.data?.user != null) {
						console.log('Sent email confirmation');
						return json('Password reset successful', {
							status: 201
						});
					} else {
						throw error(res.error?.status || HttpCodes.INTERNALERROR, {
							code: res.error?.status || HttpCodes.INTERNALERROR,
							message: res.error?.message || 'Internal Error'
						});
					}
				})
				.catch((err) => {
					throw error(err.error.status || HttpCodes.INTERNALERROR, {
						code: err.error.status,
						message: err.error.message
					});
				});
		})
		.catch((err) => {
			throw error(err.error.status || HttpCodes.INTERNALERROR, {
				code: err.error.status,
				message: err.error.message + ' Bad OTP'
			});
		});
};

/**
 * Validates pw reset request
 * @param request
 * @returns result of auth validation
 */
const isValidResetRequest = async (request: Request) => {
	return await request
		.json()
		.then((payload: { email: string; password: string; token: string; tokenHash: string }) => {
			console.log('payload');
			console.log(payload);

			if (
				payload.email == null ||
				payload.password == null ||
				payload.token == null ||
				payload.tokenHash == null
			) {
				return null;
			} else return payload;
		})
		.catch(() => {
			console.debug('Password reset request body');
			console.debug(request.body);

			error(HttpCodes.BADREQUEST, {
				code: HttpCodes.BADREQUEST,
				message: "Couldn't understand request"
			});
		});
};
