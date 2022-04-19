import type { NextPage } from "next";
import { useContext } from "react";
import Link from "next/link";
import Image from "next/image";

/* Context */
import { PlayerContext } from "@context/PlayerContext";
import { ViewportContext } from "@context/ViewportContext";

import { ShowMeQueueObject } from "types";

/* Utils */
import { getDisplayDate, formatLocationSimple } from "@utils/helpers";

const Queue: NextPage = () => {
  const { isMobile } = useContext(ViewportContext);
  const { queue, clearQueue } = useContext(PlayerContext);
  if (queue.length === 0) {
    return (
      <section className="p-3 text-secondary font-monteserrat-light">
        <h1 className="text-4xl font-monteserrat-semibold mb-3 text-secondary">
          Queue
        </h1>
        Your queue is empty, <Link href="/">return to the home page</Link> to
        browse more events.
      </section>
    );
  }

  return (
    <section className="site-content-container">
      <div className="flex justify-between items-center my-3">
        <h1 className="text-4xl font-monteserrat-semibold mb-3 text-secondary">
          Queue
        </h1>
        <button
          className="font-bebas-bold text-secondary rounded-md bg-background-light text-xl h-9 px-4"
          onClick={clearQueue}
        >
          Clear queue
        </button>
      </div>

      {queue.map((q: ShowMeQueueObject) => (
        <div key={q.track.id} className="text-secondary">
          <div className="font-monteserrat-semibold text-primary text-xl">
            {q.track.name} by {q.track.artists[0].name}
          </div>
          <div className="font-bebas-light tracking-wide text-lg">
            <span>{q.event.venue.displayName}</span>
            <span>
              &nbsp;&bull;&nbsp;{formatLocationSimple(q.event.location)}
            </span>
            <span>&nbsp;&bull;&nbsp;{getDisplayDate(q.event, false)}</span>
          </div>
        </div>
      ))}

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
    </section>
  );
};

export default Queue;
