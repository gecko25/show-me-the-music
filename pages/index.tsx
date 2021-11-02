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
  ip?: string;
  error: string;
};

const Page = ({ data, ip, error }: Props) => {
  console.log("ip", ip);

  if (error) {
    return <section>{error}</section>;
  }
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
  const localhostip = "::1";
  const ip = context.req.headers["x-forwarded-for"];

  try {
    const res = await songkick().get<EventsResults>("/events.json", {
      params: {
        location: ip === localhostip ? "clientip" : ip,
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
        ip,
      },
    };
  } catch (error) {
    console.error(error.message);
    console.log(
      `Failed request to: ${error.config.baseURL}${
        error.config.url
      }?${stringify(error.config.params)}`
    );
    return {
      props: {
        error: error.message,
        data: {},
        ip,
      },
    };
  }
};

export default Page;

// References
// https://www.saltycrane.com/cheat-sheets/typescript/next.js/latest/
