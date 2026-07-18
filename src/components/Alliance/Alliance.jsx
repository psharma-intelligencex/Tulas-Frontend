import { useRef } from "react";
import styles from "./Alliance.module.css";

import useFetch from "../../hooks/useFetch";
import useMarqueeSpeed from "../../hooks/useMarqueeSpeed";
import Loading from "../Loading/Loading";

// CSS STYLES
const {
  allianceContainer,
  header,
  overline,
  heading,
  headingAccent,
  marquee,
  marqueeTrack,
  card,
  logoWrap,
  logo,
  name,
  stateMsg,
} = styles;

// Minimum cards per loop half - enough width to fill even large screens so the
// marquee stays seamless (never runs out) when only a few alliances exist.
const MIN_MARQUEE_CARDS = 12;

const Alliance = () => {
  const { data, error, loading } = useFetch({
    url: `${import.meta.env.VITE_SERVER_URL}/api/alliance/`,
  });

  const marqueeRef = useRef(null);

  const base = Array.isArray(data) ? data : [];
  // Repeat so a single set is wide enough, then duplicate it for a seamless
  // translateX(-50%) loop.
  const repeated =
    base.length > 0 && base.length < MIN_MARQUEE_CARDS
      ? Array.from(
          { length: Math.ceil(MIN_MARQUEE_CARDS / base.length) },
          () => base
        ).flat()
      : base;
  const marqueeItems = [...repeated, ...repeated];

  useMarqueeSpeed(marqueeRef, marqueeItems.length);

  return (
    <section className={allianceContainer} id="alliance">
      <div className={header}>
        
        <h2 className={heading}>
          Global <span className={headingAccent}>Alliance</span>
        </h2>
      </div>

      {loading ? (
        <Loading />
      ) : error || base.length === 0 ? (
        <p className={stateMsg}>No alliances to show right now.</p>
      ) : (
        <div className={marquee}>
          <div className={marqueeTrack} ref={marqueeRef}>
            {marqueeItems.map((item, index) => (
              <a
                key={`${item._id ?? item.allianceName}-${index}`}
                className={card}
                href={item.allianceWebsiteURL}
                target="_blank"
                rel="noreferrer"
                aria-label={item.allianceName}
              >
                <div className={logoWrap}>
                  <img
                    className={logo}
                    src={item.allianceImageURL}
                    alt={item.allianceName}
                    loading="lazy"
                  />
                </div>
                <span className={name}>{item.allianceName}</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default Alliance;
