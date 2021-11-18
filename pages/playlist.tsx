import type { NextPage } from "next";
import { useEffect } from "react";
import Script from "next/script";

declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: any;
    Spotify: any;
  }
}

const play = ({
  spotify_uri,
  playerInstance: {
    _options: { getOAuthToken },
  },
  device_id,
}) => {
  getOAuthToken((access_token) => {
    fetch(`https://api.spotify.com/v1/me/player/play?device_id=${device_id}`, {
      method: "PUT",
      body: JSON.stringify({ uris: [spotify_uri] }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    });
  });
};

// https://developer.spotify.com/documentation/web-playback-sdk/quick-start/
const Playlist: NextPage = () => {
  if (typeof window !== "undefined") {
    window.onSpotifyWebPlaybackSDKReady = () => {
      const token =
        "BQCqfGu9l6yzF-N-Z5UVn1402zJI8FhCOK0yC0T-m1fNuiCxu_lVZHFnT7hzxMU93Lwk5jyByfSQhILSEMFaLRovsBzWYJixuFl1SVZKniZIATMrXoWaNm_h7KtzqV_NhNXkBgGLIGZ9oZOOXwE4YZI2KpXTjcH-Dg";
      const player = new window.Spotify.Player({
        name: "showmethemusic.co",
        getOAuthToken: (cb) => {
          cb(token);
        },
        volume: 0.5,
      });

      // Ready
      player.addListener("ready", ({ device_id }) => {
        console.log("Ready with Device ID", device_id);

        play({
          playerInstance: player,
          spotify_uri: "spotify:track:7xGfFoTpQ2E7fRF5lN10tr",
          device_id,
        });

        document.getElementById("togglePlay").onclick = function () {
          console.log("playing!");
          player.togglePlay();
        };
      });

      // Not Ready
      player.addListener("not_ready", ({ device_id }) => {
        console.log("Device ID has gone offline", device_id);
      });

      player.addListener("initialization_error", ({ message }) => {
        console.error(message);
      });

      player.addListener("authentication_error", ({ message }) => {
        console.error("authentication_error:", message);
      });

      player.addListener("account_error", ({ message }) => {
        console.error(message);
      });

      player.connect();
    };
  }

  return (
    <>
      <Script
        src="https://sdk.scdn.co/spotify-player.js"
        strategy="beforeInteractive"
      />
      <button id="togglePlay">Toggle Play</button>
    </>
  );
};

export default Playlist;
