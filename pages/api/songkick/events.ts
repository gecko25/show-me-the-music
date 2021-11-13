import type { NextApiRequest, NextApiResponse } from "next";
import { stringify } from "query-string";
import { get } from "axios";

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

// // Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// import type { NextApiRequest, NextApiResponse } from "next";
// import { stringify } from "query-string";
// import { get } from "axios";

// import { songkick } from "@utils/queries";

// // Types
// import { EventsResults } from "../../../types";

// type Data = {
//   name: string;
// };

// export default function handler(req, res) {
//   req: NextApiRequest,
//   res: NextApiResponse<Data>
// ) => {
//   const songkickResponse = await songkick().get<EventsResults>("/events.json", {
//     params: {
//       ...req.query
//     },
//   });

//   console.log(
//     `GET: ${req.url}?${stringify(
//       req.query
//     )}`
//   );

//   console.log(
//     `GET: ${songkickResponse.config.baseURL}${songkickResponse.config.url}?${stringify(
//       songkickResponse.config.params
//     )}`
//   );

//   res.status(200).json(songkickResponse);
// };
