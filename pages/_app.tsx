import type { AppProps } from "next/app";
import Head from "next/head";
import React from "react";

/*Styles */
import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";
import "@styles/globals.scss";

/* Components */
import { Header, Footer, SpotifyWebPlayer } from "@components/index";

/* Styles */
import "@styles/globals.scss";
import "@styles/DatePicker.css";

/* Context */
import { DateContext, useDateContext } from "@context/DateContext";
import { ViewportContext, useViewportContext } from "@context/ViewportContext";
import { LocationContext, useLocationContext } from "@context/LocationContext";
import { AuthContext, useAuthContext } from "@context/AuthContext";

function MyApp({ Component, pageProps }: AppProps) {
  const date = useDateContext();
  const viewports = useViewportContext();
  const location = useLocationContext();
  const auth = useAuthContext();

  return (
    <ViewportContext.Provider value={viewports}>
      <DateContext.Provider value={date}>
        <LocationContext.Provider value={location}>
          <AuthContext.Provider value={auth}>
            <Head>
              <title>
                Show Me The Music | Explore Live Music Events | Preview concerts
                & create playlists
              </title>
              <meta
                name="description"
                content="Create a playlist of the bands and artists coming to your city. Listen those bands & artists to decide to see them live."
              />
              <meta
                name="viewport"
                content="width=device-width, initial-scale=1, shrink-to-fit=no"
              />
              <link rel="canonical" href="https://www.showmethemusic.co" />
              <meta name="robots" content="index, follow" />
              <meta
                name="keywords"
                content="Live music, concerts, playlists, create playlist, city, listen, spotify, bandsintown, bands, artists, genres"
              />

              <meta property="og:type" content="article" />
              <meta
                property="og:title"
                content="Curate a playlist of the bands and artists coming to your city."
              />
              <meta
                property="og:description"
                content="Explore live music events by genre, neighborhood, artist popularity, venue size. Listen those bands & artists to decide whether or not see them live."
              />
              <meta
                property="og:image"
                content="https://www.showmethemusic.co/images/tickets.png"
              />
              <meta property="og:url" content="/" />
              <meta property="og:site_name" content="Show Me the Music" />

              <link
                rel="apple-touch-icon"
                sizes="57x57"
                href="/favicons/apple-icon-57x57.png"
              />
              <link
                rel="apple-touch-icon"
                sizes="60x60"
                href="/favicons/apple-icon-60x60.png"
              />
              <link
                rel="apple-touch-icon"
                sizes="72x72"
                href="/favicons/apple-icon-72x72.png"
              />
              <link
                rel="apple-touch-icon"
                sizes="76x76"
                href="/favicons/apple-icon-76x76.png"
              />
              <link
                rel="apple-touch-icon"
                sizes="114x114"
                href="/favicons/apple-icon-114x114.png"
              />
              <link
                rel="apple-touch-icon"
                sizes="120x120"
                href="/favicons/apple-icon-120x120.png"
              />
              <link
                rel="apple-touch-icon"
                sizes="144x144"
                href="/favicons/apple-icon-144x144.png"
              />
              <link
                rel="apple-touch-icon"
                sizes="152x152"
                href="/favicons/apple-icon-152x152.png"
              />
              <link
                rel="apple-touch-icon"
                sizes="180x180"
                href="/favicons/apple-icon-180x180.png"
              />
              <link
                rel="icon"
                type="image/png"
                sizes="192x192"
                href="/favicons/android-icon-192x192.png"
              />
              <link
                rel="icon"
                type="image/png"
                sizes="32x32"
                href="/favicons/favicon-32x32.png"
              />
              <link
                rel="icon"
                type="image/png"
                sizes="96x96"
                href="/favicons/favicon-96x96.png"
              />
              <link
                rel="icon"
                type="image/png"
                sizes="16x16"
                href="/favicons/favicon-16x16.png"
              />
              <link rel="manifest" href="/manifest.json" />
              <meta name="msapplication-TileColor" content="#ffffff" />
              <meta
                name="msapplication-TileImage"
                content="/ms-icon-144x144.png"
              />
              <meta name="theme-color" content="#ffffff" />
            </Head>

            <Header />
            <main>
              <Component {...pageProps} />
            </main>
            <SpotifyWebPlayer />
            <Footer />
          </AuthContext.Provider>
        </LocationContext.Provider>
      </DateContext.Provider>
    </ViewportContext.Provider>
  );
}
export default MyApp;
