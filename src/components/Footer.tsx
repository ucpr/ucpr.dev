function Footer() {
	return (
		<footer class="p-4 text-center">
			<div class="text-sm flex justify-center items-center space-x-2 pb-1">
				<a
					href="https://github.com/ucpr"
					target="_blank"
					rel="noopener"
					class="text-blue-500 hover:text-blue-600"
				>
					GitHub
				</a>
				<span>|</span>
				<a
					href="https://twitter.com/u_chi_ha_ra_"
					target="_blank"
					rel="noopener"
					class="text-blue-500 hover:text-blue-600"
				>
					X
				</a>
				<span>|</span>
				<a
					href="https://bsky.app/profile/ucpr.dev"
					target="_blank"
					rel="noopener"
					class="text-blue-500 hover:text-blue-600"
				>
					Bluesky
				</a>
				<span>|</span>
				<a href="/rss.xml" class="text-blue-500 hover:text-blue-600">
					RSS
				</a>
			</div>

			<p class="text-sm text-gray-600">
				&copy; 2024 @ucpr. All rights reserved.
			</p>
			<p class="text-sm text-gray-600">
				このサイトでは Google Analytics を使用しています。
			</p>
		</footer>
	);
}

export default Footer;
