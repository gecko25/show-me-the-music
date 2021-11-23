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

  return (
    <section className={styles.spotifyWebPlayerContainer}>
      <Script
        src="https://sdk.scdn.co/spotify-player.js"
        strategy="afterInteractive"
      />

      {
        /* eslint-disable @next/next/no-html-link-for-pages */
        // this *must* be an href or it wont work
        !accessToken && (
          <section className="flex fd-col ai-center h-100p jc-center">
            <div className="mb-10 ta-center">
              <Link href="/">Browse events</Link> and add to your playlist here!
            </div>
            <span className="c-text-dark">
              <a href="/api/spotify/login">Login</a> to listen.
            </span>
          </section>
        )
      }

      {queue.length === 0 && (
        <section className="flex fd-col ai-center h-100p jc-center">
          <div className="ta-center">
            <div>There are no songs in the queue.&nbsp;</div>
            <Link href="/">Browse events</Link> and add songs to get started!
          </div>
        </section>
      )}

      {accessToken &&
        player &&
        typeof window !== "undefined" &&
        queue.length > 0 &&
        currentTrack &&
        !isMobile && (
          <section className={styles.SpotifyWebPlayer}>
            <EventDetails skEvent={skEvent} />
            <PlayerControls
              player={player}
              currentTrack={currentTrack}
              isPaused={isPaused}
            />
            <GoToPlaylist queue={queue} />
          </section>
        )}

      {accessToken &&
        player &&
        typeof window !== "undefined" &&
        queue.length > 0 &&
        currentTrack &&
        isMobile && (
          <section className={styles.SpotifyWebPlayer}>
            <PlayerControls
              player={player}
              currentTrack={currentTrack}
              isPaused={isPaused}
            />
            <GoToPlaylist queue={queue} />
          </section>
        )}
    </section>
  );
};

export default SpotifyWebPlayer;

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
    <div className={styles.webPlayerItem}>
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
  if (!currentTrack) return <div>Sorry, unable to tracks</div>;

  return (
    <div
      className={`web-player-controls flex fd-col ai-center ${styles.webPlayerItem}`}
    >
      {currentTrack?.name && (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Image
            src={currentTrack.album.images[2].url}
            height={44}
            width={44}
            alt={`${currentTrack.album.name}`}
          />
          <div className="ml-10">
            <span>{currentTrack.name}</span>
            <span>&nbsp;by&nbsp;</span>
            <span>{currentTrack.artists[0].name}</span>
          </div>
        </div>
      )}

      <div>
        <button className="c-pointer" onClick={() => player.previousTrack()}>
          <Image
            src="/images/svg/skip-back.svg"
            alt="play"
            width={20}
            height={20}
          />
        </button>

        {isPaused ? (
          <button className="c-pointer" onClick={() => player.resume()}>
            <Image
              src="/images/svg/play.svg"
              alt="play"
              width={20}
              height={20}
            />
          </button>
        ) : (
          <button className="c-pointer" onClick={() => player.pause()}>
            <Image
              src="/images/svg/pause.svg"
              alt="pause"
              width={20}
              height={20}
            />
          </button>
        )}

        <button className="c-pointer" onClick={() => player.nextTrack()}>
          <Image
            src="/images/svg/skip-forward.svg"
            alt="next track"
            width={20}
            height={20}
          />
        </button>
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
