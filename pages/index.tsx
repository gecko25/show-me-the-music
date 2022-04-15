import { GetServerSidePropsContext } from "next";
import { useContext, useEffect } from "react";
import { useQuery } from "react-query";

/* Utils */
import { isValidIpAddress } from "@utils/helpers";
import { REACT_QUERY_CONFIG } from "@utils/constants";
import { getEvents } from "@utils/api";

/* Components */
import { EventCard, SearchBar } from "@components/index";

/*Icons*/
import QueueIcon from "icons/QueueIcon";

/* Context */
import { DateContext } from "@context/DateContext";
import { LocationContext } from "@context/LocationContext";
import { NavContext } from "@context/NavContext";

/* Types */
import { SongkickEvent, SongkickEventsResult, ShowMeError } from "../types";

const Page = () => {
  const { date } = useContext(DateContext);
  const { location, setLocation, prevLocation } = useContext(LocationContext);
  const { setNavIcons } = useContext(NavContext);

  const params = {
    location: location?.metroArea?.id,
    location_type: location?.metroArea?.id ? "sk" : null,
    min_date: date ? date.format("YYYY-MM-DD") : null,
    max_date: date ? date.format("YYYY-MM-DD") : null,
  };

  const { isLoading, isError, data, error } = useQuery<
    SongkickEventsResult | undefined,
    ShowMeError
  >(["songkick_events", params], () => getEvents(params), REACT_QUERY_CONFIG);

  useEffect(() => {
    setNavIcons([
      {
        icon: <QueueIcon />,
      },
    ]);
  }, [setNavIcons]);

  useEffect(() => {
    // If its the first time load, and theres no session storage
    if (!data || prevLocation || location) return;
    setLocation({
      city: {
        displayName: data?.resultsPage.results.event[0].location.city,
      },
      metroArea: {
        displayName: data?.resultsPage.results.event[0].location.city,
      },
    });
  }, [prevLocation, data, setLocation, location]);

  return (
    <>
      <SearchBar />
      {isError && (
        <section
          className="m-3 text-center lg:text-left lg:ml-10 text-secondary-light text-xl font-semibold font-monteserrat-semibold"
          data-cy="error"
        >
          <span
            dangerouslySetInnerHTML={{
              __html:
                error!.displayMessage ||
                "Something unxpected happened. Try again",
            }}
          />
        </section>
      )}
      {isLoading && (
        <section className="m-3 text-center font-monteserrat-light text-secondary text-xl">
          Loading...
        </section>
      )}
      {!isError && !isLoading && (
        <section className="px-5 flex flex-wrap justify-evenly content-around">
          {data?.resultsPage?.results?.event?.map((evt: SongkickEvent) => (
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
