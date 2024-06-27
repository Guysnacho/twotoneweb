<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import Logo from '$lib/logo.png';
	import { ConicGradient, type ConicStop } from '@skeletonlabs/skeleton';
	import type { ActionData, PageData } from './$types';
	export let form: ActionData;
	export let pageData: PageData;

	const conicStops: ConicStop[] = [
		{ color: 'transparent', start: 0, end: 25 },
		{ color: 'rgb(var(--color-secondary-500))', start: 75, end: 100 }
	];

	$: loading = false;

	const handleLogin = async (email: string, password: string) => {
		loading = true;
		const { data, error } = await pageData.supabase.auth.signInWithPassword({ email, password });
		if (error) {
			alert(`Ran into an issue during login. ${error.message} ${error.cause}`);
			loading = false;
		} else {
			loading = false;
			goto('/admin/private/booth');
		}
	};
</script>

<svelte:head>
	<title>Admin</title>
	<meta name="Empty Login, nooothing to see here" content="TwoTone Login" />
</svelte:head>

<div class="h-full mx-auto my-9 w-4/6 flex justify-center items-center">
	<div class="space-y-10 flex flex-col items-center">
		<h2 class="h2 text-center font-semibold">Login</h2>
		<!-- Animated Logo -->
		<figure>
			<section class="img-bg" />
			<img class="h-15 w-15" src={Logo} alt="TwoTone Logo" />
		</figure>

		{#if form == undefined}
			<p class="text-center">Nothing to see heeeere. You can still login though :)</p>
		{/if}
		<div class="space-y-4">
			{#if form?.error}
				<h4 class="h4 text-center font-semibold">
					Something went wrong - {form.error}
				</h4>
			{:else if loading}
				<ConicGradient stops={conicStops} spin>Launching carrier pigeon</ConicGradient>
			{/if}
			<form
				method="POST"
				use:enhance={() => {
					loading = true;
					return ({ update }) => {
						// Set invalidateAll to false if you don't want to reload page data when submitting
						update({ invalidateAll: false }).finally(async () => {
							loading = false;
						});
					};
				}}
			>
				<label class="label" aria-required>
					<span>Email</span>
					<input
						class="input p-3"
						name="email"
						type="email"
						placeholder="definitely_not_pharell@gmail.com"
						autocomplete="email"
						required
					/>
				</label>
				<label class="label" aria-required>
					<span>Password</span>
					<input
						class="input p-3"
						name="password"
						type="password"
						placeholder="super_sECure_passWord"
						autocomplete="current-password"
						required
					/>
				</label>

				<div class="flex justify-center mt-4">
					<button class="btn variant-filled-primary" type="submit">Submit</button>
				</div>
			</form>
		</div>
		<a href="/"> [ Go Home! ] </a>
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
