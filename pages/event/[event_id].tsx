import type { NextPage } from "next";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import get from "axios";
import moment from "moment";

/* Types */
import SpotifyTypes from "../../types/spotify";
import { SongkickEventResult, SongkickEvent } from "../../types";

const Event: NextPage = () => {
  const router = useRouter();
  const { event_id, artist: songkickArtistName } = router.query;

  const [spotifyArtist, setSpotifyArtist] =
    useState<SpotifyTypes.ArtistObjectFull | null>(null);
  const [skEvent, setSongkickEvent] = useState<SongkickEvent | null>(null);

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
      }
    };

    if (songkickArtistName) getArtistDetails();
  }, [songkickArtistName]);

  useEffect(() => {
    const getEventDetails = async () => {
      try {
        const res = await get("/api/songkick/event", {
          params: {
            event_id,
          },
        });

        setSongkickEvent(res.data.resultsPage.results.event);
        console.log(res.data.resultsPage.results.event);
      } catch (error) {
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
    <section>
      <div>{skEvent?.displayName}</div>
      <div>
        {displayDay}&nbsp;{displayDate} {displayTime && "@"} {displayTime}
      </div>
      <div>Followers: {spotifyArtist?.followers.total || 0}</div>
      <div>Popularity: {spotifyArtist?.popularity}</div>
      <div>
        {spotifyArtist?.genres.map((g: string) => (
          <span key={g}>•{g}</span>
        ))}
      </div>

      {spotifyArtist?.id && (
        <iframe
          src={`https://open.spotify.com/embed/artist/${spotifyArtist?.id}?utm_source=generator&theme=0`}
          width="100%"
          height="380"
          frameBorder="0"
          allowFullScreen
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        />
      )}

      <Link href="/" passHref>
        <button>BACK</button>
      </Link>
    </section>
  );
};

export default Event;
