import { GetServerSidePropsContext } from "next";
import { useContext, useEffect, useState } from "react";
import { Moment } from "moment";
import get from "axios";

/* Utils */
import { handleSongKickError } from "@utils/errors";
import { isValidIpAddress } from "@utils/helpers";
import { useEffectDebugger, usePrevious } from "@hooks/index";
/* Components */
import { EventCard, DatePicker } from "@components/index";

/* Context */
import { DateContext } from "@context/DateContext";

/* Types */
import { EventsResults, ShowMeError } from "../types";

type Props = {
  data: EventsResults;
  error: ShowMeError;
};

const Page = ({ data, error }: Props) => {
  const [results, setResults] = useState<EventsResults>(data);
  const [err, setError] = useState<ShowMeError>(error);
  const { date } = useContext(DateContext);
  // const { location } = useContext(LocationContext);

  const prevDate = usePrevious(date);

  useEffect(() => {
    const getEventsFromDate = async (date: Moment) => {
      try {
        const res = await get("/api/songkick/events", {
          params: {
            location: "clientip",
            min_date: date.format("YYYY-MM-DD"),
            max_date: date.format("YYYY-MM-DD"),
          },
        });
        setResults(res.data);
      } catch (error) {
        setError(handleSongKickError(error));
      }
    };

    if (date && prevDate.format("YYYY-DD-MM") !== date.format("YYYY-DD-MM")) {
      getEventsFromDate(date);
    }
  }, [prevDate, date]);

  if (err) {
    console.error(err);
    return <section data-cy="error">{err.displayMessage}</section>;
  }
  return (
    <section>
      Show me Music on
      <DatePicker />
      in&nbsp;
      {results.resultsPage.results.event[0].location.city}
      <div className="site-content-container flex fw-wrap jc-space-around ac-space-around">
        {results.resultsPage.results.event.map((evt) => (
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
  const host = context.req.headers.host || "";
  const protocol = host?.indexOf("localhost") >= 0 ? "http" : "https";

  console.log(
    `Loading landing page in getServerSideProps: ${protocol}://${host}/api/songkick/events`
  );

  try {
    const res = await get(`${protocol}://${host}/api/songkick/events`, {
      params: {
        location: isValidIpAddress(ip) ? `ip:${ip}` : "clientip",
      },
    });

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
