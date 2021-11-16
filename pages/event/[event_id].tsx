import type { NextPage } from "next";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import get from "axios";
import moment from "moment";

/*Styles*/
import styles from "./event.module.scss";

/* Types */
import SpotifyTypes from "types/spotify";
import { SongkickEvent } from "types";
import { VenueMap } from "@components/index";

const Event: NextPage = () => {
  const router = useRouter();
  const { event_id, artist: songkickArtistName } = router.query;

  const [spotifyArtist, setSpotifyArtist] =
    useState<SpotifyTypes.ArtistObjectFull | null>(null);
  const [skEvent, setSongkickEvent] = useState<SongkickEvent | null>(null);
  const [spotifyLoading, setSpotifyLoading] = useState(true);

  // Get artist details from spotify
  useEffect(() => {
    const getArtistDetails = async () => {
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

    if (songkickArtistName) getArtistDetails();
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

  // Populate page with info we have from previous page
  // If no info from previous page, get songkick event details
  // Fill in with spotify data

  const day = moment(skEvent?.start.date);
  const displayDay = day.format("ddd"); // Mon
  const displayDate = day.format("MMM DD"); // Aug 12
  const displayTime = skEvent?.start.datetime
    ? moment(skEvent.start.datetime).format("h:mm a").toUpperCase()
    : null; // 7:00PM

  return (
    <section className="flex fd-col ai-center mh-80vh jc-space-btwn">
      <div className="ta-center">
        <div className="mt-20 text-big">
          {skEvent?.displayName.substring(0, skEvent.displayName.indexOf(" ("))}
        </div>

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
              height="300"
              frameBorder="0"
              allowFullScreen
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            />
          )}
        </div>

        {skEvent?.venue.lat && skEvent?.venue.lng && (
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

      <Link href="/" passHref>
        <button className="m-20 text-big">BACK</button>
      </Link>
    </section>
  );
};

export default Event;
