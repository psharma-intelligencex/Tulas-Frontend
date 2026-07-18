import PropTypes from "prop-types";
import styles from "./Navlinks.module.css";

import { Link, NavLink } from "react-router-dom";

// CSS STYLES
const { navLinks, glowText, contactBtn, active: activeClass } = styles;

const scroll = (element) => {
  const ElementToView = document.querySelector(element);
  if (ElementToView) {
    ElementToView.scrollIntoView({ behavior: "smooth" });
  }
};

const Navlinks = ({ title, action, size, textStyle, closeNavbar, glow }) => {
  const isExternal = /^https?:\/\//i.test(action || "");

  const handleClick = () => {
    // In-page hash links (e.g. "#contact") are scrolled to manually. Router
    // paths like "/events" are handled by <NavLink>/<Link> and are not valid
    // CSS selectors, so they must not be passed to querySelector.
    if (action && action.startsWith("#")) {
      // When the mobile drawer is open, the body is scroll-locked via
      // position:fixed; closing it restores the previous scroll position,
      // which would cancel an immediate scroll. Defer until after the close
      // animation/unlock so the navigation wins. On desktop (not locked)
      // scroll immediately.
      const locked = document.body.style.position === "fixed";
      if (closeNavbar) closeNavbar();
      if (locked) {
        setTimeout(() => scroll(action), 320);
      } else {
        scroll(action);
      }
    } else if (closeNavbar) {
      // Router links: close the mobile menu (no-op on desktop).
      closeNavbar();
    }
  };

  return (
    <li className={navLinks} style={{ fontSize: size }} onClick={handleClick}>
      {glow ? (
        <Link to={action} className={glowText} style={textStyle}>
          {title}
        </Link>
      ) : isExternal ? (
        <a
          href={action}
          target="_blank"
          rel="noreferrer"
          className={contactBtn}
          style={textStyle}
        >
          {title}
        </a>
      ) : action.startsWith("#") ? (
        <span style={{ cursor: "pointer", color: "white" }}>{title}</span>
      ) : (
        <NavLink
          to={action}
          style={textStyle}
          className={({ isActive }) => (isActive ? activeClass : undefined)}
        >
          {title}
        </NavLink>
      )}
    </li>
  );
};

Navlinks.propTypes = {
  title: PropTypes.string.isRequired,
  action: PropTypes.string.isRequired,
  size: PropTypes.string,
  textStyle: PropTypes.object,
  closeNavbar: PropTypes.func.isRequired,
  glow: PropTypes.bool,
};

export default Navlinks;
