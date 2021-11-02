import { GetServerSidePropsContext } from "next";
import axios from "axios";
import { Event } from "../types";
import { stringify } from "query-string";

type EventsResults = {
  resultsPage: {
    clientLocation: {
      ip: string;
      lat: number;
      lng: number;
      metroAreaId: number;
    };
    page: number;
    perPage: number;
    results: {
      event: Event[];
    };
    status: string;
    totalEntries: number;
  };
};

type Props = {
  data: EventsResults;
};

const Page = ({ data }: Props) => {
  return (
    <section>
      {data.resultsPage.results.event.map((evt) => (
        <div key={evt.id}>{evt.displayName}</div>
      ))}
    </section>
  );
};

const songkick = () => {
  return axios.create({
    baseURL: "https://api.songkick.com/api/3.0",
    headers: {
      "Content-Type": "application/json",
    },
    params: {
      apikey: process.env.SONGKICK_KEY,
    },
  });
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const ip = context.req.headers.forwarded;
  console.log("Going to get events with user ip", ip);

  const res = await songkick().get<EventsResults>("/events.json", {
    params: {
      location: ip || "clientip",
    },
  });

  console.log(
    `Successfully made request to: ${res.config.baseURL}${
      res.config.url
    }?${stringify(res.config.params)}`
  );

  return {
    props: {
      data: res.data,
    },
  };
};

export default Page;

// References
// https://www.saltycrane.com/cheat-sheets/typescript/next.js/latest/
