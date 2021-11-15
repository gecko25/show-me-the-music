import type { NextApiRequest, NextApiResponse } from "next";
import { songkick } from "@utils/queries";
import { stringify } from "query-string";
import { handleSongKickError } from "@utils/errors";
import { AxiosError } from "axios";

// Types
import { SongkickEventResult, ShowMeError } from "../../../types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SongkickEventResult | ShowMeError>
) {
  try {
    const songkickResponse = await songkick().get<SongkickEventResult>(
      `/events/${req.query.event_id}.json`,
      {
        params: {
          ...req.query,
        },
      }
    );
    console.log(`GET: ${req.url}?${stringify(req.query)}`);

    console.log(
      `GET: ${songkickResponse.config.baseURL}${
        songkickResponse.config.url
      }?${stringify(songkickResponse.config.params)}`
    );

    res.status(200).json(songkickResponse.data);
  } catch (error: any) {
    const e = handleSongKickError(error);
    if (error.isAxiosError) {
      const axiosError: AxiosError = error;
      res.status(500).json(e);
    } else {
      res.status(500).json(e);
    }
  }
}
