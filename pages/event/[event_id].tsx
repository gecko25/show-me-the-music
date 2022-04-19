import type { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useRef, useContext } from "react";
import { useRouter } from "next/router";
import get from "axios";

/*Styles*/
import styles from "./event.module.scss";

/* Context */
import { ViewportContext } from "@context/ViewportContext";
import { NavContext } from "@context/NavContext";

/* Components */
import { VenueMap, AddTracksBtn } from "@components/index";

/* Utils */
import {
  getHeadliners,
  cleanArtistBio,
  getDisplayDate,
  formatLocationSimple,
  calculateWidth,
} from "@utils/helpers";

/*Icons*/
import BackIcon from "icons/BackIcon";

/*Hooks*/
import useIntersectionObserver from "hooks/useIntersectionObserver";

/* Types */
import SpotifyApiTypes from "types/spotify";
import { SongkickEvent, SongkickArtist } from "types";

const Event: NextPage = () => {
  const router = useRouter();
  const { event_id, artist: songkickArtistName } = router.query;

  /* Context */
  const { isMobile } = useContext(ViewportContext);
  const { setNavIcons } = useContext(NavContext);

  /* State */
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

        console.log("res.data.artist", res.data.artist);

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

  if (!skEvent) {
    return (
      <div className="flex h-full justify-center items-center font-bebas-bold text-2xl text-primary">
        Loading your event..
      </div>
    );
  }

  return (
    <section className="pb-14">
      <ArtistBanner skEvent={skEvent} spotifyArtist={spotifyArtist} />

      <div className="site-content-container">
        <EventTitle skEvent={skEvent} />

        <h1 className="text-2xl font-monteserrat-semibold mb-1 text-secondary">
          Genre
        </h1>
        <Genres spotifyArtist={spotifyArtist} />

        <h1 className="text-2xl font-monteserrat-semibold mt-5 mb-1 text-secondary">
          Similar Artists
        </h1>
        <SimilarArtists similarArtists={similarArtists} />

        <h1 className="text-2xl font-monteserrat-semibold mt-5 mb-1 text-secondary">
          About
        </h1>
        <ArtistBio artistBio={artistBio} />

        <div className="md:flex md:justify-between">
          <div>
            <h1 className="text-2xl font-monteserrat-semibold mt-5 mb-1 text-secondary">
              Popular Songs
            </h1>
            <Songs
              spotifyLoading={spotifyLoading}
              spotifyArtist={spotifyArtist}
            />
          </div>

          <div>
            <h1 className="text-2xl font-monteserrat-semibold mt-5 mb-1 text-secondary">
              Venue Info
            </h1>
            <VenueInfo skEvent={skEvent} />
          </div>
        </div>

        {isMobile && (
          <div className="text-right p-4">
            <Image
              className=""
              src="/images/svg/powered-by-songkick-white.svg"
              alt="Powered by Songkick Logo"
              width={86}
              height={30}
            />
          </div>
        )}
      </div>
    </section>
  );
};

const ArtistBio = ({ artistBio }: { artistBio: string }) => {
  if (!artistBio.trim())
    return (
      <span className="text-secondary font-monteserrat-light">
        Artist bio unavailable.
      </span>
    );
  return (
    <span className="text-secondary font-monteserrat-light block">
      {artistBio}
    </span>
  );
};

const Genres = ({
  spotifyArtist,
}: {
  spotifyArtist: SpotifyApiTypes.ArtistObjectFull | null;
}) => {
  if (spotifyArtist?.genres.length === 0)
    return (
      <span className="text-secondary font-monteserrat-light">
        No genres available.
      </span>
    );

  return (
    <div id="Genres">
      {spotifyArtist?.genres.map((g: string, ind: number) => (
        <span className="text-secondary font-monteserrat-light" key={g}>
          <span className={`${ind === 0 ? "hidden" : ""}`}>&nbsp;•&nbsp;</span>
          {g}
        </span>
      ))}
    </div>
  );
};

