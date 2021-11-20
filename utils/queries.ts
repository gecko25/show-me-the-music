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

export const lastfm = () => {
  return axios.create({
    baseURL: "http://ws.audioscrobbler.com/2.0",
    headers: {
      "Content-Type": "application/json",
    },
    params: {
      api_key: process.env.LAST_FM_KEY,
    },
  });
};
