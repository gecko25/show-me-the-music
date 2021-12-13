import type { NextPage } from "next";
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
import { getHeadliners, cleanArtistBio, getDisplayDate } from "@utils/helpers";

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

      <h1 className="text-2xl font-monteserrat-semibold mt-5 mb-1 text-secondary">
        Popular Songs
      </h1>
      <Songs spotifyLoading={spotifyLoading} spotifyArtist={spotifyArtist} />

      <h1 className="text-2xl font-monteserrat-semibold mt-5 mb-1 text-secondary">
        Venue Info
      </h1>
      <VenueInfo skEvent={skEvent} />
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
  const artistImageUri = headliners[0]?.id
    ? `https://images.sk-static.com/images/media/profile_images/artists/${headliners[0].id}/huge_avatar`
    : "";

  const ref = useRef<HTMLDivElement | null>(null);
  const options = {
    rootMargin: "-94px 0px 0px 0px",
  };
  const entry = useIntersectionObserver(ref, options);
  const showNavBar = !entry?.isIntersecting;
  return (
    <>
      <div
        id="ArtistBanner"
        className="w-full h-72 bg-no-repeat bg-cover relative"
        style={{ backgroundImage: `url(${artistImageUri})` }}
      >
        <div ref={ref} className="absolute -bottom-9 right-3">
          <AddTracksBtn skEvent={skEvent} spotifyArtist={spotifyArtist} />
        </div>
      </div>

      {/* Nav bar that appears when the user scrolls down */}
      <div
        id="NavBar"
        className={`${
          showNavBar ? "flex" : "hidden"
        } bg-background border-b-2 z-10 border-background-light h-16 fixed top-0 right-0 left-0 justify-end`}
      >
        <div className="w-full h-16 relative">
          <div className="text-primary text-3xl my-2 font-bebas-regular w-full flex justify-center">
            <span>{spotifyArtist?.name}</span>
          </div>
          <div className="text-secondary text-xl -my-4 font-bebas-light w-full flex justify-center">
            <span>{getDisplayDate(skEvent)}</span>
          </div>

          <div className="absolute -bottom-8 right-3">
            <AddTracksBtn skEvent={skEvent} spotifyArtist={spotifyArtist} />
          </div>
        </div>
      </div>

      <div className="">
        <Link href="/" passHref>
          <div
            id="GoBack"
            className={`bg-opacity-90 w-12 h-12 rounded-full fixed top-1 left-1 flex items-center justify-center pr-1 z-10`}
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
    <div id="EventTitle" className="mt-6 mb-6 text-secondary ">
      <div className="text-3xl font-monteserrat-semibold">
        {getDisplayName()}
      </div>
      <div className="text-xl text-secondary opacity-100 z-10">
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
  const { isMobile, innerWidth } = useContext(ViewportContext);

  return (
    <div className="m-3px">
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
          width={innerWidth}
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
  const { isMobile, innerWidth } = useContext(ViewportContext);
  if (!skEvent?.venue?.lat && !skEvent?.venue?.lng) {
    return (
      <span className="block font-monteserrat-light text-secondary m-auto w-5/12">
        Venue information is not available.
      </span>
    );
  }
  return (
    <div style={{ width: `${innerWidth}px` }}>
      <div className="text-secondary font-bebas-regular">
        {skEvent.venue.displayName}
      </div>
      <VenueMap
        lat={skEvent?.venue.lat}
        lng={skEvent?.venue.lng}
        googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyCY591DoZl4S6hHC7xyWUc3V8rbuy7xE9w&v=3.exp&libraries=geometry,drawing,places"
        loadingElement={<div className="text-secondary">Loading map...</div>}
        containerElement={<div style={{ height: `300px` }} />}
        mapElement={<div style={{ height: `100%` }} />}
      />
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

// <Fragment>
//   <section className="flex flex-col items-center space-between mr-5px">
//     <div className="text-center font-monteserrat-light mb-3">
// <div className="text-4xl mt-1 font-monteserrat-semibold mb-3 text-secondary">
//   {getDisplayName()}
// </div>

// <div className="text-xl text-secondary">
//   {getDisplayDate(skEvent)}
// </div>
//       <div className="text-xl text-secondary">
//         Followers: {spotifyArtist?.followers.total || 0}
//       </div>
//       <div className="text-xl text-secondary">
//         Popularity: {spotifyArtist?.popularity}
//       </div>
// <div className="text-l mt-2 max-w-5xl text-secondary">
//   {spotifyArtist?.genres.map((g: string) => (
//     <span key={g}>•{g}</span>
//   ))}
// </div>
//     </div>

//     <div className={styles.bottomContainer}>
// <div className="m-3px">
//   {spotifyLoading && (
//     <div className="text-secondary">Loading popular tracks...</div>
//   )}
//   {!spotifyLoading && !spotifyArtist?.id && (
//     <span className="block text-secondary m-auto w-5/12">
//       There is not a spotify artist associated with this event.
//     </span>
//   )}
//   {!spotifyLoading && spotifyArtist?.id && (
//     <iframe
//       src={`https://open.spotify.com/embed/artist/${spotifyArtist?.id}?utm_source=generator&theme=0`}
//       width="300"
//       height={isMobile ? "175" : "280"}
//       frameBorder="0"
//       allowFullScreen
//       allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
//       onError={() => {
//         console.log("err");
//       }}
//     />
//   )}
// </div>

// {skEvent?.venue?.lat && skEvent?.venue?.lng && (
//   <div className="w-80">
//     <VenueMap
//       lat={skEvent?.venue.lat}
//       lng={skEvent?.venue.lng}
//       googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyCY591DoZl4S6hHC7xyWUc3V8rbuy7xE9w&v=3.exp&libraries=geometry,drawing,places"
//       loadingElement={
//         <div className="text-secondary">Loading map...</div>
//       }
//       containerElement={<div style={{ height: `300px` }} />}
//       mapElement={<div style={{ height: `100%` }} />}
//     />
//   </div>
// )}
//     </div>

//     <span className="px-48 text-secondary font-monteserrat-light mt-5 block">
//       {artistBio}
//     </span>

// {similarArtists.length > 0 && (
//   <div className="mt-5 text-center">
//     <div>
//       <span className="c-text-dark font-semibold">Similar Artists</span>
//     </div>
//     {similarArtists.map((a: any) => (
//       <span key={a.name}>•{a.name}</span>
//     ))}
//   </div>
// )}
//   </section>
// </Fragment>
// );
// };

export default Event;
