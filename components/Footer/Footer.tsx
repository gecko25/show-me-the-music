import type { NextPage } from "next";
import React, { useContext } from "react";
import { ViewportContext } from "@context/ViewportContext";

/*Icons*/
import QueueIcon from "icons/QueueIcon";
import HomeIcon from "icons/HomeIcon";
import SearchIcon from "icons/SearchIcon";

const Footer: NextPage = () => {
  const { isDesktop } = useContext(ViewportContext);
  if (isDesktop) return null;
  return (
    <footer className="fixed bottom-0 left-0 right-0 flex w-screen bg-transparent justify-around p-2">
      <HomeIcon />
      <SearchIcon />
      <QueueIcon />
    </footer>
  );
};

export default Footer;
