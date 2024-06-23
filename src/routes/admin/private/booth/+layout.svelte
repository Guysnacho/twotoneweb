<script lang="ts">
	import { goto } from '$app/navigation';
	import type { LayoutData } from './$types';

	export let data: LayoutData;
	// if (data.user === null) {
	// 	data.supabase.auth.signOut().finally(() => goto('/admin'));
	// }
</script>

<slot />
