import Profile from "../../components/Profile";
import SpotifyPlaylist from "../../components/SpotifyPlaylist";

function Home() {
	return (
		<div>
			<Profile
				iconUrl="https://avatars.githubusercontent.com/u/17886370"
				profileText="Hello World"
			/>
			<SpotifyPlaylist playlistId="3RktWZ6EsWwBXIgnJOm9EM" />
		</div>
	);
}

export default Home;
