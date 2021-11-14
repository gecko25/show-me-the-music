import type { NextApiRequest, NextApiResponse } from "next";
import { spotify, getClientAccessTokens } from "@utils/queries";
import { stringify } from "query-string";

// Types
import { EventsResults } from "../../../types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = await getClientAccessTokens();

  // const spotifyReponse = await spotify().get<EventsResults>("/events.json", {
  //   params: {
  //     ...req.query,
  //   },
  // });
  // console.log(`GET: ${req.url}?${stringify(req.query)}`);

  // console.log(
  //   `GET: ${spotifyReponse.config.baseURL}${
  //     spotifyReponse.config.url
  //   }?${stringify(spotifyReponse.config.params)}`
  // );

  // console.log(spotifyReponse.data);

  res.status(200).json({ success: true });
}
