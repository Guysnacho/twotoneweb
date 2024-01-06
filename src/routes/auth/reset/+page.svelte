<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import Logo from '$lib/logo.png';

	let newPassword = '';
	const isValid =
		$page.url.searchParams.has('token') &&
		$page.url.searchParams.has('email') &&
		$page.url.searchParams.has('tokenHash');
	const handleSubmit = () => {
		console.debug($page.url.searchParams.toString());
		if (newPassword.length < 6) {
			alert('Password must be at least 6 characters long');
		} else {
			fetch('/auth/reset', {
				method: 'post',
				body: JSON.stringify({
					token: $page.url.searchParams.get('token'),
					email: $page.url.searchParams.get('email'),
					tokenHash: $page.url.searchParams.get('tokenHash'),
					password: newPassword
				})
			})
				.then((res) => {
					if (res.ok) {
						newPassword = '';
						alert(
							'Your password was successfully reset, confirm your email and try logging in again'
						);
						// goto('/');
					} else {
						alert('Ooof, looks like something went wrong. Try again another time okay?');
					}
				})
				.catch((err) => {
					alert('Ooof, looks like something went wrong.');
					console.debug(err);
				});
		}
	};
</script>

<svelte:head>
	<title>TwoTone Password Reset</title>
	<meta name="description" content="TwoTone password reset" />
</svelte:head>

<div class="container h-full mx-auto flex justify-center items-center">
	<div class="space-y-10 text-center flex flex-col items-center">
		<h2 class="h2">Reset Password</h2>
		<!-- Animated Logo -->
		<figure>
			<section class="img-bg" />
			<img class="h-15 w-15" src={Logo} alt="TwoTone Logo" />
		</figure>
		{#if isValid}
			<h2 class="mx-9">Welcome back! Lets reset that password.</h2>
			<div class="container">
				<form>
					<input
						class="input pl-5"
						title="New Password"
						type="password"
						placeholder="input text"
						bind:value={newPassword}
					/>
					<button class="btn variant-filled-primary my-10" type="button" on:click={handleSubmit}
						>Submit</button
					>
				</form>
			</div>
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
