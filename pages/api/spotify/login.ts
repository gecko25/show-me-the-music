import type { NextApiRequest, NextApiResponse } from "next";
import Cookies from "cookies";
import { AxiosError } from "axios";
import { stringify } from "query-string";

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
const generateRandomString = (length: number) => {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const cookies = new Cookies(req, res);
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Access-Control-Allow-Origin", "*");

  const state = generateRandomString(16);
  const referer = new URL(req.headers.referer || "");

  cookies.set("spotify_state", state);
  cookies.set("referer", referer.href);

  const scopes = [
    "streaming",
    "playlist-modify-private",
    "user-read-currently-playing",
    "user-modify-playback-state",
    "user-read-email",
    "user-read-private",
  ];

  try {
    console.log(`GET: ${req.url}?${stringify(req.query)}`);
    res.redirect(
      `https://accounts.spotify.com/authorize?${stringify({
        state,
        response_type: "code",
        client_id: process.env.SPOTIFY_CLIENT_ID,
        scope: scopes.join(" "), // https://developer.spotify.com/documentation/general/guides/authorization/scopes/
        redirect_uri: `${referer.origin}/api/spotify/callback`,
      })}`
    );

    console.log(`REDIRECT: ${res.getHeader("Location")}`);
  } catch (error: any) {
    console.error("did not redirect");
    // TODO: handleSpotifyError
    // const e = handleSongKickError(error);
    if (error.isAxiosError) {
      const axiosError: AxiosError = error;
      res
        .status(axiosError?.response?.status || 500)
        .json(axiosError.response?.data);
    } else {
      console.error("Could not authorize user", error);
      res.status(500).json(error);
    }
  }
}

// whitelist your redirect uris: https://developer.spotify.com/dashboard/applications/271210eee82047f0bca708e91a98e09f
