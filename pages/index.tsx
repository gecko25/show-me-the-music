import { GetServerSidePropsContext } from "next";
import axios from "axios";
import { Event } from "../types";

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
  console.log(data.resultsPage.results);
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

  const res = await songkick().get<EventsResults>("/events.json", {
    params: {
      location: ip || "clientip",
    },
  });

  return {
    props: {
      data: res.data,
    },
  };
};

export default Page;

// References
// https://www.saltycrane.com/cheat-sheets/typescript/next.js/latest/