const ArtistBanner = ({
  skEvent,
  spotifyArtist,
}: {
  skEvent: SongkickEvent;
  spotifyArtist: SpotifyApiTypes.ArtistObjectFull | null;
}) => {
  const headliners = getHeadliners(skEvent);

  const artistImageUri =
    `https://images.sk-static.com/images/media/profile_images/artists/${headliners[0].id}/huge_avatar` ||
    "";

  const ref = useRef<HTMLDivElement | null>(null);
  const options = {
    rootMargin: "-132px 0px 0px 0px",
  };
  const entry = useIntersectionObserver(ref, options);
  const showNavBar = !entry?.isIntersecting;
  return (
    <>
      <div
        id="ArtistBanner"
        className="w-full h-72 lg:h-80 bg-no-repeat bg-cover relative"
        style={{ backgroundImage: `url(${artistImageUri})` }}
      >
        <div ref={ref} className="absolute -bottom-14 right-4">
          <AddTracksBtn skEvent={skEvent} spotifyArtist={spotifyArtist} />
        </div>
      </div>

      {/* Nav bar that appears when the user scrolls down */}
      <div
        id="ArtistBanner__EventSummary"
        className={`${
          showNavBar ? "flex" : "hidden"
        } bg-background border-b-2 z-10 border-background-light h-24 fixed top-0 right-0 left-0 lg:left-15vw justify-end`}
      >
        <div className="w-full h-24 relative flex flex-col p-3">
          <div className="text-primary text-3xl font-bebas-regular w-full flex justify-center">
            <span>{spotifyArtist?.name}</span>
          </div>
          <div className="text-secondary text-xl -mt-1 font-bebas-light w-full flex justify-center">
            <span>{getDisplayDate(skEvent)}</span>
          </div>
          <div className="text-secondary text-xl -mt-1 font-bebas-light w-full flex justify-center">
            <span>{skEvent?.venue?.displayName}</span>&nbsp;&bull;&nbsp;
            <span>{formatLocationSimple(skEvent?.location)}</span>
          </div>
          <div className="absolute -bottom-11 right-4">
            <AddTracksBtn skEvent={skEvent} spotifyArtist={spotifyArtist} />
          </div>
        </div>
      </div>

      <div className="">
        <Link href="/" passHref>
          <div
            id="GoBack"
            style={{ backgroundColor: "#2D2F32" }}
            className={`cursor-pointer border-gray-700 border-2 p-1 bg-opacity-10 rounded-full fixed top-5 left-2 lg:left-16vw flex items-center justify-center z-10`}
          >
            <BackIcon />
          </div>
        </Link>
      </div>
    </>
  );
};

const EventTitle = ({ skEvent }: { skEvent: SongkickEvent }) => {
  const getDisplayName = () => {
    const name = skEvent?.displayName.substring(
      0,
      skEvent.displayName.indexOf(" (")
    );
    if (!name) return skEvent?.displayName;
    return name;
  };

  return (
    <div id="EventTitle" className="mb-6 mt-6 mr-24 sm:mr-0 text-secondary ">
      <a href={skEvent.uri}>
        <div className="text-4xl font-monteserrat-semibold">
          {getDisplayName()}
        </div>
      </a>
      <div className="text-xl lg:text-2xl text-secondary opacity-100 z-10">
        {getDisplayDate(skEvent)}
      </div>
    </div>
  );
};

const Songs = ({
  spotifyLoading,
  spotifyArtist,
}: {
  spotifyLoading: Boolean;
  spotifyArtist: SpotifyApiTypes.ArtistObjectFull | null;
}) => {
  const { isMobile, isDesktop, innerWidth } = useContext(ViewportContext);
  const iframeWidth = calculateWidth({ isMobile, isDesktop, innerWidth });
  return (
    <div className="md:ml-auto -ml-3">
      {spotifyLoading && (
        <div className="text-secondary font-bebas-light">
          Loading popular tracks...
        </div>
      )}
      {!spotifyLoading && !spotifyArtist?.id && (
        <span className="block text-secondary font-monteserrat-light m-auto w-5/12">
          There is not a spotify artist associated with this event.
        </span>
      )}
      {!spotifyLoading && spotifyArtist?.id && (
        <iframe
          src={`https://open.spotify.com/embed/artist/${spotifyArtist?.id}?utm_source=generator&theme=0`}
          width={iframeWidth}
          height={isMobile ? "175" : "280"}
          frameBorder="0"
          allowFullScreen
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          onError={() => {
            console.log("Errror loading the spotify iframe");
          }}
        />
      )}
    </div>
  );
};

const VenueInfo = ({ skEvent }: { skEvent: SongkickEvent }) => {
  const { isMobile, isDesktop, innerWidth } = useContext(ViewportContext);
  const mapWidth = calculateWidth({ isMobile, isDesktop, innerWidth });
  if (!skEvent?.venue?.lat && !skEvent?.venue?.lng) {
    return (
      <span className="block font-monteserrat-light text-secondary m-auto w-5/12">
        Venue information is not available.
      </span>
    );
  }
  return (
    <div style={{ width: `${mapWidth}px` }}>
      <div className="text-secondary font-bebas-regular">
        {skEvent.venue.displayName}
      </div>
      <div className="md:ml-auto -ml-3">
        <VenueMap
          lat={skEvent?.venue.lat}
          lng={skEvent?.venue.lng}
          googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyCY591DoZl4S6hHC7xyWUc3V8rbuy7xE9w&v=3.exp&libraries=geometry,drawing,places"
          loadingElement={<div className="text-secondary">Loading map...</div>}
          containerElement={<div style={{ height: `300px` }} />}
          mapElement={<div style={{ height: `100%` }} />}
        />
      </div>
    </div>
  );
};

const SimilarArtists = ({ similarArtists }: { similarArtists: any[] }) => {
  if (similarArtists?.length === 0)
    return (
      <span className="text-secondary font-monteserrat-light">
        No similar artists available.
      </span>
    );

  return (
    <>
      {similarArtists.length > 0 && (
        <div id="SimilarArtists">
          {similarArtists.map((a: any, ind: number) => (
            <span
              className="text-secondary font-monteserrat-light"
              key={a.name}
            >
              <span className={`${ind === 0 ? "hidden" : ""}`}>
                &nbsp;•&nbsp;
              </span>
              {a.name}
            </span>
          ))}
        </div>
      )}
    </>
  );
};

export default Event;
