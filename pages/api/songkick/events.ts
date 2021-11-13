import type { NextApiRequest, NextApiResponse } from "next";

import { songkick } from "@utils/queries";

// // Types
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

  res.status(200).json(songkickResponse.data);
}
