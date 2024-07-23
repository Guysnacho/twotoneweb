<script lang="ts">
	import Logo from '$lib/logo.png';
	import AppleSVG from '$lib/white-appstore-badge.svg';
</script>

<svelte:head>
	<title>TwoTone</title>
	<meta name="description" content="Home of organic music descovery. TwoTone Music" />
</svelte:head>

<div class="container h-5/6 mx-auto flex justify-center items-center">
	<div class="space-y-10 text-center flex flex-col items-center">
		<h2 class="h2">Find music your way</h2>
		<!-- Animated Logo -->
		<figure>
			<section class="img-bg" />
			<img class="h-15 w-15" src={Logo} alt="TwoTone Logo" />
		</figure>
		<!-- / -->
		<h2 class="h2">TwoTone</h2>
	</div>
</div>
<div class="container mx-auto w-36 items-center">
	<a
		class="flex justify-center"
		href="https://apps.apple.com/us/app/twotone-music/id6479975992?platform=iphone"
		referrerpolicy="origin"
		target="_blank"><img src={AppleSVG} alt="Apple Appstore Badge" /></a
	>
	<p class="text-center">or</p>
	<a href="https://x3yn84lm.forms.app/twotone-application-form" target="_blank" class="text-center"
		><p>[ <span class="underline">Join the Waitlist!</span> ]</p></a
	>
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
