import { GetServerSidePropsContext } from "next";
import { useContext, useEffect, useState } from "react";
import { Moment } from "moment";
import get, { AxiosError } from "axios";

/* Utils */
import { handleSongKickError } from "@utils/errors";
import { isValidIpAddress } from "@utils/helpers";
import { defaultUnknownError } from "@utils/errors";

/* Hooks */
import { usePrevious } from "@hooks/index";

/* Components */
import { EventCard, DatePicker, LocationPicker } from "@components/index";

/* Context */
import { DateContext } from "@context/DateContext";
import { LocationContext } from "@context/LocationContext";

/* Types */
import { SongkickEventsResult, ShowMeError, SongkickEvent } from "../types";

type Props = {
  data: SongkickEventsResult;
  error: ShowMeError;
};

type Results = {
  data: SongkickEventsResult;
};

const Page = ({ data, error }: Props) => {
  const [results, setResults] = useState<SongkickEventsResult>(data);
  const [err, setError] = useState<ShowMeError | null>(error);
  const { date } = useContext(DateContext);
  const { location, setLocation, prevLocation } = useContext(LocationContext);
  const [loading, setLoading] = useState(false);

  const prevDate = usePrevious(date);

  useEffect(() => {
    setLocation({
      city: { displayName: data.resultsPage.results.event[0].location.city },
      metroArea: {
        displayName: data.resultsPage.results.event[0].location.city,
      },
    });
  }, [data, setLocation]);

  useEffect(() => {
    const searchEvents = async () => {
      setError(null);
      setLoading(true);
      try {
        const res: Results = await get("/api/songkick/events", {
          params: {
            location: location?.metroArea?.id,
            location_type: location?.metroArea?.id ? "sk" : null,
            min_date: date ? date.format("YYYY-MM-DD") : null,
            max_date: date ? date.format("YYYY-MM-DD") : null,
          },
        });
        if (res.data.resultsPage.totalEntries > 0) setResults(res.data);
        if (res.data.resultsPage.totalEntries === 0)
          setError({
            displayMessage:
              "There were no results for this search. Please try a new date or location",
          });
      } catch (error: any) {
        console.error("Error getting the events from location id");
        if (error?.isAxiosError) {
          console.error(error.response!.data);
          setError(error.response!.data);
        } else {
          console.error(error);
          setError(defaultUnknownError);
        }
      } finally {
        setLoading(false);
      }
    };
    if (date && prevDate.format("YYYY-DD-MM") !== date.format("YYYY-DD-MM")) {
      console.log(
        "Going to search events with new date",
        date?.format("YYYY-MM-DD")
      );
      searchEvents();
    }

    if (prevLocation && prevLocation?.metroArea.id !== location?.metroArea.id) {
      console.log("Going to search events for new location", location);
      searchEvents();
    }
  }, [date, prevDate, location, prevLocation]);

  return (
    <section>
      Show me Music on
      <DatePicker />
      in&nbsp;
      {/* TODO: Handle if location comes back empty set default to new york*/}
      <LocationPicker />
      {err && (
        <section className="mb-10" data-cy="error">
          {err.displayMessage}
        </section>
      )}
      {loading && <section>Loading...</section>}
      {!err && !loading && (
        <div className="site-content-container mt-10 flex fw-wrap jc-space-around ac-space-around">
          {results?.resultsPage?.results?.event?.map((evt: SongkickEvent) => (
            <EventCard evt={evt} key={evt.id} />
          ))}
        </div>
      )}
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
        location: isValidIpAddress(ip) ? ip : null,
        location_type: isValidIpAddress(ip) ? "ip" : null,
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
