/* eslint-disable @next/next/no-html-link-for-pages */
import { useEffect, useContext, useState } from "react";
import type { NextComponentType } from "next";
import { useRouter } from "next/router";
import Link from "next/link";
import Script from "next/script";
import Image from "next/image";

/* Types */
import SpotifyWebPlayerTypes from "types/spotify-web-player";
import { SongkickEvent } from "types";

/* Utils */
import { getDisplayDate, getEventDetailsHref } from "@utils/helpers";

/* Context */
import { AuthContext } from "@context/AuthContext";
import { PlayerContext } from "@context/PlayerContext";

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
    <section className={styles.spotifyWebPlayer}>
      <Script
        src="https://sdk.scdn.co/spotify-player.js"
        strategy="afterInteractive"
      />

      {
        /* eslint-disable @next/next/no-html-link-for-pages */
        // this *must* be an href or it wont work
        !accessToken && (
          <section className="flex fd-col ai-center h-100p jc-center">
            <div>Browse events and add to your playlist here!</div>
            <a href="/api/spotify/login">Login</a>
          </section>
        )
      }

      {queue.length === 0 && (
        <section className="flex fd-col ai-center h-100p jc-center">
          <div>
            There are no songs in the queue. Add some songs to get started!
          </div>
        </section>
      )}

      {accessToken &&
        player &&
        typeof window !== "undefined" &&
        queue.length > 0 && (
          <section className="flex ai-center h-100p jc-space-btwn p-10">
            {skEvent && (
              <Link href={getEventDetailsHref(skEvent)}>
                <a
                  className={styles.webPlayerItem}
                  style={{ textDecoration: "none" }}
                >
                  Playing at&nbsp;
                  <span className="c-text-dark fw-600">
                    {skEvent?.venue.displayName}
                  </span>
                  &nbsp;in&nbsp;
                  <span className="c-text-dark fw-600">
                    {skEvent?.location.city}
                  </span>
                  &nbsp;on&nbsp;
                  <span className="c-text-dark fw-600">
                    {getDisplayDate(skEvent)}
                  </span>
                </a>
              </Link>
            )}

            <div
              className={`web-player-controls flex fd-col ai-center ${styles.webPlayerItem}`}
            >
              {currentTrack?.name && (
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Image
                    src={currentTrack.album.images[2].url}
                    height={54}
                    width={54}
                    alt={`${currentTrack.album.name}`}
                  />
                  <span>{currentTrack.name}</span>
                  <span>&nbsp;by&nbsp;</span>
                  <span>{currentTrack.artists[0].name}</span>
                </div>
              )}

              <div className="mb-10">
                <button onClick={() => player.previousTrack()}>
                  <Image
                    src="/images/svg/skip-back.svg"
                    alt="play"
                    width={30}
                    height={30}
                  />
                </button>

                {isPaused ? (
                  <button id="test" onClick={() => player.resume()}>
                    <Image
                      src="/images/svg/play.svg"
                      alt="play"
                      width={30}
                      height={30}
                    />
                  </button>
                ) : (
                  <button onClick={() => player.pause()}>
                    <Image
                      src="/images/svg/pause.svg"
                      alt="pause"
                      width={30}
                      height={30}
                    />
                  </button>
                )}

                <button onClick={() => player.nextTrack()}>
                  <Image
                    src="/images/svg/skip-forward.svg"
                    alt="next track"
                    width={30}
                    height={30}
                  />
                </button>
              </div>
            </div>
            <div className={styles.webPlayerItem}>playlsit info</div>
          </section>
        )}
    </section>
  );
};

export default SpotifyWebPlayer;
