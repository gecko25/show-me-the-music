import type { NextPage } from "next";
import { useEffect, useState } from "react";
import Script from "next/script";

declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: any;
    Spotify: any;
  }
}

const play = ({
  spotify_uris,
  playerInstance: {
    _options: { getOAuthToken },
  },
  device_id,
}) => {
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
  const [nextTrack, setNextTrack] = useState({});
  const [currentTrack, setCurrentTrack] = useState({});

  if (typeof window !== "undefined") {
    window.onSpotifyWebPlaybackSDKReady = () => {
      const token =
        "BQDS1eHTu1xD37ZFHEH6CqI_mwrXY0VEaX0QENZxf4HDzGuihuQp1D1j6cLQ_u94wLYexVAIaelXIHgkVtBxBslXhrBzwc92j5xzZQz5vQnYWFVpMKE-6NZbbkQ9CFSHaFgHwKW6_Sd_wtVQExd0us4_6Pig3QsUjg";
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

        //open.spotify.com/track/?si=cf490f023edb49c5
        https: play({
          playerInstance: player,
          spotify_uris: [
            "spotify:track:5gPceIvoofOgu4s6FdsQc0",
            "spotify:track:0gplL1WMoJ6iYaPgMCL0gX",
            "spotify:track:1WvrDdouh6C51In1SdATbq",
          ],
          device_id,
        });

        document.getElementById("togglePlay").onclick = function () {
          console.log("playing!");
          player.togglePlay();
        };

        document.getElementById("nextTrack").onclick = function () {
          console.log("go to next track..");
          player.nextTrack();
        };

        document.getElementById("pause").onclick = function () {
          player.pause();
        };

        document.getElementById("resume").onclick = function () {
          player.pause();
        };

        document.getElementById("previousTrack").onclick = function () {
          player.previousTrack();
        };
      });

      player.addListener(
        "player_state_changed",
        ({
          position,
          duration,
          track_window: { current_track, next_tracks, prev_tracks },
        }) => {
          console.log("Currently Playing", current_track.name);
          setCurrentTrack(current_track);
        }
      );

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
