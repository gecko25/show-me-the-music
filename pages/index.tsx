import { GetServerSidePropsContext } from "next";
import { useContext, useEffect } from "react";
import { useQuery } from "react-query";
import Image from "next/image";

/* Utils */
import { isValidIpAddress } from "@utils/helpers";
import { REACT_QUERY_CONFIG, DEFAULT_ERROR } from "@utils/constants";
import { getEvents } from "@utils/api";

/* Components */
import { EventCard, SearchBar } from "@components/index";

/*Icons*/
import QueueIcon from "icons/QueueIcon";

/* Context */
import { DateContext } from "@context/DateContext";
import { LocationContext } from "@context/LocationContext";
import { NavContext } from "@context/NavContext";
import { ViewportContext } from "@context/ViewportContext";

/* Types */
import { SongkickEvent, SongkickEventsResult, ShowMeError } from "../types";

const Page = () => {
  const { date } = useContext(DateContext);
  const { isMobile } = useContext(ViewportContext);
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
          className="m-10 text-center lg:text-left lg:ml-7 text-primary text-xl font-semibold font-monteserrat-semibold"
          data-cy="error"
        >
          {error!.message === "Disabled API" ? (
            <div>
              Sigh. 🥺
              <br />
              <br /> For unexpected and unanticipated reasons as of April 16
              2022, SongKick has revoked my API key.
              <br />
              <br /> Unfortunately this app is worthless without that API key.
              <br /> I comply with all their terms of use and I have written to
              them, but they will not reinstate it or tell me why it was
              revoked&mdash; just that they are &apos;&apos;not in a position to
              renew my key&apos;&apos;.
              <br />
              <br />I have been hacking on this project for over 7 years as a
              passion project and have rewritten it over and over as a way to
              continue my learning as a developer&mdash;first version of this
              was Angular 1!
              <br />
              <br />I am completely devastated by this.
              <br />
              <br /> Unless they change their minds, this site will no longer
              work.
              <br /> Below is gif of what it used to do.
              <br />
              <br /> 😞
              <br /> RIP
              <span className="block my-5" />
              <Image
                src="/images/app_demo.gif"
                alt="App Demo"
                width={isMobile ? "300" : "700"}
                height={isMobile ? "250" : "500"}
              />
            </div>
          ) : (
            <span
              dangerouslySetInnerHTML={{
                __html:
                  error!.message || "Something unexpected happened. Try again",
              }}
            />
          )}
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

      {isMobile && (
        <div className="text-right p-4">
          <Image
            className=""
            src="/images/svg/powered-by-songkick-white.svg"
            alt="Powered by Songkick Logo"
            width={86}
            height={30}
          />
        </div>
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
