import type { NextApiRequest, NextApiResponse } from "next";
import { AxiosError } from "axios";
import { songkick } from "@utils/queries";
import { handleSongKickError } from "@utils/errors";
import { stringify } from "query-string";

// Types
import { SongkickEventsResult, ShowMeError } from "../../../types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SongkickEventsResult | ShowMeError>
) {
  try {
    const songkickResponse = await songkick().get<
      SongkickEventsResult | ShowMeError
    >("/events.json", {
      params: {
        ...req.query,
        location: req.query.location ? `sk:${req.query.location}` : "clientip",
      },
    });
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
      res.status(axiosError?.response?.status || 500).json(e);
    } else {
      res.status(500).json(e);
    }
  }
}
