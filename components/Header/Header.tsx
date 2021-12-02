import React, { useState, useContext } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

/* Context */
import { ViewportContext } from "@context/ViewportContext";
import { NavContext } from "@context/NavContext";

/* Components */
import { DatePicker, LocationPicker } from "@components/index";

const Header = () => {
  const { icons } = useContext(NavContext);
  const router = useRouter();

  return (
    <header
      className={`flex items-center justify-between px-5 ${
        router.pathname !== "/"
          ? "border-b-2 border-background-light shadow-md rounded-md"
          : ""
      }`}
    >
      {router.pathname === "/" ? <SearchBar /> : <Home />}

      <div className="text-secondary flex items-center cursor-pointer">
        {icons.map((i) => (
          <div key={JSON.stringify(i.icon)}>{i.icon}</div>
        ))}
      </div>
    </header>
  );
};

const Home = () => {
  return (
    <Link href="/" passHref>
      <span className="md:self-center cursor-pointer text-secondary font-bebas-regular text-4xl">
        Show me Music
      </span>
    </Link>
  );
};

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

export default Header;
