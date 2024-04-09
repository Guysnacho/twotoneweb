<script lang="ts">
	import Logo from '$lib/logo.png';
</script>

<svelte:head>
	<title>Goodbye</title>
	<meta name="description" content="Fare thee well" />
</svelte:head>

<div class="h-full mx-auto my-9 w-4/6 flex justify-center items-center">
	<div class="space-y-10 flex flex-col items-center">
		<h2 class="h2 text-center font-semibold">Bidding you adeu</h2>
		<!-- Animated Logo -->
		<figure>
			<section class="img-bg" />
			<img class="h-15 w-15" src={Logo} alt="TwoTone Logo" />
		</figure>

		<p class="text-center">
			Thanks for using the TwoTone, you will be missed. Lil bittersweet moment because...why'd you
			leave amirite? But at the same time, you took the time out to download and use the app for
			however long you did so, thanks 😌
		</p>
		<p class="text-center">
			Let us know what else you use to find music, maybe fill out a support form too just so that
			we've got some notes on things to improve later.
		</p>

		<p class="text-center">In the meantume, peace n love 👋🏾<br />Sam - Tunji Productions</p>

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
