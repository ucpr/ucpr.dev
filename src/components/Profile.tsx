import type { Component } from "solid-js";

const Profile: Component<{
	iconUrl: string;
	profileText: string;
}> = (props) => {
	return (
		<div class="overflow-hidden flex md:flex-row flex-col max-w-4xl mx-auto">
			<div class="md:w-1-2 flex justify-center items-center p-4 bg-red-100">
				<img
					src={props.iconUrl}
					alt="icon"
					loading="lazy"
					class="rounded-full h-auto sm:w-2/4 md:h-auto w-48"
				/>
			</div>

			<div class="md:w-1/2 p-8 flex justify-center items-center bg-red-200">
				<p class="text-gray-600 text-sm">{props.profileText}</p>
			</div>
		</div>
	);
};

export default Profile;
