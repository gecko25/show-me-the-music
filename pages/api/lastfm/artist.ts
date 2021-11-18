import type { NextApiRequest, NextApiResponse } from "next";
import { lastfm } from "@utils/queries";
import { stringify } from "query-string";
import { AxiosError } from "axios";

// Types

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const lastFmRes = await lastfm().get("/", {
      params: {
        ...req.query,
      },
    });
    console.log(`GET: ${req.url}?${stringify(req.query)}`);

    console.log(
      `GET: ${lastFmRes.config.baseURL}${lastFmRes.config.url}?${stringify(
        lastFmRes.config.params
      )}`
    );

    res.status(200).json(lastFmRes.data);
  } catch (error: any) {
    if (error.isAxiosError) {
      const axiosError: AxiosError = error;
      console.log(
        `Failed request: ${axiosError.config.baseURL}${
          axiosError.config.url
        }?${stringify(axiosError.config.params)}`
      );
      res
        .status(axiosError?.response?.status || 500)
        .json(axiosError.response?.data);
    } else {
      res.status(500).json(error);
    }
  }
}
