<script lang="ts">
	// The ordering of these imports is critical to your app working properly
	import '@skeletonlabs/skeleton/themes/theme-vintage.css';
	// If you have source.organizeImports set to true in VSCode, then it will auto change this ordering
	import '@skeletonlabs/skeleton/styles/skeleton.css';
	// Most of your app wide CSS should be put in this file
	import { page } from '$app/stores';
	import { AppBar, AppShell } from '@skeletonlabs/skeleton';
	import { QueryClientProvider } from '@tanstack/svelte-query';
	import '../app.postcss';
	import type { LayoutData } from './$types';
	import { goto } from '$app/navigation';

	export let data: LayoutData;

	$: queryClient = data.trpc.queryClient;
	function handleLogout() {
		console.log('Logging out');

		data.supabase.auth.signOut({ scope: 'local' }).finally(() => goto('/'));
	}
</script>

<QueryClientProvider client={queryClient}>
	<!-- App Shell -->
	<AppShell>
		<svelte:fragment slot="header">
			<!-- App Bar -->
			<AppBar>
				<svelte:fragment slot="lead">
					<a class="text-xl uppercase font-bold" href="/" aria-roledescription="Home Link"
						>TwoTone</a
					>
				</svelte:fragment>
				<svelte:fragment slot="trail">
					<a class="btn btn-sm variant-ghost-surface" href="/terms"> Terms n That </a>
					<a class="btn btn-sm variant-ghost-surface" href="/privacy"> Privacy </a>
					<a class="btn btn-sm variant-ghost-surface" href="/support"> Support </a>
					{#if $page.url.pathname.includes('private')}
						<button
							class="btn variant-filled-primary"
							on:click|stopPropagation|once={() => {
								// handleLogout()
								console.debug('doing stuff');
							}}>Logout</button
						>
					{:else}
						<a class="btn variant-filled-primary" href="/admin"> Login </a>
					{/if}
				</svelte:fragment>
			</AppBar>
		</svelte:fragment>
		<!-- Page Route Content -->
		<slot />
	</AppShell>
</QueryClientProvider>
