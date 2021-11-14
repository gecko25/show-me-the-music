import type { NextApiRequest, NextApiResponse } from "next";
import { songkick } from "@utils/queries";
import { stringify } from "query-string";

// Types
import { EventsResults } from "../../../types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<EventsResults>
) {
  const songkickResponse = await songkick().get<EventsResults>("/events.json", {
    params: {
      ...req.query,
    },
  });
  console.log(`GET: ${req.url}?${stringify(req.query)}`);

  console.log(
    `GET: ${songkickResponse.config.baseURL}${
      songkickResponse.config.url
    }?${stringify(songkickResponse.config.params)}`
  );

  console.log(songkickResponse.data);

  res.status(200).json(songkickResponse.data);
}
