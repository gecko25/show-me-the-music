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

/*Icons*/
import { Play, Pause, SkipForward, SkipBack } from "icons/index";

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
    <section
      id="SpotifyWebPlayer"
      className="text-color-primary z-20 fixed left-1 right-1 bottom-14 lg-bottom-0 md-left-0 h-10 bg-background rounded-md border-2 border-background-light"
    >
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
  <div className="text-center mt-3">
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
  </section>
);

const NoSongsInQueue = () => (
  <section className="flex flex-col items center h-full justify-center font-monteserrat-semibold text-secondary text-xl">
    <div className="text-center">
      <div className="text-secondary">
        There are no songs in the queue.&nbsp;
      </div>
    </div>
  </section>
);

/* eslint-disable @next/next/no-html-link-for-pages */
// this *must* be an href or it wont work
const UnAuthenticatedState = () => (
  <section className="flex flex-col items-center h-full justify-center font-monteserrat-semibold text-secondary text-xl">
    <span className="text-secondary">
      <a className="underline" href="/api/spotify/login">
        Login
      </a>{" "}
      to listen to your playlist
    </span>
  </section>
);

const ErrorState = () => (
  <div className="text-center mt-3 text-secondary">
    An error occured in the web player, please{" "}
    <span
      className=" text-secondary underline cursor-pointer"
      onClick={() => window.location.replace("/")}
    >
      {" "}
      click here
    </span>{" "}
    to reinitialize the player
  </div>
);

const PlayerControls = ({
  player,
  currentTrack,
  isPaused,
}: {
  player: SpotifyWebPlayerTypes.Player;
  currentTrack: SpotifyWebPlayerTypes.Track | undefined;
  isPaused: boolean;
}) => {
  if (!currentTrack)
    return <div className="text-secondary">Sorry, unable to load tracks</div>;

  return (
    <div className={`web-player-controls flex items-center ml-12px mr-12px`}>
      {currentTrack?.name && (
        <Image
          src={currentTrack.album.images[2].url}
          height={50}
          width={50}
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

        <div className="text-center">
          <button
            className="cursor-pointer"
            onClick={() => player.previousTrack()}
          >
            <SkipBack />
          </button>

          {isPaused ? (
            <button className="cursor-pointer" onClick={() => player.resume()}>
              <Play />
            </button>
          ) : (
            <button className="cursor-pointer" onClick={() => player.pause()}>
              <Pause />
            </button>
          )}

          <button className="cursor-pointer" onClick={() => player.nextTrack()}>
            <SkipForward />
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
      <a className="m-auto text-secondary " style={{ textDecoration: "none" }}>
        <span className="font-semibold">
          {skEvent?.performance[0].artist.displayName}&nbsp;
        </span>
        is playing at&nbsp;
        <span className="font-semibold">{skEvent?.venue?.displayName}</span>
        &nbsp;in&nbsp;
        <span className="text-secondary font-semibold">
          {formatLocationSimple(skEvent?.location)}
        </span>
        &nbsp;on&nbsp;
        <span className="text-secondary font-semibold">
          {getDisplayDate(skEvent)}
        </span>
      </a>
    </Link>
  );
};
