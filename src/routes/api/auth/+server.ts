import { SECRET } from '$env/static/private';
import { HttpCodes } from '$lib/constants';
import { supabase } from '$lib/supabaseClient';
import { error, json, type RequestHandler } from '@sveltejs/kit';

/**
 * @alias Get api secret
 * @returns secret: encoded secret used to confirm requests
 */
export const GET = (() => {
	return json({
		secret: SECRET
	});
}) satisfies RequestHandler;

/**
 * @description Handle supabase user creation
 */
export const POST = (async ({ request }) => {
	const payload = await isValidAuthRequest(request);
	if (!payload) {
		throw error(HttpCodes.BADREQUEST, {
			code: HttpCodes.BADREQUEST,
			message: 'Invalid signup request'
		});
	}

	return supabase.auth.admin
		.generateLink({
			type: 'signup',
			email: payload.email,
			password: payload.password,
			options: {
				data: { username: payload.username }
			}
		})
		.then(async (res) => {
			if (res.error?.status) {
				throw error(res.error.status || HttpCodes.BADREQUEST, {
					code: res.error.status || HttpCodes.BADREQUEST,
					message: res.error.message
				});
			} else if (res.data?.user) {
				return json(
					{
						username: res.data.user.user_metadata.username,
						created_at: res.data.user.created_at,
						email_confirm: res.data.user.email_confirmed_at != null
					},
					{ status: 201, statusText: 'Account Created' }
				);
			} else {
				throw error(HttpCodes.INTERNALERROR, {
					code: HttpCodes.INTERNALERROR,
					message: 'Error during account creation'
				});
			}
		})
		.catch((err) => {
			console.log(err);

			throw error(HttpCodes.INTERNALERROR, {
				code: HttpCodes.INTERNALERROR,
				message: 'Error during account creation'
			});
		});
}) satisfies RequestHandler;

/**
 * @description Handle supabase user deletion
 */
export const DELETE = (async ({ request, url }) => {
	console.debug('Delete request recieved');

	const id = isValidDeleteRequest(request, url);

	if (!id) {
		throw error(HttpCodes.BADREQUEST, {
			code: HttpCodes.BADREQUEST,
			message: 'Invalid delete request'
		});
	}

	return supabase.auth.admin
		.deleteUser(id)
		.then(async (res) => {
			if (res.error?.status) {
				throw error(res.error.status || HttpCodes.BADREQUEST, {
					code: res.error.status || HttpCodes.BADREQUEST,
					message: res.error.message
				});
			} else if (res.data.user) {
				return json(
					{
						id,
						deleted_at: new Date()
					},
					{ status: 204, statusText: 'Account Deleted' }
				);
			} else {
				throw error(HttpCodes.INTERNALERROR, {
					code: HttpCodes.INTERNALERROR,
					message: 'Error during account deletion, try again later'
				});
			}
		})
		.catch((err) => {
			console.log(err);

			throw error(HttpCodes.INTERNALERROR, {
				code: HttpCodes.INTERNALERROR,
				message: 'Error during account creation, try again later'
			});
		});
}) satisfies RequestHandler;

/**
 * Validates sign up request
 * @param request
 * @returns result of auth validation
 */
const isValidAuthRequest = async (request: Request) => {
	const payload = await request.json();
	if (
		payload.email == null ||
		payload.username == null ||
		payload.password == null ||
		payload.secret !== SECRET ||
		payload.secret == null ||
		request.headers.get('x-trpc-source') !== 'expo-react'
	) {
		return null;
	} else return payload;
};

/**
 * Validates delete request
 * @param request
 * @returns result of auth validation
 */
const isValidDeleteRequest = (request: Request, url: URL) => {
	if (request.headers.get('x-trpc-source') !== 'expo-react' || !url.searchParams.has('id'))
		return undefined;
	return url.searchParams.get('id') as string;
};
