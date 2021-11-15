import type { NextApiRequest, NextApiResponse } from "next";
import { spotify, getClientAccessTokens } from "@utils/queries";
import SpotifyTypes from "../../../types/spotify";
import { stringify } from "query-string";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SpotifyTypes.ArtistSearchResponse>
) {
  // TODO: Add this to cookies so we dont check this everytime
  const token = await getClientAccessTokens();

  const spotifyReponse = await spotify(
    token
  ).get<SpotifyTypes.ArtistSearchResponse>("/search", {
    params: {
      ...req.query,
      type: "artist",
      limit: 5,
    },
  });
  console.log(`GET: ${req.url}?${stringify(req.query)}`);

  console.log(
    `GET: ${spotifyReponse.config.baseURL}${
      spotifyReponse.config.url
    }?${stringify(spotifyReponse.config.params)}`
  );

  // TODO: Handle spotify errors
  res.status(200).json(spotifyReponse.data);
}
