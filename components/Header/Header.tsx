import type { NextPage } from "next";

import React, { useState, useContext } from "react";
import NavbarWrapper from "@material-tailwind/react/NavbarWrapper";
import NavbarToggler from "@material-tailwind/react/NavbarToggler";
import NavbarCollapse from "@material-tailwind/react/NavbarCollapse";
import Nav from "@material-tailwind/react/Nav";
import NavItem from "@material-tailwind/react/NavItem";
import NavLink from "@material-tailwind/react/NavLink";
import Icon from "@material-tailwind/react/Icon";

/* Context */
import { ViewportContext } from "@context/ViewportContext";

/* Components */
import { DatePicker, LocationPicker } from "@components/index";

const Header = () => {
  const [openNavbar, setOpenNavbar] = useState(false);
  const { isMobile } = useContext(ViewportContext);

  return (
    <header className="flex flex-col md:flex-row md:items-center mb-2 text-gray-100 py-5 md:py-0 px-5">
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

      {/* TODO: Handle if location comes back empty set default to new york*/}
    </header>
  );
};

export default Header;
