/* eslint-disable @next/next/no-html-link-for-pages */
import { useEffect, useState, useContext } from "react";
import type { NextComponentType } from "next";
import { useRouter } from "next/router";
import Script from "next/script";
import Image from "next/image";

/* Types */
import SpotifyWebPlayerTypes from "types/spotify-web-player";

/* Context */
import { AuthContext } from "@context/AuthContext";

/* Hooks */
import useSpotifyWebPlayer from "@hooks/useSpotifyWebPlayer";

/*Styles*/
import styles from "./SpotifyWebPlayer.module.scss";

// This prevents the spotify from throwing an error
if (typeof window !== "undefined") {
  window.onSpotifyWebPlaybackSDKReady = () => {};
}

const SpotifyWebPlayer: NextComponentType = () => {
  const { accessToken, setAccessToken } = useContext(AuthContext);
  const router = useRouter();

  const {
    player,
    currentTrack,
    error,
  }: {
    player: SpotifyWebPlayerTypes.Player | undefined;
    currentTrack: SpotifyWebPlayerTypes.Track | undefined;
    error: string;
  } = useSpotifyWebPlayer(accessToken);

  useEffect(() => {
    if (router.query.access_token) {
      const access_token = router.query.access_token as string;
      setAccessToken(access_token);
    }
  }, [setAccessToken, router.query]);

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

      {accessToken && player && typeof window !== "undefined" && (
        <section className="flex fd-col ai-center h-100p jc-center">
          <div className="mb-10">
            <button onClick={() => player.togglePlay()}>Play</button>
            <button onClick={() => player.nextTrack()}>Next Track</button>
            <button onClick={() => player.pause()}>Pause</button>
            <button onClick={() => player.resume()}>Resume</button>
            <button onClick={() => player.previousTrack()}>Previous</button>
          </div>

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
        </section>
      )}
    </section>
  );
};

export default SpotifyWebPlayer;
