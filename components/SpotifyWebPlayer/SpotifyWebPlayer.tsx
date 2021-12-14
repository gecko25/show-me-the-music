/* eslint-disable @next/next/no-html-link-for-pages */
import { useEffect, useContext, useState } from "react";
import type { NextComponentType } from "next";
import { useRouter } from "next/router";
import Link from "next/link";
import Script from "next/script";
import Image from "next/image";

/* Utils */
import {
  getDisplayDate,
  getEventDetailsHref,
  formatLocationSimple,
} from "@utils/helpers";

/*Icons*/
import { Play, Pause, SkipForward, SkipBack, QueueIcon } from "icons/index";

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

/* Types */
import SpotifyWebPlayerTypes from "types/spotify-web-player";
import { ShowMeQueueObject, SongkickEvent } from "types";

type WebPlayerProps = {
  skEvent: SongkickEvent | null;
  player: SpotifyWebPlayerTypes.Player;
  currentTrack: SpotifyWebPlayerTypes.Track | undefined;
  isPaused: boolean;
  queue: ShowMeQueueObject[];
};

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
    if (accessToken && !currentTrack) return <LoaderState />;
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
      className="p-1 h-16 lg:h-24 text-color-primary z-20 fixed left-1 right-2 bottom-16 lg:bottom-0 md-left-0 bg-background rounded-md border-2 border-background-light"
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
  <div className="text-center font-monteserrat-light text-primary mt-3">
    Loading your playlist...
  </div>
);

const WebPlayer = ({
  skEvent,
  player,
  currentTrack,
  isPaused,
  queue,
}: WebPlayerProps) => (
  <section className="h-full flex justify-between items-center">
    <div className="flex">
      <Image
        className="rounded-md"
        src={currentTrack!.album.images[2].url}
        height={80}
        width={80}
        alt={`${currentTrack?.album.name}`}
      />
      <div className="flex flex-col justify-center">
        <SongName currentTrack={currentTrack} />
        <EventDetails skEvent={skEvent} />
      </div>
    </div>

    <PlayerControls
      player={player}
      currentTrack={currentTrack}
      isPaused={isPaused}
    />

    <div className="w-96 text-right pr-5">
      <QueueIcon />
      <div className="font-monteserrat-light text-secondary -mt-2">Queue</div>
    </div>
  </section>
);

const MobileWebPlayer = ({
  skEvent,
  player,
  currentTrack,
  isPaused,
  queue,
}: WebPlayerProps) => {
  return (
    <section className="h-full flex justify-between items-center">
      <div className="flex">
        <Image
          className="rounded-md"
          src={currentTrack!.album.images[2].url}
          height={50}
          width={50}
          alt={`${currentTrack?.album.name}`}
        />
        <div>
          <Scroll>
            <>
              <SongName currentTrack={currentTrack} />
              <EventDetails skEvent={skEvent} />
            </>
          </Scroll>
        </div>
      </div>

      <PlayerControls
        player={player}
        currentTrack={currentTrack}
        isPaused={isPaused}
      />
    </section>
  );
};

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
  <div
    id="ErrorState"
    className="p-1 flex justify-center items-center text-center text-md text-secondary font-monteserrat-semibold"
  >
    <div>
      An error occured in the web player. <br /> Please{" "}
      <span
        className=" text-secondary underline cursor-pointer"
        onClick={() => window.location.replace("/")}
      >
        {" "}
        click here
      </span>{" "}
      to reinitialize the player
    </div>
  </div>
);

const Scroll = ({ children }: { children: JSX.Element }) => {
  return (
    <div className={styles.scrollContainer}>
      <div className={styles.scrollContent}>{children}</div>
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
  const { isMobile } = useContext(ViewportContext);

  return (
    <div id="PlayerControls" className="flex">
      {!isMobile && (
        <button
          className="cursor-pointer"
          onClick={() => player.previousTrack()}
        >
          <SkipBack />
        </button>
      )}

      {isPaused ? (
        <button className="cursor-pointer" onClick={() => player.resume()}>
          <Play />
        </button>
      ) : (
        <button className="cursor-pointer" onClick={() => player.pause()}>
          <Pause />
        </button>
      )}

      {!isMobile && (
        <button className="cursor-pointer" onClick={() => player.nextTrack()}>
          <SkipForward />
        </button>
      )}
    </div>
  );
};

const SongName = ({
  currentTrack,
}: {
  currentTrack: SpotifyWebPlayerTypes.Track | undefined;
}) => {
  if (!currentTrack) return null;
  return (
    <div
      id="SpotifyWebPlayer__SongName"
      className="ml-2 md:ml-4 font-bebas-regular tracking-wider text-xl text-secondary lg:text-3xl"
    >
      {currentTrack.name}
      &nbsp;by&nbsp;
      {currentTrack.artists[0].name}
    </div>
  );
};

const EventDetails = ({ skEvent }: { skEvent: SongkickEvent | null }) => {
  if (!skEvent) return <div></div>;
  return (
    <div
      id="SpotifyWebPlayer__EventDetails"
      className="ml-2 md:ml-4 font-bebas-light tracking-wider text-md text-secondary lg:text-2xl"
    >
      <a className="m-auto text-secondary " style={{ textDecoration: "none" }}>
        <span className="font-semibold">{skEvent?.venue?.displayName}</span>
        &nbsp;&bull;&nbsp;
        <span className="text-secondary font-semibold">
          {formatLocationSimple(skEvent?.location)}
        </span>
        &nbsp;&bull;&nbsp;
        <span className="text-secondary font-semibold">
          {getDisplayDate(skEvent)}
        </span>
      </a>
    </div>
  );
};
