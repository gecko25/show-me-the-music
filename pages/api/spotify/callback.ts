import type { NextApiRequest, NextApiResponse } from "next";
import axios, { AxiosError } from "axios";
import Cookies from "cookies";
import SpotifyTypes from "../../../types/spotify";
import { stringify } from "query-string";

// https://github.com/spotify/web-api-auth-examples/blob/master/authorization_code/app.js
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SpotifyTypes.ArtistSearchResponse>
) {
  // your application requests refresh and access tokens
  // after checking the state parameter
  const cookies = new Cookies(req, res);
  const code = req.query.code || null;
  const state = req.query.state || null;
  const storedState = req.cookies ? req.cookies.spotify_state : null;
  const referer = req.cookies.referer ? new URL(req.cookies.referer) : null;

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const token = new Buffer(`${clientId}:${clientSecret}`).toString("base64");

  if (referer === null) {
    res.redirect(
      "/#" +
        stringify({
          error: "rediect_pathname_undefined",
        })
    );
  } else if (state === null || state !== storedState) {
    res.redirect(
      `${referer.pathname}${referer.search}${referer.search ? "&" : "?"}&` +
        stringify({
          error: "state_mismatch",
        })
    );
  } else {
    console.log("Removing cookies...");
    cookies.set("referer");
    cookies.set("spotify_auth_state");

    const headers = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${token}`,
      },
    };

    const data = {
      grant_type: "authorization_code",
      code,
      redirect_uri: `${referer.origin}/api/spotify/callback`,
    };

    try {
      console.log("Going to get access tokens..");
      const response = await axios.post(
        "https://accounts.spotify.com/api/token",
        stringify(data),
        headers
      );

      console.log("Received tokens", response.data);
      console.log(
        `REDIRECTING BACK TO: ${referer.origin}${referer.pathname}${
          referer.search
        }${referer.search ? "&" : "?"}${stringify({
          access_token: response.data.access_token,
          refresh_token: response.data.refresh_token,
        })}`
      );

      res.redirect(
        `${referer.origin}${referer.pathname}${referer.search}${
          referer.search ? "&" : "?"
        }${stringify({
          access_token: response.data.access_token,
          refresh_token: response.data.refresh_token,
        })}`
      );
    } catch (error: any) {
      console.error("Unable to get tokens and redirect back to app");
      // TODO: handleSpotifyError
      // const e = handleSongKickError(error);
      if (error.isAxiosError) {
        const axiosError: AxiosError = error;
        console.log(axiosError.response?.data);
        res
          .status(axiosError?.response?.status || 500)
          .json(axiosError.response?.data);
      } else {
        console.error(error);
        res.status(500).json(error);
      }
    }
  }
}

// whitelist your redirect uris: https://developer.spotify.com/dashboard/applications/271210eee82047f0bca708e91a98e09f
