import Link from "next/link";
import styles from "./EventCard.module.scss";
import {
  SongkickEvent,
  SongkickArtist,
  UnknownSongkickArtist,
} from "../../types";
import moment from "moment";

type Props = {
  evt: SongkickEvent;
};

const EventCard = ({ evt }: Props) => {
  let headliner: SongkickArtist | UnknownSongkickArtist;
  let headlinerSlug: string = "";
  try {
    headliner = evt.performance.filter(
      (performer) => performer.billing === "headline"
    )[0].artist;
  } catch (error) {
    headliner = {
      displayName: evt.displayName,
    };
  }

  console.log("headkliner", headliner);

  const artistImageUri = headliner.id
    ? `https://images.sk-static.com/images/media/profile_images/artists/${headliner.id}/huge_avatar`
    : "";
  const day = moment(evt.start.date);
  const displayDay = day.format("ddd"); // Mon
  const displayDate = day.format("MMM DD"); // Aug 12
  const displayTime = evt.start.datetime
    ? moment(evt.start.datetime).format("h:mm a").toUpperCase()
    : null; // 7:00PM

  return (
    <Link href={`/event/${evt.id}?artist=${headliner.displayName}`} passHref>
      <div className="pos-relative">
        <div className={styles.EventCard} data-cy="event" key={evt.id}>
          <div className="fw-600 mb-10" data-cy="artist-name">
            {headliner.displayName}
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
