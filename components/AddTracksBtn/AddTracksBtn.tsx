import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { SongkickEvent } from "types";
import get from "axios";

/* Utils */
import { createQueueObject } from "@utils/helpers";

/* Styles */
import styles from "./AddTracksBtn.module.scss";

/*Icons*/
import PlaylistAdd from "icons/PlaylistAdd";
import PlaylistAddCheck from "icons/PlaylistAddCheck";
import Loader from "icons/Loader";

/* Context */
import { PlayerContext } from "@context/PlayerContext";
import SpotifyApi from "types/spotify";

type Props = {
  skEvent: SongkickEvent | null;
  spotifyArtist: SpotifyApi.ArtistObjectFull | null;
};
const AddTracksBtn = ({ skEvent, spotifyArtist }: Props) => {
  const { queue, addToQueue } = useContext(PlayerContext);
  const [error, setError] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [tracksAlreadyAdded, setTracksAlreadyAdded] = useState(false);

  useEffect(() => {
    if (!queue || !skEvent) return;
    queue.forEach((q) => {
      if (q.event.id === skEvent.id) setTracksAlreadyAdded(true);
    });
  }, [queue, skEvent]);

  const addTracks = async () => {
    setIsAdding(true);
    setError(false);
    try {
      const res = await get(`/api/spotify/top-tracks`, {
        params: {
          artist_id: spotifyArtist?.id,
        },
      });
      addToQueue(
        createQueueObject(res.data.tracks.slice(0, 3), skEvent as SongkickEvent)
      );
    } catch (error) {
      console.error("Could not get artists top tracks", error);
      setError(true);
    } finally {
      setIsAdding(false);
    }
  };

  if (!spotifyArtist || !skEvent) return null;

  return (
    <section className={styles.AddTracksBtnContainer}>
      {isAdding && (
        <button className={styles.AddTracksBtn}>
          <Loader />
        </button>
      )}

      {!tracksAlreadyAdded && !isAdding && (
        <>
          <button className={styles.AddTracksBtn} onClick={addTracks}>
            <PlaylistAdd />
          </button>
          <span className="text-sm block">Add tracks</span>
        </>
      )}

      {tracksAlreadyAdded && !isAdding && (
        <>
          <button className={styles.AddTracksBtn} disabled>
            <PlaylistAddCheck />
          </button>
          <span className="text-sm block">Tracks added</span>
        </>
      )}

      {error && <div>Oops! There was an error trying to add your tracks</div>}
    </section>
  );
};

export default AddTracksBtn;
