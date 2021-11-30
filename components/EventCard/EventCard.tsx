import Link from "next/link";
import moment from "moment";

/* Utils */
import { getHeadliners } from "@utils/helpers";

/* Styles */
import styles from "./EventCard.module.scss";

/* Types */
import { SongkickEvent, SongkickArtist, UnknownSongkickArtist } from "types";
type Props = {
  evt: SongkickEvent;
};

const EventCard = ({ evt }: Props) => {
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
      <div className="relative">
        <div className={styles.EventCard} data-cy="event" key={evt.id}>
          <div className="font-semibold mb-3" data-cy="artist-name">
            {headliners.map((h) => (
              <div key={h.id}>{h.displayName}</div>
            ))}
          </div>
          <div>{evt.venue.displayName}</div>
          <div>
            {displayDay}&nbsp;{displayDate} {displayTime && "@"}
          </div>
          <div>{displayTime}</div>
        </div>
        <div
          className={styles.EventCard__BgImgContainer}
          style={{ backgroundImage: `url(${artistImageUri})` }}
        />
      </div>
    </Link>
  );
};

export default EventCard;
