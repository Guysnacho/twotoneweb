import { supabase } from '$lib/supabaseClient';
import { Actions } from '@sveltejs/kit';

export const actions = {
	default: async ({ request }) => {
		const input = await request.formData();

		return await supabase
			.from('support_tickets')
			.insert({
				email: input.get('email') as string,
				username: input.get('username') as string,
				type: (input.get('type') as string) || 'TBD',
				description: input.get('description') as string,
				platform: input.get('platform') as string
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
