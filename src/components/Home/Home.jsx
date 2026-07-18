import PropTypes from "prop-types";
import { useRef } from "react";
import { Link } from "react-router-dom";
import styles from "./Home.module.css";

import useMarqueeSpeed from "../../hooks/useMarqueeSpeed";
import Picture from "../Picture/Picture";

// CSS STYLES
const {
  hero,
  heroGlow,
  heroContent,
  badge,
  badgeDot,
  heroHeading,
  heroDesc,
  heroButtons,
  exploreBtn,
  marquee,
  marqueeTrack,
  marqueeCard,
  popupTrigger,
} = styles;

// MARQUEE IMAGES
// Existing project images (public/img/...). Swap any path below to change a
// card - the list is duplicated internally for a seamless infinite loop.
const marqueeImages = [
  "/img/hero/marquee-1.webp",
  "/img/hero/marquee-2.webp",
  "/img/hero/marquee-3.webp",
  "/img/hero/marquee-4.webp",
  "/img/hero/marquee-5.webp",
  "/img/hero/marquee-6.webp",
  "/img/hero/marquee-7.webp",
  "/img/hero/marquee-8.webp",
  "/img/hero/marquee-9.webp",
  "/img/hero/marquee-10.webp",
  "/img/hero/marquee-11.webp",
  "/img/hero/marquee-12.webp",
  "/img/hero/marquee-13.webp",
  "/img/hero/marquee-14.webp",
  "/img/hero/marquee-15.webp",
  "/img/hero/marquee-16.webp",
];

// Repeat the base images so a single loop half is wider than even ultra-wide
// screens; otherwise the short 4-image strip runs out and the marquee visibly
// "ends" with empty space on large displays.
const MARQUEE_REPEAT = 3;
const marqueeSet = Array.from(
  { length: MARQUEE_REPEAT },
  () => marqueeImages,
).flat();
// Duplicate the set once more for the seamless translateX(-50%) loop.
const marqueeCards = [...marqueeSet, ...marqueeSet];

const Home = ({ showTrigger, openPopup }) => {
  const marqueeRef = useRef(null);
  useMarqueeSpeed(marqueeRef, marqueeCards.length);

  return (
    <section className={hero}>
      <div className={heroGlow} aria-hidden="true" />

      <div className={heroContent}>
        <div className={badge}>
          <span className={badgeDot} />
          CLOUD SECURITY ALLIANCE • TULAS STUDENT CHAPTER
        </div>

        <h1 className={heroHeading}>TULAS CSA</h1>

        <p className={heroDesc}>
          A community of learners, innovators, and champions of our own success.
          Securing the cloud, one student at a time.
        </p>

        <div className={heroButtons}>
          <Link to="/events" className={exploreBtn}>
            Explore Events
          </Link>
          <Link to="/become-a-member" className={exploreBtn}>
            Become a Member
          </Link>
        </div>
      </div>

      {/* ANIMATED IMAGE MARQUEE - list duplicated for a seamless infinite loop */}
      <div className={marquee}>
        <div className={marqueeTrack} ref={marqueeRef}>
          {marqueeCards.map((src, index) => (
            <div className={marqueeCard} key={`${src}-${index}`}>
              <Picture
                loading="lazy"
                decoding="async"
                src={encodeURI(src)}
                alt=""
                aria-hidden="true"
                draggable="false"
              />
            </div>
          ))}
        </div>
      </div>

      {showTrigger && (
        <div className={popupTrigger} onClick={openPopup}>
          <img
            loading="lazy"
            decoding="async"
            src="/icons/annoucement.png"
            alt="annoucement"
          />
        </div>
      )}
    </section>
  );
};

Home.propTypes = {
  showTrigger: PropTypes.bool.isRequired,
  openPopup: PropTypes.func.isRequired,
};

export default Home;
