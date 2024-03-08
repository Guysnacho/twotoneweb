<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import Logo from '$lib/logo.png';
</script>

<svelte:head>
	<title>Privacy Policy</title>
	<meta name="description" content="TwoTone password reset" />
</svelte:head>

<div class="h-full mx-auto my-9 w-4/6 flex justify-center items-center">
	<div class="space-y-10 flex flex-col items-center">
		<h2 class="h2 text-center font-semibold">Privacy Policy</h2>
		<!-- Animated Logo -->
		<figure>
			<section class="img-bg" />
			<img class="h-15 w-15" src={Logo} alt="TwoTone Logo" />
		</figure>

		<p class="text-center">
			Okay so boom, I'm not stealing anything and I don't plan on it, ever. Thank you for your time
			😌
			<br /> I'll Also find a way to add a changelog to this page so you can see iterations.
		</p>
		<p>
			Quick breakdown while I'm building stuff goes like this. I and Tunji Productions won't EVER
			take information or data <span class="italic">unless</span> its explicitly consented for. If a
			feature is cool but needs access to a pic or a song or sumn, we'll let you know, each time. I
			don't think you should have to second guess if we're listening in.
			<br />
			<strong>Now. What you can expect,</strong>
		</p>
		<ol class="space-y-4">
			<div>
				<span
					><dt class="text-lg text-tertiary-400 font-semibold">Camera/Photo/Media Access</dt>
					<dd>
						Uploading a profile pic, optional and we'll only save the latest. That's about it,
						nothing else we need from your phone, I pinky promise.
					</dd></span
				>
			</div>
			<div>
				<span
					><dt class="text-lg text-tertiary-400 font-semibold">Speaker Access</dt>
					<dd>To play music. From your speakers. A shocker, I'm aware.</dd></span
				>
			</div>
			<div>
				<span
					><dt class="text-lg text-tertiary-400 font-semibold">Internet access</dt>
					<dd>Gotta sign up and see stuff somehow. :)</dd></span
				>
			</div>
			<div>
				<span
					><dt class="text-lg text-tertiary-400 font-semibold">Etc.</dt>
					<dd>
						That's honestly all we need, if there are more permissions then I'll trim em down when I
						can. Pinky promise #2
					</dd></span
				>
			</div>
		</ol>
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
