import { GetServerSidePropsContext } from "next";
import { useContext, useEffect, useState } from "react";
import get from "axios";

/* Utils */
import { isValidIpAddress } from "@utils/helpers";
import { defaultUnknownError } from "@utils/errors";

/* Hooks */
import { usePrevious } from "@hooks/index";

/* Components */
import { EventCard } from "@components/index";

/*Icons*/
import QueueIcon from "icons/QueueIcon";

/* Context */
import { DateContext } from "@context/DateContext";
import { LocationContext } from "@context/LocationContext";
import { NavContext } from "@context/NavContext";

/* Types */
import { SongkickEventsResult, ShowMeError, SongkickEvent } from "../types";

type Results = {
  data: SongkickEventsResult;
};

const Page = () => {
  const [results, setResults] = useState<SongkickEventsResult>();
  const [err, setError] = useState<ShowMeError | null>();
  const [loading, setLoading] = useState(false);

  const { date } = useContext(DateContext);
  const { location, setLocation, prevLocation } = useContext(LocationContext);
  const { setNavIcons } = useContext(NavContext);

  const prevDate = usePrevious(date, null);

  useEffect(() => {
    setNavIcons([
      {
        icon: <QueueIcon />,
      },
    ]);
  }, [setNavIcons]);

  useEffect(() => {
    // If its the first time load, and theres no session storage
    if (!results || prevLocation || location) return;
    setLocation({
      city: {
        displayName: results?.resultsPage.results.event[0].location.city,
      },
      metroArea: {
        displayName: results?.resultsPage.results.event[0].location.city,
      },
    });
  }, [prevLocation, results, setLocation, location]);

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
              "There were no results for this search. </br> Please try a new date or location.",
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

    if (!prevDate) {
      console.log(
        "Going to search events on inital page load",
        date?.format("YYYY-MM-DD")
      );
      searchEvents();
    }

    if (
      date &&
      prevDate &&
      prevDate.format("YYYY-DD-MM") !== date.format("YYYY-DD-MM")
    ) {
      console.log(
        "Going to search events with new date",
        date?.format("YYYY-MM-DD")
      );
      searchEvents();
    }

    if (
      prevLocation &&
      prevLocation?.metroArea?.id !== location?.metroArea?.id
    ) {
      console.log("Going to search events for new location", location);
      searchEvents();
    }
  }, [date, prevDate, location, prevLocation]);

  return (
    <>
      {err && (
        <section
          className="m-3 text-center text-primary text-xl font-semibold font-monteserrat-semibold"
          data-cy="error"
        >
          <span dangerouslySetInnerHTML={{ __html: err.displayMessage }} />
        </section>
      )}
      {loading && (
        <section className="m-3 text-center font-monteserrat-light text-secondary text-xl">
          Loading...
        </section>
      )}
      {!err && !loading && (
        <section className="px-5 flex flex-wrap justify-between content-around">
          {results?.resultsPage?.results?.event?.map((evt: SongkickEvent) => (
            <EventCard evt={evt} key={evt.id} />
          ))}
        </section>
      )}
    </>
  );
};

export const getServerSideProps = (context: GetServerSidePropsContext) => {
  const ip = context.req.headers["x-forwarded-for"];

  return {
    props: {
      ip: isValidIpAddress(ip) ? ip : null,
    },
  };
};

export default Page;
