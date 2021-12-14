import type { NextPage } from "next";
import React, { useContext } from "react";
import { ViewportContext } from "@context/ViewportContext";
import Link from "next/link";
import Image from "next/image";

/*Icons*/
import QueueIcon from "icons/QueueIcon";
import HomeIcon from "icons/HomeIcon";
import SearchIcon from "icons/SearchIcon";

const NavBar = ({ className }: { className: string }) => {
  const { isDesktop } = useContext(ViewportContext);
  if (isDesktop) {
    return (
      <nav
        id="NavBar"
        className={`${className} fixed top-0 left-0 h-screen bg-background border-r-2 border-background-light text-center`}
      >
        <Link href="/" passHref>
          <div className="mb-8 py-10 m-auto border-b-1 border-background-light">
            <Image
              src="/favicons/favicon-96x96.png"
              alt="Show me music Logo"
              width={86}
              height={86}
            />
            <div className="text-primary font-bebas-light tracking-widest text-sm ">
              Show Me the Music
            </div>
          </div>
        </Link>
        <div className="text-center">
          <Link href="/" passHref>
            <div className="flex items-center justify-center cursor-pointer mb-3 text-secondary font-monteserrat-semibold">
              <HomeIcon />
              <div className="pl-5">Home</div>
            </div>
          </Link>
          <Link href="/" passHref>
            <div className="flex items-center justify-center cursor-pointer mb-3 text-secondary font-monteserrat-semibold">
              <SearchIcon />
              <div className="pl-5">Search</div>
            </div>
          </Link>
          <Link href="/queue" passHref>
            <div className="flex items-center justify-center cursor-pointer mb-3  text-secondary font-monteserrat-semibold">
              <QueueIcon />
              <div className="pl-5">Queue</div>
            </div>
          </Link>
        </div>
      </nav>
    );
  }
  return (
    <nav className="fixed bottom-0 left-0 right-0 flex w-screen bg-background opacity-95 justify-around p-3 z-20">
      <HomeIcon />
      <SearchIcon />
      <QueueIcon />
    </nav>
  );
};

export default NavBar;
