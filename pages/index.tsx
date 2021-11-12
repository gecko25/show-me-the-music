import { GetServerSidePropsContext } from "next";
import { stringify } from "query-string";
import { songkick } from "@utils/queries";
import { handleSongKickError } from "@utils/errors";
import { isValidIpAddress } from "@utils/helpers";

import { EventCard, DatePicker } from "@components/index";

import { EventsResults, ShowMeError } from "../types";

type Props = {
  data: EventsResults;
  error: ShowMeError;
};

const Page = ({ data, error }: Props) => {
  if (error) {
    console.error(error);
    return <section data-cypress="error">{error.displayMessage}</section>;
  }
  return (
    <section>
      Show me Music on
      <DatePicker />
      in&nbsp;
      {data.resultsPage.results.event[0].location.city}
      <div className="site-content-container flex fw-wrap jc-space-around ac-space-around">
        {data.resultsPage.results.event.map((evt) => (
          <EventCard evt={evt} key={evt.id} />
        ))}
      </div>
    </section>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const ip = context.req.headers["x-forwarded-for"];

  try {
    const res = await songkick().get<EventsResults>("/events.json", {
      params: {
        location: isValidIpAddress(ip) ? `ip:${ip}` : "clientip",
      },
    });

    console.log(
      `GET: ${res.config.baseURL}${res.config.url}?${stringify(
        res.config.params
      )}`
    );

    return {
      props: {
        data: res.data,
      },
    };
  } catch (error) {
    return {
      props: {
        error: handleSongKickError(error),
        data: {},
      },
    };
  }
};

export default Page;

// References
// https://www.saltycrane.com/cheat-sheets/typescript/next.js/latest/
