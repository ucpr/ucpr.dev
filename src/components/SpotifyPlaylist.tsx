import type { Component } from "solid-js";

const SpotifyPlaylist: Component<{
  playlistId: string;
}> = (props) => {
  return (
    <div class="max-w-4xl mx-auto p-4">
      <iframe
        title="spotify playlist"
        style="border-radius:12px"
        src={`https://open.spotify.com/embed/playlist/${props.playlistId}?utm_source=generator`}
        width="100%"
        height="152"
        allowfullscreen={false}
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      />
    </div>
  );
};

export default SpotifyPlaylist;
