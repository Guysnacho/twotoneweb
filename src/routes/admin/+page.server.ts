import { Actions } from '@sveltejs/kit';

import { redirect } from '@sveltejs/kit';

export const actions: Actions = {
	default: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		const { error } = await supabase.auth.signInWithPassword({ email, password });
		if (error) {
			console.error(error);
			alert('Ran into an issue during login - ' + error.message);
			return redirect(303, '/admin');
		} else {
			return redirect(303, '/admin/private/booth');
		}
	}
};
