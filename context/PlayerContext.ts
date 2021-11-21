import React, { useEffect } from "react";

/* Types */
import SpotifyApiTypes from "types/spotify";

export interface IPlayerContext {
  queue: SpotifyApiTypes.TrackObjectFull[];
  addedTracks: SpotifyApiTypes.TrackObjectFull[];
  addToQueue: (track_uris: SpotifyApiTypes.TrackObjectFull[]) => void;
}

const defaultContext: IPlayerContext = {
  queue: [],
  addedTracks: [],
  addToQueue: () => {},
};

export const PlayerContext = React.createContext(defaultContext);

/** Only the provider should use this hook.
 * Everything else should use React.useContext(PlayerContext)
 * This hook allows the value of the auth to not be overridden by defaults everytime
 */
export const usePlayerContext = (): IPlayerContext => {
  const [queue, setQueue] = React.useState<SpotifyApiTypes.TrackObjectFull[]>(
    []
  );

  const [addedTracks, setAddedTracks] = React.useState<
    SpotifyApiTypes.TrackObjectFull[]
  >([]);

  const [artistsInQueue, addArtistToQueue] = React.useState<
    SpotifyApiTypes.ArtistObjectFull[]
  >([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedQueue = window.sessionStorage.getItem("queue");
      if (savedQueue) {
        const parsed = JSON.parse(savedQueue);
        setQueue(parsed);
        setAddedTracks(parsed);
      }
    }
  }, []);

  const addToQueue = (tracks: SpotifyApiTypes.TrackObjectFull[]) => {
    setAddedTracks(tracks);
    setQueue([...queue, ...tracks]);
    sessionStorage.setItem("queue", JSON.stringify([...queue, ...tracks]));
  };

  // We keep track of artists added to the queue so we dont add duplicates
  // But more importantly, so can give the user feedback that they have already added this artist
  // const registerArtistInQueue = (spotifyArtist: SpotifyApiTypes.ArtistObjectFull) => {
  //   addArtistToQueue([...artistsInQueue, spotifyArtist]);
  //   console.log('Artists in queue updated updated', [...queue, ...tracksUris]);
  // }

  return {
    queue,
    addedTracks,
    addToQueue,
  };
};
