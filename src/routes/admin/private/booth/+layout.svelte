<script lang="ts">
	import { goto } from '$app/navigation';
	import type { LayoutData } from './$types';

	export let data: LayoutData;
	if (data.user === null) {
		console.debug('User not authed');

		data.supabase.auth.signOut().finally(() => console.debug("You've been logged out bestie"));
	} else {
		console.debug('User authed');
		console.debug('Welcome %s', data.user.user_metadata.username);
	}
</script>

<slot />
