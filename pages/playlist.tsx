import type { NextPage } from "next";
import { useEffect, useState } from "react";
import Script from "next/script";
import SpotifyWebPlayer from "types/spotify-web-player";

/* Types */
declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady(): void;
    Spotify: typeof SpotifyWebPlayer;
  }
}

const play = ({
  spotify_uris,
  playerInstance,
  device_id,
}: {
  spotify_uris: string[]; //
  playerInstance: SpotifyWebPlayer.Player;
  device_id: string;
}) => {
  const { getOAuthToken } = playerInstance._options;
  getOAuthToken((access_token) => {
    fetch(`https://api.spotify.com/v1/me/player/play?device_id=${device_id}`, {
      method: "PUT",
      body: JSON.stringify({ uris: [...spotify_uris] }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    });
  });
};

// https://developer.spotify.com/documentation/web-playback-sdk/quick-start/
const Playlist: NextPage = () => {
  const [currentTrack, setCurrentTrack] = useState<
    SpotifyWebPlayer.Track | undefined
  >();

  if (typeof window !== "undefined") {
    window.onSpotifyWebPlaybackSDKReady = () => {
      const token =
        "BQA2teX4XLCgyP56-IxFBLyH61CQlhGWSn7eLSX2ovcIdnTUtVuyl7NlK6oDrImz_L7p894fKqnF2YnqJV-qnuHiIIhMJoc7w-NsNzE02YaB6Yo5HxQkptTJ-JQqfhnfoom387236082Pt16VlwAT0bdAPMSnClqsQ";

      // Authenticate the player
      const player = new window.Spotify.Player({
        name: "showmethemusic.co",
        getOAuthToken: (cb) => {
          cb(token);
        },
        volume: 0.5,
      });

      // Initialize the player with track ids
      player.addListener("ready", ({ device_id }) => {
        play({
          playerInstance: player,
          spotify_uris: [
            "spotify:track:5gPceIvoofOgu4s6FdsQc0",
            "spotify:track:0gplL1WMoJ6iYaPgMCL0gX",
            "spotify:track:1WvrDdouh6C51In1SdATbq",
          ],
          device_id,
        });
      });

      // Add other event listeners
      player.addListener("player_state_changed", (playerState) => {
        setCurrentTrack(playerState.track_window.current_track);
      });

      player.addListener("not_ready", ({ device_id }) => {
        console.log("Device ID has gone offline", device_id);
      });

      player.addListener("initialization_error", (message) => {
        console.error(message);
      });

      player.addListener("authentication_error", (message) => {
        console.error("authentication_error:", message);
      });

      player.addListener("account_error", (message) => {
        console.error(message);
      });

      player.connect();

      // Add callbacks to event buttons
      // @ts-ignore: Object is possibly 'null'.
      document.getElementById("togglePlay").onclick = function () {
        player.togglePlay();
      };

      // @ts-ignore: Object is possibly 'null'.
      document.getElementById("nextTrack").onclick = function () {
        player.nextTrack();
      };

      // @ts-ignore: Object is possibly 'null'.
      document.getElementById("pause").onclick = function () {
        player.pause();
      };

      // @ts-ignore: Object is possibly 'null'.
      document.getElementById("resume").onclick = function () {
        player.resume();
      };

      // @ts-ignore: Object is possibly 'null'.
      document.getElementById("previousTrack").onclick = function () {
        player.previousTrack();
      };
    };
  }

  return (
    <>
      <Script
        src="https://sdk.scdn.co/spotify-player.js"
        strategy="beforeInteractive"
      />
      <button id="togglePlay">Play</button>
      <button id="nextTrack">Next Track</button>
      <button id="pause">Pause</button>
      <button id="resume">Resume</button>
      <button id="previousTrack">Previous</button>

      {currentTrack?.name && (
        <div style={{ display: "flex", alignItems: "center" }}>
          <img src={currentTrack.album.images[2].url} height={64} width={64} />
          <span>{currentTrack.name}</span>
          <span>&nbsp;by&nbsp;</span>
          <span>{currentTrack.artists[0].name}</span>
        </div>
      )}
    </>
  );
};

export default Playlist;
