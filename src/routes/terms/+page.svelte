<script lang="ts">
	import Logo from '$lib/logo.png';
</script>

<svelte:head>
	<title>Terms of Service</title>
	<meta name="description" content="TwoTone Terms of Service" />
</svelte:head>

<div class="h-full mx-auto my-9 w-4/6 flex justify-center items-center">
	<div class="space-y-10 flex flex-col items-center">
		<h2 class="h2 text-center font-semibold">Terms of Service</h2>
		<!-- Animated Logo -->
		<figure>
			<section class="img-bg" />
			<img class="h-15 w-15" src={Logo} alt="TwoTone Logo" />
		</figure>

		<p class="text-center">
			Introduction<br />
			Welcome to TwoTone, a social music sharing app created and operated by Tunji Productions ("TwoTone,"
			"we," "us," or "our"). By accessing or using our app, you agree to abide by these terms of service.
			Please read them carefully.
		</p>
		<ol class="space-y-4">
			<div>
				<span
					><dt class="text-lg text-tertiary-400 font-semibold">App Description</dt>
					<dd>
						TwoTone is designed to help users share their favorite songs and bring artists,
						performers, venues, and fans closer together.
					</dd></span
				>
			</div>
			<div>
				<span
					><dt class="text-lg text-tertiary-400 font-semibold">User Accounts</dt>
					<dd>Users can sign up with their email to create an account.</dd>
					<dd>Users are responsible for maintaining the security of their account credentials.</dd>
					<dd>
						Users can delete their account at any time, and their data will be deleted accordingly.
					</dd>
				</span>
			</div>
			<div>
				<span
					><dt class="text-lg text-tertiary-400 font-semibold">Song of the Day</dt>
					<dd>
						Users can save their favorite songs as a 'Song of the Day' to share with others.
					</dd></span
				>
			</div>
			<div>
				<span
					><dt class="text-lg text-tertiary-400 font-semibold">Use of Deezer</dt>
					<dd>
						TwoTone utilizes Deezer for song results, with proper attribution given to the
						respective songs.
					</dd></span
				>
			</div>
			<div>
				<span
					><dt class="text-lg text-tertiary-400 font-semibold">Ownership of Content</dt>
					<dd>Tunji Productions owns the app TwoTone and the content hosted on the app.</dd>
					<dd>However, user-created content can be attributed to individual posters.</dd>
				</span>
			</div>
			<div>
				<span
					><dt class="text-lg text-tertiary-400 font-semibold">Privacy Policy</dt>
					<dd>
						Data recording and privacy guidelines are outlined in detail within our comprehensive
						privacy policy, accessible on the privacy policy page of our app or website.
					</dd></span
				>
			</div>
			<div>
				<span
					><dt class="text-lg text-tertiary-400 font-semibold">Changes to Terms of Service</dt>
					<dd>
						Any modifications or updates, although infrequent, to these terms of service will be
						communicated to the TwoTone community.
					</dd></span
				>
			</div>
			<div>
				<span
					><dt class="text-lg text-tertiary-400 font-semibold">Indemnification</dt>
					<dd>
						Users agree to indemnify and hold Tunji Productions harmless from any claims, damages,
						or liabilities arising from their use of the TwoTone app.
					</dd></span
				>
			</div>
			<div>
				<span
					><dt class="text-lg text-tertiary-400 font-semibold">Governing Law</dt>
					<dd>
						These terms of service are governed by the laws of the United States, with the state of
						Texas serving as the exclusive jurisdiction for any disputes arising hereunder.
					</dd></span
				>
			</div>
			<div>
				<span
					><dt class="text-lg text-tertiary-400 font-semibold">Contact Us</dt>
					<dd>
						Should you have any questions or concerns regarding these terms of service, please do
						not hesitate to reach out to us at our support page: TwoTone Support.
					</dd></span
				>
			</div>
			<div>
				<span
					><dt class="text-lg text-tertiary-400 font-semibold">Agreement</dt>
					<dd>
						By utilizing the TwoTone app, you acknowledge and agree to adhere to these terms of
						service.
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
