import { Link } from "react-router-dom";
import styles from "./HomeEvents.module.css";

// CSS STYLES
const {
  eventsSection,
  eventsInner,
  header,
  overline,
  heading,
  eventsGrid,
  card,
  cardImg,
  cardScrim,
  cardBody,
  cardTitle,
  dateLabel,
  exploreWrap,
  exploreBtn,
} = styles;

// STATIC EVENTS
const events = [
  {
    eventName: "MoU Singing",
    eventYear: "2026",
    imageURL: "/events/IMG_0143.JPG",
  },
  {
    eventName: "Ethical HAcking",
    eventYear: "2026",
    imageURL: "/events/ethicalhacking.jpeg",
  },
];

const HomeEvents = () => {
  return (
    <section className={eventsSection} id="events">
      <div className={eventsInner}>
        <div className={header}>
          <p className={overline}>Upcoming &amp; Past Ventures</p>
          <h2 className={heading}>Signature Events</h2>
        </div>

        <div className={eventsGrid}>
          {events.map((event, index) => (
            <Link
              key={index}
              className={card}
              to="/events"
              aria-label={event.eventName}
            >
              <img
                className={cardImg}
                src={event.imageURL}
                alt={event.eventName}
                loading="lazy"
                decoding="async"
              />

              <div className={cardScrim} aria-hidden="true" />

              <div className={cardBody}>
                <h3 className={cardTitle}>{event.eventName}</h3>

                <span className={dateLabel}>{event.eventYear}</span>
              </div>
            </Link>
          ))}
        </div>

        {/* <div className={exploreWrap}>
          <Link className={exploreBtn} to="/events">
            Explore All Events
          </Link>
        </div> */}
      </div>
    </section>
  );
};

export default HomeEvents;