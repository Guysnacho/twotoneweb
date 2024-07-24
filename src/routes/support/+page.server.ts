import { MY_EMAIL, RESEND_API_KEY } from '$env/static/private';
import { supabase } from '$lib/supabaseClient';
import type { Actions } from '@sveltejs/kit';
import { Resend } from 'resend';

const resend = new Resend(RESEND_API_KEY);

export const actions = {
	default: async ({ request }) => {
		const input = await request.formData();
		const attachmentData = input.get('attachments');
		const attachments = [];
		if (attachmentData) {
			// @ts-expect-error upset about attachementData casting, just testing
			for (let idx = 0; idx < (attachmentData as FileList).length; idx++) {
				// @ts-expect-error upset about attachementData casting, just testing
				const item = (attachmentData as FileList).item(idx);
				attachments.push({
					filename: item?.name,
					content: Buffer.from((await item?.arrayBuffer())!)
				});
			}
		}

		const { error } = await resend.emails.send({
			from: 'TwoTone <team@messages.twotone.app>',
			to: MY_EMAIL,
			subject: 'TwoTone Support',
			attachments,
			html: `<div>
			<img
			  src="https://twotone.app/_app/immutable/assets/logo.d02cbc58.png"
			  alt="TwoTone Logo"
			  style="margin-inline: auto"
			  height="320px"
			  width="320px"
			/>
			<h3 style="text-align: center">TwoTone Support</h3>
			<br />
			<div>
			  <p>
				You've recieved a new support ticket, go help ${input.get('username')}
				out.
			  </p>
			  <ul>
				<li>Email - ${input.get('email')}</li>
				<li>Username - ${input.get('username')}</li>
				<li>Type - ${input.get('type')}</li>
				<li>Platform - ${input.get('platform')}</li>
				<br />
				<li>Description - ${input.get('description')}</li>
			  </ul>
			</div>
		  </div>
		  `
		});

		return await supabase
			.from('support_tickets')
			.insert({
				email: input.get('email') as string,
				username: input.get('username') as string,
				type: (input.get('type') as string) || 'TBD',
				description: input.get('description') as string,
				platform: input.get('platform') as string,
				email_error: error?.message
			})
			.then(({ status, statusText, error }) => {
				if (error) {
					return { error: error, status, statusText };
				} else {
					return { success: status, status, statusText };
				}
			});
	}
} satisfies Actions;
