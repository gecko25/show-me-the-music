import Link from "next/link";
import moment from "moment";
import { useState, useContext } from "react";

/* Context */
import { ViewportContext } from "@context/ViewportContext";

/* Utils */
import { getHeadliners } from "@utils/helpers";

/* Types */
import { SongkickEvent, SongkickArtist, UnknownSongkickArtist } from "types";
type Props = {
  evt: SongkickEvent;
};

const EventCard = ({ evt }: Props) => {
  const [opacity, setOpacity] = useState(0.2);
  const { isMobile } = useContext(ViewportContext);

  let headlinerSlug: string = "";
  const headliners: SongkickArtist[] | UnknownSongkickArtist[] =
    getHeadliners(evt);

  const artistImageUri = headliners[0]?.id
    ? `https://images.sk-static.com/images/media/profile_images/artists/${headliners[0].id}/huge_avatar`
    : "";
  const day = moment(evt.start.date);
  const displayDay = day.format("ddd"); // Mon
  const displayDate = day.format("MMM DD"); // Aug 12
  const displayTime = evt.start.datetime
    ? moment(evt.start.datetime).format("h:mm a").toUpperCase()
    : null; // 7:00PM

  return (
    <Link
      href={`/event/${evt.id}?artist=${headliners[0]?.displayName}`}
      passHref
    >
      <div
        className="relative w-full md:w-1/3 lg:w-1/4"
        onMouseEnter={() => setOpacity(100)}
        onMouseLeave={() => setOpacity(0.2)}
      >
        <div
          id="event-card"
          className="text-secondary h-48 md:h-60 flex flex-col align-center justify-center cursor-pointer shadow-2xl mx-3 mb-5 px-4 rounded-md"
          data-cy="event"
          key={evt.id}
        >
          <div
            className="font-bebas-bold text-4xl mb-3 z-10"
            style={{
              maxHeight: isMobile ? "2.1em" : "3.1em",
              overflow: "hidden",
            }}
            data-cy="artist-name"
          >
            {headliners.map((h) => (
              <div key={h.id}>{h.displayName}</div>
            ))}
          </div>
          <div className="font-bebas-regular text-xl">
            <div>{evt.venue.displayName}</div>
            <div>
              {displayDay}&nbsp;{displayDate} {displayTime && "@"}
            </div>
            <div>{displayTime}</div>
          </div>
        </div>
        <div
          id="EventCard__Img"
          className="absolute top-0 left-3 right-3 bottom-5 bg-cover bg-background-light transition-all duration-1000 hover:opacity-100 transform scale-100 z-0 cursor-pointer rounded-md"
          style={{ opacity, backgroundImage: `url(${artistImageUri})` }}
        />
      </div>
    </Link>
  );
};

export default EventCard;
