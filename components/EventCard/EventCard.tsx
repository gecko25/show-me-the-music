import { Fragment } from "react";
import styles from "./EventCard.module.scss";
import { Event } from "../../types";

type Props = {
  evt: Event;
};

const EventCard = ({ evt }: Props) => {
  const headliner = evt.performance.filter(
    (performer) => performer.billing === "headline"
  )[0].artist;
  const artistImageUri = `https://images.sk-static.com/images/media/profile_images/artists/${headliner.id}/huge_avatar`;

  return (
    <div className="pos-relative">
      <div className={styles.EventCard} data-cypress="event" key={evt.id}>
        <div>{headliner.displayName}</div>
        <div>{evt.venue.displayName}</div>
        <div>{evt.start.date} @</div>
        <div>{evt.start.time}</div>
      </div>
      <div
        className={styles.EventCard__BgImgContainer}
        style={{ backgroundImage: `url(${artistImageUri})` }}
      />
    </div>
  );
};

export default EventCard;
