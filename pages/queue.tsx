import type { NextPage } from "next";
import { useContext } from "react";
import Link from "next/link";

/* Context */
import { PlayerContext } from "@context/PlayerContext";
import { ShowMeQueueObject } from "types";

/* Utils */
import { getDisplayDate, formatLocationSimple } from "@utils/helpers";

const Queue: NextPage = () => {
  const { queue, clearQueue } = useContext(PlayerContext);
  if (queue.length === 0) {
    return (
      <section>
        Your queue is empty, <Link href="/">return to the home page</Link> to
        browse more events.
      </section>
    );
  }

  const BtnStyles = {
    padding: "10px",
    fontSize: "1.5rem",
    border: "1px solid lightgray",
  };
  return (
    <section>
      <button style={BtnStyles} onClick={clearQueue}>
        Clear queue
      </button>
      {queue.map((q: ShowMeQueueObject) => (
        <div key={q.track.id} className="flex p-10 jc-space-btwn">
          <div>
            {q.track.name} by {q.track.artists[0].name}
          </div>
          <div className="ml-10">
            <span>{q.event.venue.displayName}</span>
            <span>
              &nbsp;&bull;&nbsp;{formatLocationSimple(q.event.location)}
            </span>
            <span>&nbsp;&bull;&nbsp;{getDisplayDate(q.event, false)}</span>
          </div>
        </div>
      ))}
    </section>
  );
};

export default Queue;
