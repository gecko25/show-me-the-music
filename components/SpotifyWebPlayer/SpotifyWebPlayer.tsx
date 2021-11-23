/* eslint-disable @next/next/no-html-link-for-pages */
import { useEffect, useContext, useState } from "react";
import type { NextComponentType } from "next";
import { useRouter } from "next/router";
import Link from "next/link";
import Script from "next/script";
import Image from "next/image";

/* Types */
import SpotifyWebPlayerTypes from "types/spotify-web-player";
import { ShowMeQueueObject, SongkickEvent } from "types";

/* Utils */
import {
  getDisplayDate,
  getEventDetailsHref,
  formatLocationSimple,
} from "@utils/helpers";

/* Context */
import { AuthContext } from "@context/AuthContext";
import { PlayerContext } from "@context/PlayerContext";
import { ViewportContext } from "@context/ViewportContext";

/* Hooks */
import useSpotifyWebPlayer from "@hooks/useSpotifyWebPlayer";
import usePrevious from "@hooks/usePrevious";

/*Styles*/
import styles from "./SpotifyWebPlayer.module.scss";
import Loader from "icons/Loader";

// This prevents the spotify from throwing an error
if (typeof window !== "undefined") {
  window.onSpotifyWebPlaybackSDKReady = () => {};
}

const SpotifyWebPlayer: NextComponentType = () => {
  const { accessToken, setAccessToken } = useContext(AuthContext);
  const { addedTracks, queue } = useContext(PlayerContext);
  const { isMobile } = useContext(ViewportContext);
  const [isPaused, setIsPaused] = useState(false);
  const [skEvent, setSkEvent] = useState<SongkickEvent | null>(null);
  const router = useRouter();

  const {
    player,
    currentTrack,
    error,
  }: {
    player: SpotifyWebPlayerTypes.Player | undefined;
    currentTrack: SpotifyWebPlayerTypes.Track | undefined;
    error: string;
  } = useSpotifyWebPlayer(accessToken, addedTracks, queue);

  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    // This is shitty, but Im doing it for now
    setTimeout(() => setLoading(false), 2500);
  }, []);

  useEffect(() => {
    if (router.query.access_token) {
      const access_token = router.query.access_token as string;
      setAccessToken(access_token);
    }
  }, [setAccessToken, router.query]);

  useEffect(() => {
    const checkPausedStatus = async () => {
      if (!player) return;
      const state = await player?.getCurrentState();
      setIsPaused(Boolean(state?.paused));
    };

    checkPausedStatus();
  });

  useEffect(() => {
    const getEventInfo = () => {
      const q = queue.filter((q) => q.track.id === currentTrack?.id);
      if (q[0]) return q[0].event;
      return null;
    };

    setSkEvent(getEventInfo());
  }, [currentTrack, queue]);

  const renderWebPlayer = () => {
    if (isLoading) return <LoaderState />;
    if (accessToken && !player) return <ErrorState />;
    if (!accessToken) return <UnAuthenticatedState />;
    if (queue.length === 0) return <NoSongsInQueue />;
    if (accessToken && player && typeof window !== "undefined") {
      if (isMobile)
        return (
          <MobileWebPlayer
            skEvent={skEvent}
            player={player}
            currentTrack={currentTrack}
            queue={queue}
            isPaused={isPaused}
          />
        );
      return (
        <WebPlayer
          skEvent={skEvent}
          player={player}
          currentTrack={currentTrack}
          queue={queue}
          isPaused={isPaused}
        />
      );
    }
  };

  return (
    <section className={styles.spotifyWebPlayerContainer}>
      <Script
        src="https://sdk.scdn.co/spotify-player.js"
        strategy="afterInteractive"
      />
      {renderWebPlayer()}
    </section>
  );
};

export default SpotifyWebPlayer;

const LoaderState = () => (
  <div className="ta-center mt-10">
    <Loader />
  </div>
);

type Props = {
  skEvent: SongkickEvent | null;
  player: SpotifyWebPlayerTypes.Player;
  currentTrack: SpotifyWebPlayerTypes.Track | undefined;
  isPaused: boolean;
  queue: ShowMeQueueObject[];
};
const WebPlayer = ({
  skEvent,
  player,
  currentTrack,
  isPaused,
  queue,
}: Props) => (
  <section className={styles.SpotifyWebPlayer}>
    <EventDetails skEvent={skEvent} />
    <PlayerControls
      player={player}
      currentTrack={currentTrack}
      isPaused={isPaused}
    />
    <GoToPlaylist queue={queue} />
  </section>
);

