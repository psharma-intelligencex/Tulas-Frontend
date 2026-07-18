import { useState, useEffect } from "react";
import styles from "./EventsPage.module.css";

import PageHeading from "../../components/PageHeading/PageHeading";
import EventYearSwitch from "../../components/EventYearSwitch/EventYearSwitch";

// CSS STYLES
const {
  eventsPageContainer,
  eventsPageDiv,
  intro,
  eventGrid,
  card,
  cardImg,
  cardScrim,
  cardBody,
  cardTitle,
  stateMsg,
} = styles;

// STATIC EVENTS DATA
const EVENTS = {
  2026: [
    // {
    //   eventName: "Ethical Hacking",
    //   imageURL: "/events/ethicalhacking.jpeg",
    // },
    {
      eventName: "",
      imageURL: "/events/IMG_0035.JPG",
    },
    
    {
      eventName: "",
      imageURL: "/events/IMG_0074.JPG",
    },
    {
      eventName: "",
      imageURL: "/events/IMG_0002.JPG",
    },
    
    {
      eventName: "",
      imageURL: "/events/IMG_0042.JPG",
    },
    {
      eventName: "",
      imageURL: "/events/IMG_0004.JPG",
    },
    {
      eventName: "",
      imageURL: "/events/IMG_0146.JPG",
    },
    {
      eventName: "",
      imageURL: "/events/IMG_0135.JPG",
    },
    {
      eventName: "",
      imageURL: "/events/IMG_0050.JPG",
    },
    
    
  ],

  

  
};

const EventsPage = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const [activeYear, setActiveYear] = useState(2026);

  const yearData = [2026];

  const changeYear = (year) => {
    setActiveYear(year);
  };

  const events = EVENTS[activeYear] || [];

  return (
    <div className={eventsPageContainer}>
      <PageHeading imgURL="/img/hero/hero-bg.jpg" text="EVENTS" />

      <div className={eventsPageDiv}>
        <p className={intro}>
          Explore the vibrant world of the{" "}
          <span className="highlight">
            <b>CSA Tula&apos;s University Student Chapter</b>
          </span>
          , where innovation meets opportunity. From cybersecurity workshops
          and expert talks to hackathons, capture-the-flag (CTF) challenges,
          and technical sessions, every event is designed to empower students
          with practical skills and real-world knowledge. Join a thriving
          community of learners, innovators, and future cybersecurity
          professionals as you collaborate, compete, and grow together.
        </p>

        <EventYearSwitch
          yearData={yearData}
          activeYear={activeYear}
          changeYear={changeYear}
        />

        {events.length === 0 ? (
          <p className={stateMsg}>No events found for {activeYear}.</p>
        ) : (
          <div className={eventGrid}>
            {events.map((event, index) => (
              <div className={card} key={index}>
                <img
                  className={cardImg}
                  src={event.imageURL}
                  alt={event.eventName}
                  loading="lazy"
                  decoding="async"
                />

                <div className={cardScrim} aria-hidden="true" />

                <div className={cardBody}>
                  <h2 className={cardTitle}>{event.eventName}</h2>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsPage;