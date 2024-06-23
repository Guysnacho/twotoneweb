<script lang="ts">
	import type { LayoutData } from './$types';
	import { goto } from '$app/navigation';
	import { redirect } from '@sveltejs/kit';

	export let data: LayoutData;
	if (data.user === null) {
		data.supabase.auth.signOut().finally(() => redirect(303, '/admin'));
	}
</script>

<slot />
