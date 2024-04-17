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
					><dt class="text-lg text-tertiary-400 font-semibold">Use of Spotify</dt>
					<dd>
						TwoTone utilizes Spotify for song results, with proper attribution given to the
						respective songs. By using the Spotify Platform we also comply with the full developer
						terms of service and the licencing associated with it.
					</dd></span
				>
			</div>
			<div>
				<span
					><dt class="text-lg text-tertiary-400 font-semibold">
						DMCA | Claims of Copyright Infringement
					</dt>
					<dd>
						Tunji Productions respects the intellectual property rights of others, and requires its
						users to do the same. If you believe that your copyrighted work has been reproduced in a
						manner which constitutes copyright infringement, you may notify Tunji Production's
						copyright agent in accordance with Title 17, United States Code, Section 512(c)(2), by
						providing the following:
						<ul class="space-y-4 list-disc list-inside my-5">
							<li class="list-item">
								Identification of the copyrighted work that you claim has been infringed;
							</li>
							<li class="list-item">
								Identification of the material that you claim is infringing and needs to be removed,
								including a description of where it is located on the Services so that the copyright
								agent can locate it;
							</li>
							<li class="list-item">
								Your address, telephone number, and, if available, e-mail address, so that the
								copyright agent may contact you about your complaint; and
							</li>
							<li class="list-item">
								A signed statement that the above information is accurate; that you have a good
								faith belief that the identified use of the material is not authorized by the
								copyright owner, its agent, or the law; and, under penalty of perjury, that you are
								the copyright owner or are authorized to act on the copyright owner’s behalf in this
								situation.
							</li>
						</ul>
						<p>Notices of copyright infringement claims should be sent as follows:</p>
						<p>
							by email: <a href="mailto:team@twotone.app" class="underline">team@twotone.app</a>
						</p>
					</dd></span
				>
			</div>
			<div>
				<span
					><dt class="text-lg text-tertiary-400 font-semibold">Ownership of Content</dt>
					<dd>Tunji Productions owns the app TwoTone.</dd>
					<dd>
						TwoTone (and Tunji Productions by extension) does not attempt to claim copyright or
						ownership of material that you submit, however, TwoTone claims a non-exclusive
						worldwide, royalty free, perpetual, non-revocable license to reproduce your material
						(Otherwise, we would not be able to display it to other users). In addition, you agree
						to give other users the same license to reprint or save your material for their personal
						use.
					</dd>
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
