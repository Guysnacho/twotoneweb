import type { Actions } from '@sveltejs/kit';

import { redirect } from '@sveltejs/kit';

export const actions: Actions = {
	default: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		const { error } = await supabase.auth.signInWithPassword({ email, password });
		console.log('Attempted to login');
		if (error) {
			console.error(error);
			return { error: error.message };
		} else {
			console.log('Successful login');
			return redirect(303, '/admin/private/booth');
		}
	}
};
