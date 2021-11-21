import type { NextApiRequest, NextApiResponse } from "next";
import axios, { AxiosError } from "axios";
import { spotify, getClientAccessTokens } from "@utils/queries";
import SpotifyTypes from "types/spotify";
import { stringify } from "query-string";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SpotifyTypes.ArtistSearchResponse>
) {
  // TODO: Add this to cookies so we dont check this everytime

  try {
    const token = await getClientAccessTokens();
    const spotifyReponse = await spotify(
      token
    ).get<SpotifyTypes.ArtistSearchResponse>(
      `/artists/${req.query.artist_id}/top-tracks`,
      {
        params: {
          market: "US",
        },
      }
    );
    console.log(`GET: ${req.url}?${stringify(req.query)}`);

    console.log(
      `GET: ${spotifyReponse.config.baseURL}${
        spotifyReponse.config.url
      }?${stringify(spotifyReponse.config.params)}`
    );

    // TODO: Handle spotify errors
    res.status(200).json(spotifyReponse.data);
  } catch (error: any) {
    // TODO: handleSpotifyError
    // const e = handleSongKickError(error);
    if (error.isAxiosError) {
      const axiosError: AxiosError = error;
      console.error("Error getting spotify artist:", axiosError.response);
      res
        .status(axiosError?.response?.status || 500)
        .json(axiosError.response?.data);
    } else {
      console.error("Error getting spotify artist:", error);
      res.status(500).json(error);
    }
  }
}
