import type { NextPage } from "next";
import Link from "next/link";
import { useEffect, useState, Fragment, useContext } from "react";
import { useRouter } from "next/router";
import get from "axios";
import moment from "moment";

/*Styles*/
import styles from "./event.module.scss";

/* Components */
import { VenueMap } from "@components/index";

/* Utils */
import { getHeadliners, cleanArtistBio } from "@utils/client-helpers";

/* Context */
import { PlayerContext } from "@context/PlayerContext";

/* Types */
import SpotifyApiTypes from "types/spotify";
import { SongkickEvent } from "types";

const Event: NextPage = () => {
  const router = useRouter();
  const { event_id, artist: songkickArtistName } = router.query;

  const [spotifyArtist, setSpotifyArtist] =
    useState<SpotifyApiTypes.ArtistObjectFull | null>(null);
  const [skEvent, setSongkickEvent] = useState<SongkickEvent | null>(null);
  const [spotifyLoading, setSpotifyLoading] = useState(true);
  const [artistBio, setArtistBio] = useState("");
  const [similarArtists, setSimilarArtists] = useState([]);
  const [tracksAlreadyAdded, setTracksAlreadyAdded] = useState(false);

  const { queue, addToQueue } = useContext(PlayerContext);
  // Get artist details from spotify
  useEffect(() => {
    const getSpotifyArtist = async () => {
      try {
        const res = await get("/api/spotify/artist", {
          params: {
            q: songkickArtistName,
          },
        });

        // TODO: i016: https://github.com/gecko25/show-me-the-music/issues/16
        // More sophisticated artist matching
        setSpotifyArtist(res.data.artists.items[0]);
      } catch (error) {
        console.error(error);
      } finally {
        setSpotifyLoading(false);
      }
    };

    if (songkickArtistName) getSpotifyArtist();
  }, [songkickArtistName]);

  // Get Event Details from sonkick
  useEffect(() => {
    const getEventDetails = async () => {
      try {
        const res = await get("/api/songkick/event", {
          params: {
            event_id,
          },
        });

        setSongkickEvent(res.data.resultsPage.results.event);
      } catch (error) {
        // TODO handle error
        console.error(error);
      }
    };

    if (event_id) getEventDetails();
  }, [event_id]);

  useEffect(() => {
    const getLastFmArtistDetails = async (artistName: string) => {
      try {
        let params = {
          method: "artist.getInfo",
          format: "json",
          artist: artistName,
        };

        const res = await get("/api/lastfm/artist", {
          params,
        });

        setArtistBio(cleanArtistBio(res.data.artist.bio.summary));
        setSimilarArtists(res.data.artist.similar.artist);
      } catch (error) {
        // TODO handle error
        console.error("Couldnt error get lastfm artist bio", error);
      }
    };

    if (skEvent) {
      const headliners = getHeadliners(skEvent);
      const artistName = headliners[0].displayName;
      if (artistName) getLastFmArtistDetails(artistName);
    }
  }, [skEvent]);

  const addTracks = async () => {
    // TODO: check if the tracks have been added for this event
    try {
      const res = await get(`/api/spotify/top-tracks`, {
        params: {
          artist_id: spotifyArtist?.id,
        },
      });

      addToQueue(res.data.tracks.slice(0, 3));
      setTracksAlreadyAdded(true);
    } catch (error) {
      console.error("Could not get artists top tracks", error);
    }
  };

  // Populate page with info we have from previous page
  // If no info from previous page, get songkick event details
  // Fill in with spotify data

  const day = moment(skEvent?.start?.date);
  const displayDay = day.format("ddd"); // Mon
  const displayDate = day.format("MMM DD"); // Aug 12
  const displayTime = skEvent?.start?.datetime
    ? moment(skEvent.start.datetime).format("h:mm a").toUpperCase()
    : null; // 7:00PM

  const getDisplayName = () => {
    const name = skEvent?.displayName.substring(
      0,
      skEvent.displayName.indexOf(" (")
    );
    if (!name) return skEvent?.displayName;
    return name;
  };

  return (
    <Fragment>
      <Link href="/" passHref>
        <button className={`m-10 text-big ${styles.backbtn}`}>Back</button>
      </Link>

      <section className="flex fd-col ai-center jc-space-btwn">
        <div className="ta-center">
          <div className="text-big">{getDisplayName()}</div>

          <div>
            {displayDay}&nbsp;{displayDate} {displayTime && "@"} {displayTime}
          </div>
          <div className="text-small mt-10">
            Followers: {spotifyArtist?.followers.total || 0}
          </div>
          <div className="text-small mb-10">
            Popularity: {spotifyArtist?.popularity}
          </div>
          <div>
            {spotifyArtist?.genres.map((g: string) => (
              <span key={g}>•{g}</span>
            ))}
          </div>
        </div>

        <div className={styles.bottomContainer}>
          <div className="m-10">
            {spotifyLoading && <div>Loading popular tracks...</div>}
            {!spotifyLoading && (
              <iframe
                src={`https://open.spotify.com/embed/artist/${spotifyArtist?.id}?utm_source=generator&theme=0`}
                width="300"
                height="280"
                frameBorder="0"
                allowFullScreen
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              />
            )}
          </div>

          {skEvent?.venue?.lat && skEvent?.venue?.lng && (
            <div style={{ width: "300px" }}>
              <VenueMap
                lat={skEvent?.venue.lat}
                lng={skEvent?.venue.lng}
                googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyCY591DoZl4S6hHC7xyWUc3V8rbuy7xE9w&v=3.exp&libraries=geometry,drawing,places"
                loadingElement={<div>Loading map...</div>}
                containerElement={<div style={{ height: `300px` }} />}
                mapElement={<div style={{ height: `100%` }} />}
              />
            </div>
          )}
        </div>

        {tracksAlreadyAdded ? (
          <button disabled>Tracks added to playlist ✅</button>
        ) : (
          <button className="p-10 m-10" onClick={addTracks}>
            Add top tracks to playlist
          </button>
        )}

        <span className="mw-80vw mt-20 block">{artistBio}</span>

        {similarArtists.length > 0 && (
          <div className="mt-20">
            <div className="ta-center">
              <span className="c-text-dark fw-600">Similar Artists</span>
            </div>
            {similarArtists.map((a: any) => (
              <span key={a.name}>•{a.name}</span>
            ))}
          </div>
        )}
      </section>
    </Fragment>
  );
};

export default Event;
