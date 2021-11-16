import type { NextApiRequest, NextApiResponse } from "next";
import { AxiosError } from "axios";
import { songkick } from "@utils/queries";
import { handleSongKickError } from "@utils/errors";
import { stringify } from "query-string";

// Types
import { LocationSearchResult, ShowMeError } from "../../../types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LocationSearchResult | ShowMeError>
) {
  try {
    const songkickResponse = await songkick().get<
      LocationSearchResult | ShowMeError
    >("/search/locations.json", {
      params: {
        ...req.query,
      },
    });

    console.log(`GET: ${req.url}`);

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
