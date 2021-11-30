import type { NextPage } from "next";

import React, { useState } from "react";
import Navbar from "@material-tailwind/react/Navbar";
import NavbarContainer from "@material-tailwind/react/NavbarContainer";
import NavbarWrapper from "@material-tailwind/react/NavbarWrapper";
import NavbarToggler from "@material-tailwind/react/NavbarToggler";
import NavbarCollapse from "@material-tailwind/react/NavbarCollapse";
import Nav from "@material-tailwind/react/Nav";
import NavItem from "@material-tailwind/react/NavItem";
import NavLink from "@material-tailwind/react/NavLink";
import Icon from "@material-tailwind/react/Icon";

/* Components */
import { DatePicker, LocationPicker } from "@components/index";

const Header = () => {
  const [openNavbar, setOpenNavbar] = useState(false);

  return (
    <nav className="flex flex-wrap items-center justify-between py-2.5 px-3 false bg-teal-900">
      <NavbarContainer>
        <NavbarWrapper>
          <header className="flex items-center mb-5">
            <span className="self-center text-center font-bebas-regular">
              Show me Music
            </span>
            <DatePicker />
            <LocationPicker />

            {/* TODO: Handle if location comes back empty set default to new york*/}
          </header>
          <NavbarToggler
            color="white"
            onClick={() => setOpenNavbar(!openNavbar)}
            ripple="light"
          />
        </NavbarWrapper>

        <NavbarCollapse open={openNavbar}>
          <Nav>
            <NavItem ripple="light">
              <Icon name="queue_music" size="400px" />
              Music Queue
            </NavItem>
            <NavLink href="#navbar" ripple="light">
              <Icon name="account_circle" size="xl" />
            </NavLink>
          </Nav>
        </NavbarCollapse>
      </NavbarContainer>
    </nav>
  );
};

export default Header;
