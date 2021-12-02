import React, { useState, useContext } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

/*Icons*/
import PlaylistAddCheck from "icons/PlaylistAddCheck";
import PlaylistAdd from "icons/PlaylistAdd";
import QueueIcon from "icons/Queue";

/* Context */
import { ViewportContext } from "@context/ViewportContext";

/* Components */
import { DatePicker, LocationPicker } from "@components/index";
import Queue from "pages/queue";

const Header = () => {
  const { isMobile } = useContext(ViewportContext);
  const router = useRouter();

  console.log("pathanne", router.pathname);

  return (
    <header className="flex justify-between pt-5 px-5">
      {router.pathname === "/" && (
        <div
          id="search-bar"
          className="flex flex-col md:flex-row md:items-center mb-2 text-secondary py-5 md:py-0 px-5"
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
      )}

      {router.pathname !== "/" && (
        <Link href="/" passHref>
          <span className="md:self-center cursor-pointer text-secondary font-bebas-regular text-4xl">
            Show me Music
          </span>
        </Link>
      )}

      <div className="text-secondary flex items-center">
        {router.pathname === "/event/[event_id]" && (
          <>
            <PlaylistAddCheck className="fill-current text-primary w-12 h-12" />
            <PlaylistAdd className="fill-current text-secondary w-12 h-12" />
          </>
        )}

        <QueueIcon className="fill-current text-secondary w-12 h-12" />
      </div>

      {/* TODO: Handle if location comes back empty set default to new york*/}
    </header>
  );
};

export default Header;
