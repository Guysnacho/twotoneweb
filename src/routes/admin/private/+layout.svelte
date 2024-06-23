<script>
	import { goto, invalidate, beforeNavigate } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	export let data;
	$: ({ supabase, session, user } = data);

	beforeNavigate((nav) => {
		if (nav.type === 'goto' && !user) {
			goto('/admin');
		}
	});

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
			if (!newSession) {
				/**
				 * Queue this as a task so the navigation won't prevent the
				 * triggering function from completing
				 */
				setTimeout(() => {
					if ($page.url.pathname.includes('admin/private/booth')) {
						goto('/admin', { invalidateAll: true });
					}
				});
			}
			if (newSession?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => data.subscription.unsubscribe();
	});

	const logout = () => {
		console.log('Clicked logout');
		supabase.auth
			.signOut()
			.catch((err) => {
				console.error(err);
			})
			.finally(() => {
				console.log('Finished logging out');
				goto('/admin');
			});
	};
</script>

<header>
	<nav class="flex justify-end">
		<a href="/"
			><button type="button" class="btn variant-filled">
				<span>Home</span>
			</button></a
		>

		<button type="button" class="btn variant-filled" on:click={logout}>
			<span>Logout</span>
		</button>
	</nav>
</header>

<slot />
