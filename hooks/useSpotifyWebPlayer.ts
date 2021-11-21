import React, { useEffect } from "react";
import useEffectDebugger from "@hooks/useEffectDebugger";
import usePrevious from "@hooks/usePrevious";
import SpotifyWebPlayer from "types/spotify-web-player";
import SpotifyApiTypes from "types/spotify";
import { splitIntoChunks } from "@utils/client-helpers";

const playImmediately = async ({
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
    await getOAuthToken((access_token) => {
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

  const requests = spotify_uris.map(
    (uri) => async () =>
      await getOAuthToken((access_token) => {
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

  const timedRequests = [];
  try {
    for (let i = 0; i < requests.length; i++) {
      const t = setTimeout(() => {
        console.log("Going to make request with batch", i);
        requests[i]();
      }, 1000);

      timedRequests.push(t);
    }

    Promise.all(timedRequests);
  } catch (error) {
    throw new Error(error);
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
  const [firstSongsInitialized, setFirstSongsInitialized] =
    React.useState(false);

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

  useEffect(() => {
    if (accessToken) {
      initializeWebPlayer();
    }
  }, [accessToken]);

  // Read the tracks from the session storage
  useEffect(() => {
    if (player && deviceId && accessToken && queue.length > 0) {
      playImmediately({
        playerInstance: player as SpotifyWebPlayer.Player,
        spotify_uris: [queue[0].uri],
        device_id: deviceId,
      });

      const uris = queue
        .slice(1, queue.length)
        .map((t: SpotifyApiTypes.TrackObjectFull) => t.uri);
      addSongsToQueue({
        playerInstance: player as SpotifyWebPlayer.Player,
        spotify_uris: uris,
        device_id: deviceId,
      });
    }
  }, [player, deviceId, accessToken]);

  // Add tracks if the user is already logged in
  useEffect(() => {
    if (addedTracks.length > 0 && deviceId && player) {
      if (prevTracks.length === 0) {
        playImmediately({
          playerInstance: player as SpotifyWebPlayer.Player,
          spotify_uris: [addedTracks[0].uri],
          device_id: deviceId,
        });

        addSongsToQueue({
          playerInstance: player as SpotifyWebPlayer.Player,
          spotify_uris: addedTracks
            .slice(1, addedTracks.length)
            .map((t: SpotifyApiTypes.TrackObjectFull) => t.uri),
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
  }, [addedTracks, prevTracks, deviceId, player]);

  return {
    player,
    currentTrack,
    error,
  };
};

export default useSpotifyWebPlayer;

// let spotify_uris = addedTracks.map(t => t.uri);
// if (!firstSongsInitialized) {
//   // Im not sure why, but I am getting 403s when I try to add songs to the queue too quickly
//   // So I am waiting for the user to add a second set of songs and retroactively inject into the queue
//   const prevTracksToAdd = prevTracks.slice(1, prevTracks.length).map((t: SpotifyApiTypes.TrackObjectFull) => t.uri);
//   addSongsToQueue({
//     playerInstance: player as SpotifyWebPlayer.Player,
//     spotify_uris: prevTracksToAdd,
//     device_id: deviceId,
//   });
//   setFirstSongsInitialized(true);
// }
