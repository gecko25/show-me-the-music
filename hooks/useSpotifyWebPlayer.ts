import { setHttpAgentOptions } from "next/dist/server/config";
import React, { useEffect, useCallback } from "react";
import SpotifyWebPlayer from "types/spotify-web-player";
import SpotifyApiTypes from "types/spotify";

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

const addItemToQueue = ({
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
    fetch(`https://api.spotify.com/v1/me/player/queue?device_id=${device_id}`, {
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
export const useSpotifyWebPlayer = (
  accessToken: string,
  tracks: SpotifyApiTypes.TrackObjectFull[]
) => {
  const [player, setPlayer] = React.useState<
    SpotifyWebPlayer.Player | undefined
  >();
  const [currentTrack, setCurrentTrack] = React.useState<
    SpotifyWebPlayer.Track | undefined
  >();
  const [deviceId, setDeviceId] = React.useState<string | null>(null);
  const [error, setError] = React.useState("");

  if (typeof window !== "undefined") {
    window.onSpotifyWebPlaybackSDKReady = () => {
      console.log("Change detected, going to initialize the web player...");

      // Authenticate the player
      const player = new window.Spotify.Player({
        name: "showmethemusic.co",
        getOAuthToken: (cb) => {
          cb(accessToken);
        },
        volume: 0.5,
      });

      // Initialize the player with track ids
      player.addListener("ready", ({ device_id }) => {
        console.log("player is ready..");
        setDeviceId(device_id as string);
      });

      // Add other event listeners
      player.addListener("player_state_changed", (playerState) => {
        setCurrentTrack(playerState?.track_window?.current_track);
        console.log(
          "State change TODO: remove track from queue if it was played"
        );
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

  useEffect(() => {
    if (accessToken && deviceId && player) {
      play({
        playerInstance: player as SpotifyWebPlayer.Player,
        spotify_uris: tracks.map((t) => t.uri),
        device_id: deviceId,
      });
    }
  }, [accessToken, deviceId, player, play]);

  useEffect(() => {
    if (tracks && deviceId && player) {
      play({
        playerInstance: player as SpotifyWebPlayer.Player,
        spotify_uris: tracks.map((t) => t.uri),
        device_id: deviceId,
      });
    }
  }, [tracks, deviceId, player, play]);

  return {
    player,
    currentTrack,
    error,
  };
};

export default useSpotifyWebPlayer;