const MobileWebPlayer = ({
  skEvent,
  player,
  currentTrack,
  isPaused,
  queue,
}: Props) => (
  <section className={styles.SpotifyWebPlayer}>
    <PlayerControls
      player={player}
      currentTrack={currentTrack}
      isPaused={isPaused}
    />
    <GoToPlaylist queue={queue} />
  </section>
);

const NoSongsInQueue = () => (
  <section className="flex fd-col ai-center h-100p jc-center">
    <div className="ta-center">
      <div>There are no songs in the queue.&nbsp;</div>
      <Link href="/">Browse events</Link> and add songs to get started!
    </div>
  </section>
);

/* eslint-disable @next/next/no-html-link-for-pages */
// this *must* be an href or it wont work
const UnAuthenticatedState = () => (
  <section className="flex fd-col ai-center h-100p jc-center">
    <div className="mb-10 ta-center">
      <Link href="/">Browse events</Link> and add to your playlist here!
    </div>
    <span className="c-text-dark">
      <a href="/api/spotify/login">Login</a> to listen.
    </span>
  </section>
);

const ErrorState = () => (
  <div className="ta-center mt-10">
    An error occured in the web player, please{" "}
    <span
      className=" c-text-dark td-underline c-pointer"
      onClick={() => window.location.replace("/")}
    >
      {" "}
      click here
    </span>{" "}
    to reinitialize the player
  </div>
);

const GoToPlaylist = ({ queue }: { queue: ShowMeQueueObject[] }) => {
  const router = useRouter();
  if (router.pathname.indexOf("queue") >= 0) {
    return (
      <div className={styles.webPlayerItem}>
        <Link href="/">Browse events</Link>
      </div>
    );
  }
  return (
    <div className={`${styles.webPlayerItem} ta-center`}>
      <Link href="/queue">See list of added songs</Link>
    </div>
  );
};

const PlayerControls = ({
  player,
  currentTrack,
  isPaused,
}: {
  player: SpotifyWebPlayerTypes.Player;
  currentTrack: SpotifyWebPlayerTypes.Track | undefined;
  isPaused: boolean;
}) => {
  if (!currentTrack) return <div>Sorry, unable to load tracks</div>;

  return (
    <div className={`web-player-controls flex ai-center ml-50 mr-50`}>
      {currentTrack?.name && (
        <Image
          src={currentTrack.album.images[2].url}
          height={74}
          width={74}
          alt={`${currentTrack.album.name}`}
        />
      )}

      <div>
        <div className={styles.songNameContainer}>
          <div className={styles.songName}>
            {currentTrack?.name}
            &nbsp;by&nbsp;
            {currentTrack?.artists[0].name}
          </div>
        </div>

        <div className="ta-center">
          <button className="c-pointer" onClick={() => player.previousTrack()}>
            <Image
              src="/images/svg/skip-back.svg"
              alt="play"
              width={30}
              height={30}
            />
          </button>

          {isPaused ? (
            <button className="c-pointer" onClick={() => player.resume()}>
              <Image
                src="/images/svg/play.svg"
                alt="play"
                width={30}
                height={30}
              />
            </button>
          ) : (
            <button className="c-pointer" onClick={() => player.pause()}>
              <Image
                src="/images/svg/pause.svg"
                alt="pause"
                width={30}
                height={30}
              />
            </button>
          )}

          <button className="c-pointer" onClick={() => player.nextTrack()}>
            <Image
              src="/images/svg/skip-forward.svg"
              alt="next track"
              width={30}
              height={30}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

const EventDetails = ({ skEvent }: { skEvent: SongkickEvent | null }) => {
  if (!skEvent) return <div></div>;
  return (
    <Link href={getEventDetailsHref(skEvent)}>
      <a className={styles.webPlayerItem} style={{ textDecoration: "none" }}>
        <span className="c-text-dark fw-600">
          {skEvent?.performance[0].artist.displayName}&nbsp;
        </span>
        is playing at&nbsp;
        <span className="c-text-dark fw-600">
          {skEvent?.venue?.displayName}
        </span>
        &nbsp;in&nbsp;
        <span className="c-text-dark fw-600">
          {formatLocationSimple(skEvent?.location)}
        </span>
        &nbsp;on&nbsp;
        <span className="c-text-dark fw-600">{getDisplayDate(skEvent)}</span>
      </a>
    </Link>
  );
};
