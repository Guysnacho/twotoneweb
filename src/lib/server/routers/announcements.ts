import { TRPCError } from '@trpc/server';
import { Expo, type ExpoPushMessage } from 'expo-server-sdk';

import { EXPO_ACCESS_TOKEN } from '$env/static/private';
import { z } from 'zod';
import { publicProc, router, superSecretProc } from '../trpc/t';

export const announcementsRouter = router({
	get: publicProc.query(async ({ ctx: { supabase } }) => {
		const { data, error } = await supabase.storage
			.from('static')
			.download('notifications/announcements.json');
		if (data) {
			console.debug('Fetched announcements');
			const string = await data.text();
			console.debug(string);
			const parsed = JSON.parse(string);
			console.debug(parsed);
			return parsed;
		}

		if (error) {
			console.debug('Issue while fetching announcements');
			throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message });
		} else {
			console.debug('No announcements');
			throw new TRPCError({ code: 'NOT_FOUND' });
		}
	}),
	announce: superSecretProc
		.input(z.object({ announcements: z.array(z.string()) }))
		.mutation(async ({ input, ctx: { supabase, session } }) => {
			const { data, error } = await supabase
				.from('users')
				.select('id,role')
				.eq('id', session?.user.id)
				.single();
			if (error) {
				throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message });
			} else if (data.role !== 'ADMIN') {
				// email alert
				console.debug('Unauthorized user');
				throw new TRPCError({
					code: 'UNAUTHORIZED',
					message: "Not allooowwwed...so you really shouldn've been able to do that. Noted."
				});
			} else {
				console.debug('Attempting update');
				const { data, error } = await supabase.storage
					.from('static')
					.update(
						'notifications/announcements.json',
						JSON.stringify({ features: input.announcements })
					);
				if (error) {
					throw new TRPCError({
						code: 'INTERNAL_SERVER_ERROR',
						message: error.message
					});
				} else {
					console.debug('Mission accomplished. Announcements updated - ' + data?.path);
					return 'mission accomplished';
				}
			}
		}),
	publishNoti: superSecretProc
		.input(z.object({ title: z.optional(z.string()), body: z.optional(z.string()) }))
		.mutation(async ({ input: { title, body }, ctx: { supabase, session } }) => {
			// Quick auth check
			const { data: userData, error: userError } = await supabase
				.from('users')
				.select('role')
				.eq('id', session?.user.id)
				.single();
			if (userError) {
				throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message });
			} else if (userData.role !== 'ADMIN') {
				// email alert
				console.debug('Unauthorized user');
				throw new TRPCError({
					code: 'UNAUTHORIZED',
					message: "Not allooowwwed...so you really shouldn've been able to do that. Noted."
				});
			}

			// Fetch tokens and chunk messages
			const { data, error } = await supabase.from('noti_token').select('token');
			if (error) {
				throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message });
			}
			console.debug('Publishing noti');
			const validTokens = data.filter((user) => {
				console.debug('Token Pulled - ' + user.token);
				return Expo.isExpoPushToken(user.token);
			});
			const messages: ExpoPushMessage[] = validTokens.map((user) => {
				return { to: user.token, title, body };
			});
			const expo = new Expo({
				accessToken: EXPO_ACCESS_TOKEN
			});

			const chunks = expo.chunkPushNotifications(messages);
			let count = 0;
			for (const chunk of chunks) {
				try {
					await expo.sendPushNotificationsAsync(chunk);
					count++;
				} catch (error) {
					console.error('Error occured - ' + error.message);
				}
			}

			console.debug('Mission accomplished. %d out of %d chunks sent', count, chunks.length);
			return;
		})
});
