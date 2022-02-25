import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";

/* Context */
import { DateContext } from "@context/DateContext";
import { ViewportContext } from "@context/ViewportContext";

/* Components */
import { DatePicker, LocationPicker } from "@components/index";

const SearchBar = () => {
  const { isMobile, isTablet } = useContext(ViewportContext);
  const { date } = useContext(DateContext);
  const [highlightLocation, setLocationHighlight] = useState(false);
  const [highlightDate, setDateHighlight] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      if (url === "/") {
        // toggle date highlight
        setDateHighlight(false);
        setTimeout(() => setDateHighlight(true));

        // toggle location highlight
        setLocationHighlight(false);
        setTimeout(() => setLocationHighlight(true));
      }
    };

    router.events.on("routeChangeStart", handleRouteChange);
    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [router.events, isMobile, isTablet]);

  useEffect(() => {
    setDateHighlight(false);
  }, [date]);

  return (
    <div
      id="search-bar"
      className="flex flex-col md:flex-row md:items-center mb-2 text-secondary py-5 px-5"
      onClick={() => setDateHighlight(false)}
    >
      <span
        className="md:self-center inline-block font-bebas-regular text-5xl"
        style={{ minWidth: isTablet ? "230px" : "auto" }}
      >
        Show me Music
      </span>
      <div
        className={`${highlightDate ? "SearchBar--highlight" : ""} relative`}
      >
        <DatePicker />
        {isMobile && (
          <span className="absolute left-[12rem] top-[3px] font-bebas-regular text-5xl">
            in&nbsp;&nbsp;
          </span>
        )}
        <Arrow show={highlightDate && isMobile} message="Pick a date" />
      </div>
      {!isMobile && (
        <span className="self-center text-center font-bebas-regular text-5xl">
          in&nbsp;&nbsp;
        </span>
      )}

      <div className="relative w-full">
        <LocationPicker
          highlightLocation={highlightLocation}
          clearHighlight={() => setLocationHighlight(false)}
        />
        <Arrow show={highlightLocation && isMobile} message="Pick a city" />
      </div>
    </div>
  );
};

const Arrow = ({ show, message }: { show: boolean; message: string }) => (
  <div
    className={`${
      show ? "animate-pulse-horiztonal opacity-100" : "opacity-0"
    } transition-opacity duration-500 absolute right-0 top-2 font-monteserrat-semibold text-primary text-lg`}
  >
    &larr; {message}
  </div>
);

export default SearchBar;
