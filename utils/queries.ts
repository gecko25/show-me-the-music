import axios, { AxiosError } from "axios";
import { stringify } from "query-string";

export const songkick = () => {
  return axios.create({
    baseURL: "https://api.songkick.com/api/3.0",
    headers: {
      "Content-Type": "application/json",
    },
    params: {
      apikey: process.env.SONGKICK_KEY,
    },
  });
};

export const spotify = (token: String) => {
  return axios.create({
    baseURL: "https://api.spotify.com/v1",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

// using with axios -> https://gist.github.com/donstefani/70ef1069d4eab7f2339359526563aab2
// using with normal spotify auth & base64 encodibng -> https://github.com/spotify/web-api-auth-examples/blob/master/client_credentials/app.js
export const getClientAccessTokens = async () => {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const token = new Buffer(`${clientId}:${clientSecret}`).toString("base64");

  const headers = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${token}`,
    },
  };
  const data = {
    grant_type: "client_credentials",
  };

  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      stringify(data),
      headers
    );

    console.log(
      `GET: ${response.config.baseURL}${response.config.url}?${stringify(
        response.config.params
      )}`
    );

    console.log(response.data.access_token);
    return response.data.access_token;
  } catch (error: AxiosError | any) {
    if (error.isAxiosError) {
      const axiosError: AxiosError = error;
      console.error("There was an error generating access tokens");

      console.log(
        `Failed request: ${axiosError.config.url}?${stringify(
          axiosError.config.params
        )}`
      );

      console.log(axiosError);
    } else {
      console.error("Unable to generate access tokens", error);
    }
  }
};
