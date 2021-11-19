import type { NextApiRequest, NextApiResponse } from "next";
import { generateCookie } from "utils/server-helpers";
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
  const state = generateRandomString(16);
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Access-Control-Allow-Origin", "*");

  res.setHeader("Set-Cookie", generateCookie("spotify_auth_state", state));
  try {
    console.log(`GET: ${req.url}?${stringify(req.query)}`);
    res.redirect(
      `https://accounts.spotify.com/authorize?${stringify({
        state,
        response_type: "code",
        client_id: process.env.SPOTIFY_CLIENT_ID,
        scope:
          "streaming playlist-modify-private user-read-currently-playing user-modify-playback-state", // https://developer.spotify.com/documentation/general/guides/authorization/scopes/
        redirect_uri: "http://localhost:3000/api/spotify/callback",
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
