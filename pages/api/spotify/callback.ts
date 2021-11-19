import type { NextApiRequest, NextApiResponse } from "next";
import axios, { AxiosError } from "axios";
import { spotify, getClientAccessTokens } from "@utils/queries";
import SpotifyTypes from "../../../types/spotify";
import { stringify } from "query-string";

// https://github.com/spotify/web-api-auth-examples/blob/master/authorization_code/app.js
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SpotifyTypes.ArtistSearchResponse>
) {
  // your application requests refresh and access tokens
  // after checking the state parameter

  console.log(`REDIRECTED: ${req.url}`);

  const code = req.query.code || null;
  const state = req.query.state || null;
  const storedState = req.cookies ? req.cookies.spotify_auth_state : null;

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const token = new Buffer(`${clientId}:${clientSecret}`).toString("base64");

  if (state === null || state !== storedState) {
    res.redirect(
      "/#" +
        stringify({
          error: "state_mismatch",
        })
    );
  } else {
    res.removeHeader("Set-Cookie"); // clear cookie
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
      redirect_uri: "http://localhost:3000/api/spotify/callback",
    };

    try {
      console.log("Going to get access tokens..");
      const response = await axios.post(
        "https://accounts.spotify.com/api/token",
        stringify(data),
        headers
      );

      console.log("Returning tokens 200", response.data);
      // res.redirect(`http://localhost:3000/playlist?${stringify({
      //   access_token: response.data.access_token,
      //   refresh_token: response.data.refresh_token,
      // })}`);

      res.status(200).json(response.data);
    } catch (error: any) {
      console.error("did not redirect");
      // TODO: handleSpotifyError
      // const e = handleSongKickError(error);
      if (error.isAxiosError) {
        const axiosError: AxiosError = error;
        console.log(axiosError.response?.data);
        res
          .status(axiosError?.response?.status || 500)
          .json(axiosError.response?.data);
      } else {
        console.error("Could not authorize user", error);
        res.status(500).json(error);
      }
    }
  }
}

// whitelist your redirect uris: https://developer.spotify.com/dashboard/applications/271210eee82047f0bca708e91a98e09f
