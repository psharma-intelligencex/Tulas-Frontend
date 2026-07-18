import Proptypes from "prop-types";
import styles from "./PageHeading.module.css";

// CSS STYLES
const { pageHeadingDiv, pageHeadingCompact, pageHeading } = styles;

const PageHeading = ({ imgURL, text, compact = false }) => {
  // Long, multi-word titles (e.g. "Public Relations and Sponsorship") look
  // bad at the full hero size - they wrap into huge, widely-spaced lines.
  // Scale only those down to a tidy block; short titles keep the large size.
  const isLongTitle = text.trim().length > 20;

  return (
    <div
      className={compact ? `${pageHeadingDiv} ${pageHeadingCompact}` : pageHeadingDiv}
      style={{
        backgroundImage: `url(${imgURL})`,
      }}
    >
      <h1
        className={pageHeading}
        style={
          isLongTitle ? { fontSize: "clamp(2.2rem, 6vw, 5rem)" } : undefined
        }
      >
        {text}
      </h1>
    </div>
  );
};

PageHeading.propTypes = {
  imgURL: Proptypes.string.isRequired,
  text: Proptypes.string.isRequired,
  // Shorter, viewport-aware hero (used on committee pages) so the header
  // doesn't dominate wide / short screens.
  compact: Proptypes.bool,
};

export default PageHeading;
