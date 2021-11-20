import { setHttpAgentOptions } from "next/dist/server/config";
import React, { useEffect, useCallback } from "react";
import SpotifyWebPlayer from "types/spotify-web-player";

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
export const useSpotifyWebPlayer = (accessToken: string) => {
  const [player, setPlayer] = React.useState<
    SpotifyWebPlayer.Player | undefined
  >();
  const [currentTrack, setCurrentTrack] = React.useState<
    SpotifyWebPlayer.Track | undefined
  >();
  const [error, setError] = React.useState("");

  const initializeWebPlayer = useCallback(
    (token: string) => {
      if (typeof window !== "undefined") {
        window.onSpotifyWebPlaybackSDKReady = () => {
          console.log(
            "Got access tokens, going to initialize the web player..."
          );

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
            console.log("player is ready..");
            play({
              playerInstance: player as SpotifyWebPlayer.Player,
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
            setCurrentTrack(playerState?.track_window?.current_track);
          });

          player.addListener("not_ready", ({ device_id }) => {
            console.log("Device ID has gone offline", device_id);
          });

          player.addListener("initialization_error", (message) => {
            console.error("initialization_error", message);
          });

          player.addListener("authentication_error", (message) => {
            console.error("authentication_error:", message);
          });

          player.addListener("account_error", (message) => {
            console.error("account_error", message);
          });

          player.connect();

          setPlayer(player as SpotifyWebPlayer.Player);
        };
      }
    },
    [setCurrentTrack, setError]
  );

  useEffect(() => {
    if (accessToken) {
      console.log("Access token updated, going to initialize web player");
      initializeWebPlayer(accessToken);
    }
  }, [accessToken, initializeWebPlayer]);

  return {
    player,
    currentTrack,
    error,
  };
};

export default useSpotifyWebPlayer;
