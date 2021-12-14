import type { NextPage } from "next";
import React, { useContext } from "react";
import { ViewportContext } from "@context/ViewportContext";

/* Components */
import { DatePicker, LocationPicker } from "@components/index";

const SearchBar = () => {
  const { isMobile } = useContext(ViewportContext);
  return (
    <div
      id="search-bar"
      className="flex flex-col md:flex-row md:items-center mb-2 text-secondary py-5 px-5"
    >
      <span className="md:self-center font-bebas-regular text-5xl">
        Show me Music
      </span>
      <DatePicker />
      {!isMobile && (
        <span className="self-center text-center font-bebas-regular text-5xl">
          in&nbsp;&nbsp;
        </span>
      )}

      <LocationPicker />
    </div>
  );
};

export default SearchBar;
