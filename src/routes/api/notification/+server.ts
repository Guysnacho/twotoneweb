import { SECRET, EXPO_ACCESS_TOKEN } from '$env/static/private';
import { HttpCodes } from '$lib/constants';
import { Expo } from 'expo-server-sdk';

import { supabase } from '$lib/supabaseClient';
import { error, json, type RequestHandler } from '@sveltejs/kit';

/**
 * Get status of current notifications
 * @returns secret: encoded secret used to confirm requests
 */
export const GET = (() => {
	// Later, after the Expo push notification service has delivered the
	// notifications to Apple or Google (usually quickly, but allow the service
	// up to 30 minutes when under load), a "receipt" for each notification is
	// created. The receipts will be available for at least a day; stale receipts
	// are deleted.
	//
	// The ID of each receipt is sent back in the response "ticket" for each
	// notification. In summary, sending a notification produces a ticket, which
	// contains a receipt ID you later use to get the receipt.
	//
	// The receipts may contain error codes to which you must respond. In
	// particular, Apple or Google may block apps that continue to send
	// notifications to devices that have blocked notifications or have uninstalled
	// your app. Expo does not control this policy and sends back the feedback from
	// Apple and Google so you can handle it appropriately.
	const expo = new Expo({
		accessToken: EXPO_ACCESS_TOKEN,
		useFcmV1: false // this can be set to true in order to use the FCM v1 API
	});

	const receiptIds = [];
	for (const ticket of tickets) {
		// NOTE: Not all tickets have IDs; for example, tickets for notifications
		// that could not be enqueued will have error information and no receipt ID.
		if (ticket.status === 'ok') {
			receiptIds.push(ticket.id);
		}
	}

	const receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);
	(async () => {
		// Like sending notifications, there are different strategies you could use
		// to retrieve batches of receipts from the Expo service.
		for (const chunk of receiptIdChunks) {
			try {
				const receipts = await expo.getPushNotificationReceiptsAsync(chunk);
				console.log(receipts);

				// The receipts specify whether Apple or Google successfully received the
				// notification and information about an error, if one occurred.
				for (const receiptId in receipts) {
					const { status, message, details } = receipts[receiptId];
					if (status === 'ok') {
						continue;
					} else if (status === 'error') {
						console.error(`There was an error sending a notification: ${message}`);
						if (details && details.error) {
							// The error codes are listed in the Expo documentation:
							// https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
							// You must handle the errors appropriately.
							console.error(`The error code is ${details.error}`);
						}
					}
				}
			} catch (error) {
				console.error(error);
			}
		}
	})();
	return json({
		secret: SECRET
	});
}) satisfies RequestHandler;

/**
 * Publish notifications
 * @description Handle supabase user creation
 */
export const POST = (async ({ request }) => {
	const payload = await isValidNotificationReq(request);
	if (!payload) {
		error(HttpCodes.BADREQUEST, {
        			code: HttpCodes.BADREQUEST,
        			message: 'Invalid signup request'
        		});
	}

	// Create a new Expo SDK client
	// optionally providing an access token if you have enabled push security
	const expo = new Expo({
		accessToken: EXPO_ACCESS_TOKEN,
		useFcmV1: false // this can be set to true in order to use the FCM v1 API
	});
	

	// Create the messages that you want to send to clients
	const messages = [];
	for (const pushToken of somePushTokens) {
		// Each push token looks like ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]

		// Check that all your push tokens appear to be valid Expo push tokens
		if (!Expo.isExpoPushToken(pushToken)) {
			console.error(`Push token ${pushToken} is not a valid Expo push token`);
			continue;
		}

		// Construct a message (see https://docs.expo.io/push-notifications/sending-notifications/)
		messages.push({
			to: pushToken,
			sound: 'default',
			body: 'This is a test notification',
			data: { withSome: 'data' }
		});
	}

	// The Expo push notification service accepts batches of notifications so
	// that you don't need to send 1000 requests to send 1000 notifications. We
	// recommend you batch your notifications to reduce the number of requests
	// and to compress them (notifications with similar content will get
	// compressed).
	const chunks = expo.chunkPushNotifications(messages);
	const tickets = [];
	(async () => {
		// Send the chunks to the Expo push notification service. There are
		// different strategies you could use. A simple one is to send one chunk at a
		// time, which nicely spreads the load out over time:
		for (const chunk of chunks) {
			try {
				const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
				console.log(ticketChunk);
				tickets.push(...ticketChunk);
				// NOTE: If a ticket contains an error code in ticket.details.error, you
				// must handle it appropriately. The error codes are listed in the Expo
				// documentation:
				// https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
			} catch (error) {
				console.error(error);
			}
		}
	})();

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
				error(res.error.status || HttpCodes.BADREQUEST, {
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
				error(HttpCodes.INTERNALERROR, {
                					code: HttpCodes.INTERNALERROR,
                					message: 'Error during account creation'
                				});
			}
		})
		.catch((err) => {
			console.log(err);

			error(HttpCodes.INTERNALERROR, {
            				code: HttpCodes.INTERNALERROR,
            				message: 'Error during account creation'
            			});
		});
}) satisfies RequestHandler;

// /**
//  * @deprecated
//  * @description Handle supabase user deletion
//  */
// export const DELETE = (async ({ request, url }) => {
// 	console.log('Delete request recieved');

// 	const id = isValidDeleteRequest(request, url);

// 	if (!id) {
// 		throw error(HttpCodes.BADREQUEST, {
// 			code: HttpCodes.BADREQUEST,
// 			message: 'Invalid delete request'
// 		});
// 	}

// 	return supabase.auth.admin
// 		.deleteUser(id)
// 		.then(async (res) => {
// 			if (res.error?.status) {
// 				throw error(res.error.status || HttpCodes.BADREQUEST, {
// 					code: res.error.status || HttpCodes.BADREQUEST,
// 					message: res.error.message
// 				});
// 			} else if (res.data.user) {
// 				return json(
// 					{
// 						id,
// 						deleted_at: new Date()
// 					},
// 					{ status: 200, statusText: 'Account Deleted' }
// 				);
// 			} else {
// 				throw error(HttpCodes.INTERNALERROR, {
// 					code: HttpCodes.INTERNALERROR,
// 					message: 'Error during account deletion, try again later'
// 				});
// 			}
// 		})
// 		.catch((err) => {
// 			console.log(err);

// 			throw error(HttpCodes.INTERNALERROR, {
// 				code: HttpCodes.INTERNALERROR,
// 				message: 'Error during account deletion, try again later'
// 			});
// 		});
// }) satisfies RequestHandler;

/**
 * Validates notification request
 * @param request
 * @returns result of auth validation
 */
const isValidNotificationReq = async (request: Request) => {
	const payload = await request.json();
	if (
		payload.email == null ||
		payload.username == null ||
		payload.password == null ||
		payload.secret !== SECRET ||
		payload.secret == null ||
		request.headers.get('noti-secret') == null ||
		request.headers.get('noti-secret') !== NOTI_SECRET
	) {
		return null;
	} else return payload;
};

// /**
//  * Validates delete request
//  * @param request
//  * @returns result of auth validation
//  */
// const isValidDeleteRequest = (request: Request, url: URL) => {
// 	if (request.headers.get('x-trpc-source') !== 'expo-react' || !url.searchParams.has('id'))
// 		return undefined;
// 	return url.searchParams.get('id') as string;
// };
