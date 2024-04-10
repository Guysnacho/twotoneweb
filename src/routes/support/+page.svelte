<script lang="ts">
	import Logo from '$lib/logo.png';
	import type { ActionData } from './$types';
	export let form: ActionData;
</script>

<svelte:head>
	<title>Support</title>
	<meta name="description" content="TwoTone Support Form" />
</svelte:head>

<div class="h-full mx-auto my-9 w-4/6 flex justify-center items-center">
	<div class="space-y-10 flex flex-col items-center">
		<h2 class="h2 text-center font-semibold">Support</h2>
		<!-- Animated Logo -->
		<figure>
			<section class="img-bg" />
			<img class="h-15 w-15" src={Logo} alt="TwoTone Logo" />
		</figure>

		{#if form == undefined}
			<p class="text-center">
				Mkay so if you're here, its probably because something went wrong in the app. Which is good
				and bad news.
				<br /> Good news because I've got something to fix, bad news because something was broken to
				begin with. So lets get into this.
			</p>
		{/if}
		<div class="space-y-4">
			{#if form?.success}
				<h4 class="h4 text-center font-semibold">Gotcha, we'll get back to you asap!</h4>
			{:else if form?.error}
				<h4 class="h4 text-center font-semibold">
					Something went wrong, try again later or email us directly. We'll get this sorted one way
					or another.
				</h4>
			{:else}
				<form method="POST">
					<label class="label">
						<span>Email</span>
						<input
							class="input p-3"
							name="email"
							type="email"
							placeholder="definitely_not_pharell@gmail.com"
							required
						/>
					</label>
					<label class="label">
						<span>Username</span>
						<input class="input p-3" name="username" type="text" />
					</label>
					<label class="label mt-3">Type of Problem</label>
					<select class="select my-4" name="type" required>
						<option value="Login">Login</option>
						<option value="Sign Up">Sign Up</option>
						<option value="Account Delete">Account Delete</option>
						<option value="Song Search">Song Search</option>
						<option value="Profile Search">Profile Search</option>
						<option value="Its UGLY">Its UGLY</option>
						<option value="Other">Other</option>
					</select>
					<div class="space-y-2">
						<label class="label mt-3">Platform</label>
						<label class="flex items-center space-x-2">
							<input class="radio" type="radio" checked name="platform" value="iOS" />
							<p>iOS</p>
						</label>
						<label class="flex items-center space-x-2">
							<input class="radio" type="radio" name="platform" value="Android" />
							<p>Android</p>
						</label>
					</div>
					<label class="label">
						<span>Okay so what happened?</span>
						<textarea
							class="textarea p-3 line"
							name="description"
							placeholder="Song of the day preview isn't showing up. I'm very sad about this."
							required
						/>
					</label>
					<div class="flex justify-center mt-4">
						<button class="btn variant-filled-primary" type="submit">Submit</button>
					</div>
				</form>
			{/if}
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
