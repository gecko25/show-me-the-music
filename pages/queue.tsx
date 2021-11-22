import type { NextPage } from "next";
import { useContext } from "react";

/* Context */
import { PlayerContext } from "@context/PlayerContext";
import { ShowMeQueueObject } from "types";

/* Utils */
import { getDisplayDate, formatLocationSimple } from "@utils/helpers";

const Queue: NextPage = () => {
  const { queue } = useContext(PlayerContext);
  return (
    <section>
      {queue.map((q: ShowMeQueueObject) => (
        <div key={q.track.id} className="flex p-10 jc-space-btwn">
          <div>
            {q.track.name} by {q.track.artists[0].name}
          </div>
          <div>
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
