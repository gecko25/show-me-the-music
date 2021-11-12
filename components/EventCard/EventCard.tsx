import { Fragment } from "react";
import styles from "./EventCard.module.scss";
import { Event } from "../../types";
import moment from "moment";

type Props = {
  evt: Event;
};

const EventCard = ({ evt }: Props) => {
  const headliner = evt.performance.filter(
    (performer) => performer.billing === "headline"
  )[0].artist;
  const artistImageUri = `https://images.sk-static.com/images/media/profile_images/artists/${headliner.id}/huge_avatar`;
  const start = moment(evt.start.datetime);
  const displayDay = start.format("ddd"); // Mon
  const displayDate = start.format("MMM DD"); // Aug 12
  const displayTime = start.format("h:mm a").toUpperCase(); // 7:00PM

  return (
    <div className="pos-relative">
      <div className={styles.EventCard} data-cypress="event" key={evt.id}>
        <div>{headliner.displayName}</div>
        <div>{evt.venue.displayName}</div>
        <div>
          {displayDay}&nbsp;{displayDate} @
        </div>
        <div>{displayTime}</div>
      </div>
      <div
        className={styles.EventCard__BgImgContainer}
        style={{ backgroundImage: `url(${artistImageUri})` }}
      />
    </div>
  );
};

export default EventCard;
