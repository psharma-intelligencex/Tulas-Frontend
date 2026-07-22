import styles from "./Socials.module.css";
import PropTypes from "prop-types";

// CSS STYLES
const { socialsContainer } = styles;

// LINKS & IMAGES
const socials = [
  {
    link: "https://www.instagram.com/csatulas",
    image: "/icons/instagram.png",
    alt: "instagram",
  },

  {
    link: "https://www.linkedin.com/",
    image: "/icons/linkedin.png",
    alt: "linkedin",
  },
  {
    link: "https://www.youtube.com/",
    image: "/icons/youtube.png",
    alt: "youtube",
  },
  {
    link: "https://www.facebook.com/",
    image: "/icons/facebook.png",
    alt: "facebook",
  },
  {
    link: "https://x.com/csatulas",
    image: "/icons/twitterx.png",
    alt: "twitterx",
  },
  {
    link: "https://www.linkedin.com/company/csatulas//",
    image: "/icons/linkedin.png",
    alt: "linkedinUPES",
  },
  {
    link: "https://www.instagram.com/",
    image: "/icons/instagram.png",
    alt: "instagramUPES",
  },
];

const Socials = ({ orientation, closeNavbar, gap }) => {
  return (
    <div
      className={socialsContainer}
      style={{ flexDirection: orientation, gap }}
    >
      {socials.map((item) => (
        <a
          key={item.alt}
          href={item.link}
          target="_blank"
          rel="noreferrer"
          onClick={closeNavbar}
        >
          <img loading="lazy" src={item.image} alt={item.alt} />
        </a>
      ))}
    </div>
  );
};

Socials.propTypes = {
  orientation: PropTypes.string,
  closeNavbar: PropTypes.func,
  gap: PropTypes.string,
};

export default Socials;
