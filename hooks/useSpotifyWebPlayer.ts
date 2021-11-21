import React, { useEffect } from "react";
import useEffectDebugger from "@hooks/useEffectDebugger";
import usePrevious from "@hooks/usePrevious";
import SpotifyWebPlayer from "types/spotify-web-player";
import SpotifyApiTypes from "types/spotify";

const playImmediately = ({
  spotify_uris,
  playerInstance,
  device_id,
}: {
  spotify_uris: string[]; //
  playerInstance: SpotifyWebPlayer.Player;
  device_id: string;
}) => {
  const { getOAuthToken } = playerInstance._options;
  if (spotify_uris.length === 0) return;
  console.log(`Going to play immediately with ${spotify_uris}`);
  try {
    getOAuthToken((access_token) => {
      fetch(
        `https://api.spotify.com/v1/me/player/play?device_id=${device_id}`,
        {
          method: "PUT",
          body: JSON.stringify({ uris: [...spotify_uris] }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
    });
  } catch (error) {
    console.error("Could not add songs and play songs", error);
  }
};

const addSongsToQueue = async ({
  spotify_uris,
  playerInstance,
  device_id,
}: {
  spotify_uris: string[]; //
  playerInstance: SpotifyWebPlayer.Player;
  device_id: string;
}) => {
  const { getOAuthToken } = playerInstance._options;
  if (spotify_uris.length === 0) return;

  console.log(`Going to add songs to queue immediately with ${spotify_uris}`);

  const requests = spotify_uris.map((uri) =>
    getOAuthToken((access_token) => {
      fetch(
        `https://api.spotify.com/v1/me/player/queue?device_id=${device_id}&uri=${uri}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
    })
  );
  try {
    const results = await Promise.all(requests);
    console.log("results", results);
  } catch (error) {
    console.error("Could not add songs to queue", error);
  }
};

// https://developer.spotify.com/documentation/web-playback-sdk/quick-start/
export const useSpotifyWebPlayer = (
  accessToken: string,
  addedTracks: SpotifyApiTypes.TrackObjectFull[],
  queue: SpotifyApiTypes.TrackObjectFull[]
) => {
  const [player, setPlayer] = React.useState<
    SpotifyWebPlayer.Player | undefined
  >();
  const [currentTrack, setCurrentTrack] = React.useState<
    SpotifyWebPlayer.Track | undefined
  >();
  const [deviceId, setDeviceId] = React.useState<string | null>(null);
  const [error, setError] = React.useState("");
  const prevTracks = usePrevious(addedTracks, []);

  const initializeWebPlayer = () => {
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
  };

  useEffectDebugger(() => {
    if (accessToken) {
      initializeWebPlayer();
    }
  }, [accessToken]);

  useEffectDebugger(
    () => {
      if (addedTracks.length > 0 && deviceId && player) {
        if (prevTracks.length === 0) {
          playImmediately({
            playerInstance: player as SpotifyWebPlayer.Player,
            spotify_uris: addedTracks.map((t) => t.uri),
            device_id: deviceId,
          });
        } else if (prevTracks[0].id !== addedTracks[0].id) {
          addSongsToQueue({
            playerInstance: player as SpotifyWebPlayer.Player,
            spotify_uris: addedTracks.map((t) => t.uri),
            device_id: deviceId,
          });
        }
      }
    },
    [addedTracks, prevTracks, deviceId, player],
    ["addedTracks", "prevTracks", "deviceId", "player"]
  );

  return {
    player,
    currentTrack,
    error,
  };
};

export default useSpotifyWebPlayer;
