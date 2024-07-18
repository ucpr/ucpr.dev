import type { Component } from "solid-js";

const Header: Component<{
	toHome: () => void;
	toProfile: () => void;
	toArticles: () => void;
	toTags: () => void;
}> = (props) => {
	return (
		<header class="p-4 container mx-auto flex justify-between items-center bg-red-900">
			<a class="text-lg font-bold underline" href="/">
				# ucpr.dev
			</a>
			<nav>
				<ul class="flex space-x-5">
					<li>
						<button type="button" onClick={props.toHome}>
							Home
						</button>
					</li>
					<li>
						<button type="button" onClick={props.toProfile}>
							Profile
						</button>
					</li>
					<li>
						<button type="button" onClick={props.toArticles}>
							Articles
						</button>
					</li>
					<li>
						<button type="button" onClick={props.toTags}>
							Tags
						</button>
					</li>
				</ul>
			</nav>
		</header>
	);
};

export default Header;
