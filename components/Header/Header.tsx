import React, { useState, useContext } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

/* Context */
import { ViewportContext } from "@context/ViewportContext";
import { NavContext } from "@context/NavContext";

const Header = () => {
  const { icons } = useContext(NavContext);
  const router = useRouter();

  return <header></header>;
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

export default Header;
