<script lang="ts">
	import type { LayoutData } from './$types';
	import { goto } from '$app/navigation';

	export let data: LayoutData;
	if (data.session === null) {
		data.supabase.auth.signOut().finally(() => goto('/admin'));
	}
</script>

<slot />
