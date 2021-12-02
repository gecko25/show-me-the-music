import type { NextPage } from "next";
import { useEffect, useState, Fragment, useContext } from "react";
import { useRouter } from "next/router";
import get from "axios";

/*Styles*/
import styles from "./event.module.scss";

/* Context */
import { ViewportContext } from "@context/ViewportContext";

/* Components */
import { VenueMap, AddTracksBtn } from "@components/index";

/* Utils */
import { getHeadliners, cleanArtistBio, getDisplayDate } from "@utils/helpers";

/*Icons*/
import ArrowLeftCircle from "icons/ArrowLeftCircle";

/* Types */
import SpotifyApiTypes from "types/spotify";
import { SongkickEvent } from "types";

const Event: NextPage = () => {
  const router = useRouter();
  const { event_id, artist: songkickArtistName } = router.query;

  const { isMobile } = useContext(ViewportContext);

  const [spotifyArtist, setSpotifyArtist] =
    useState<SpotifyApiTypes.ArtistObjectFull | null>(null);
  const [skEvent, setSongkickEvent] = useState<SongkickEvent | null>(null);
  const [spotifyLoading, setSpotifyLoading] = useState(true);
  const [artistBio, setArtistBio] = useState("");
  const [similarArtists, setSimilarArtists] = useState([]);

  // Get artist details from spotify
  useEffect(() => {
    const getSpotifyArtist = async () => {
      try {
        const res = await get("/api/spotify/artist", {
          params: {
            q: songkickArtistName,
          },
        });

        // TODO: i016: https://github.com/gecko25/show-me-the-music/issues/16 More sophisticated artist matching
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

  // Get artist bio from lastfm
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
      <section className="flex flex-col items-center space-between mr-5px">
        <div className="text-center font-monteserrat-light mb-3">
          <div className="text-4xl font-monteserrat-semibold mb-3 text-secondary">
            {getDisplayName()}
          </div>

          <div className="text-xl text-secondary">
            {getDisplayDate(skEvent)}
          </div>
          <div className="text-xl text-secondary">
            Followers: {spotifyArtist?.followers.total || 0}
          </div>
          <div className="text-xl text-secondary">
            Popularity: {spotifyArtist?.popularity}
          </div>
          <div className="text-l mt-2 max-w-5xl text-secondary">
            {spotifyArtist?.genres.map((g: string) => (
              <span key={g}>•{g}</span>
            ))}
          </div>
        </div>

        <div className={styles.bottomContainer}>
          <div className="m-3px">
            {spotifyLoading && <div>Loading popular tracks...</div>}
            {!spotifyLoading && !spotifyArtist?.id && (
              <span className="block m-auto w-5/12">
                There is not a spotify artist associated with this event.
              </span>
            )}
            {!spotifyLoading && spotifyArtist?.id && (
              <iframe
                src={`https://open.spotify.com/embed/artist/${spotifyArtist?.id}?utm_source=generator&theme=0`}
                width="300"
                height={isMobile ? "175" : "280"}
                frameBorder="0"
                allowFullScreen
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                onError={() => {
                  console.log("err");
                }}
              />
            )}
          </div>

          {skEvent?.venue?.lat && skEvent?.venue?.lng && (
            <div className="w-80">
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

        <span className="px-48 text-secondary font-monteserrat-light mt-5 block">
          {artistBio}
        </span>

        {similarArtists.length > 0 && (
          <div className="mt-5 text-center">
            <div>
              <span className="c-text-dark font-semibold">Similar Artists</span>
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
