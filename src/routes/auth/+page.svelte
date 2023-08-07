<script lang="ts">
	import { page } from '$app/stores';
	import Logo from '$lib/logo.png';

	const isValid =
		$page.url.searchParams.has('access_token') &&
		$page.url.searchParams.has('refresh_token') &&
		$page.url.searchParams.has('type');
	// if (isValid) {
	// 	supabase.auth.verifyOtp({
	// 		token_hash: $page.url.searchParams.get('token') || '',
	// 		type: 'email'
	// 	});
	// }
</script>

<svelte:head>
	<title>Join TwoTone</title>
	<meta name="description" content="TwoTone signup" />
</svelte:head>

<div class="container h-full mx-auto flex justify-center items-center">
	<div class="space-y-10 text-center flex flex-col items-center">
		<h2 class="h2">Find music your way</h2>
		<!-- Animated Logo -->
		<figure>
			<section class="img-bg" />
			<img class="h-15 w-15" src={Logo} alt="TwoTone Logo" />
		</figure>
		{#if isValid}
			<h2 class="mx-9">
				Welcome to TwoTone! Thank you for confirming your account. <br /> You can head back to the app
				and sign in.
			</h2>
		{:else}
			<h3 class="mx-9">
				Unauthorized - Either something went wrong on our side (my baaaaaaaaad) or you you're diggin
				around where you shouldn't be.
			</h3>
			<h6>Imma give you the benefit of the doubt though 😶‍🌫️</h6>
			<a href="/"> [ Go Home! ] </a>
		{/if}
	</div>
</div>

<style lang="postcss">
	figure {
		@apply flex relative flex-col;
	}
	figure img,
	.img-bg {
		@apply w-64 h-64 md:w-80 md:h-80;
	}
	.img-bg {
		@apply absolute z-[-1] rounded-full blur-[50px] transition-all;
		animation: pulse 5s cubic-bezier(0, 0, 0, 0.5) infinite, glow 5s linear infinite;
	}
	@keyframes glow {
		0% {
			@apply bg-primary-400/50;
		}
		33% {
			@apply bg-secondary-400/50;
		}
		66% {
			@apply bg-tertiary-400/50;
		}
		100% {
			@apply bg-primary-400/50;
		}
	}
	@keyframes pulse {
		50% {
			transform: scale(1.5);
		}
	}
</style>
