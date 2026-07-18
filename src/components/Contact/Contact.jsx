import { Link } from "react-router-dom";
import styles from "./Contact.module.css";

// CSS STYLES
const {
  footer,
  footerInner,
  footerTop,
  colTitle,
  follow,
  socials,
  socialBtn,
  logoCenter,
  logoImg,
  contact,
  contactList,
  contactItem,
  contactIcon,
  footerBottom,
} = styles;

// "Follow us!" - same links and order as the existing site socials, using the
// existing icon assets in /public/icons.
const socialLinks = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/csatulas/?hl=en",
    icon: "/icons/instagram.png",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/upescsa/",
    icon: "/icons/linkedin.png",
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/channel/UCOQTG59VV6-1czSs57XAFrA",
    icon: "/icons/youtube.png",
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/upescsa/",
    icon: "/icons/facebook.png",
  },
  {
    label: "Twitter",
    href: "https://twitter.com/upescsa",
    icon: "/icons/twitterx.png",
  },
];

const Contact = () => {
  return (
    <footer className={footer} id="contact">
      <div className={footerInner}>
        <div className={footerTop}>
          {/* LEFT - Follow us! */}
          <div className={follow}>
            <h3 className={colTitle}>Follow us!</h3>
            <div className={socials}>
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  className={socialBtn}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                >
                  <img src={s.icon} alt={s.label} loading="lazy" decoding="async" />
                </a>
              ))}
            </div>
          </div>

          {/* CENTER - UPES CSA logo (existing asset, unmodified); links home.
              The explicit scroll matters: HomePage has no scroll-to-top on
              mount, and when already on "/" the Link alone would do nothing. */}
          <div className={logoCenter}>
            <Link
              to="/"
              aria-label="Go to homepage"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <img
                className={logoImg}
                src="/logo/tulascsa.png"
                alt="TULAS CSA - Cloud Security Alliance"
                width={1920}
                height={1920}
                loading="lazy"
                decoding="async"
              />
            </Link>
          </div>

          {/* RIGHT - Contact Us */}
          <div className={contact}>
            <h3 className={colTitle}>Contact Us</h3>
            <div className={contactList}>
              <div className={contactItem}>
                <img
                  className={contactIcon}
                  src="/icons/location.png"
                  width={96}
                  height={96}
                  alt=""
                  aria-hidden="true"
                  decoding="async"
                />
                <span>TULAS, Dehradun, 248007</span>
              </div>
              <a className={contactItem} href="tel:+919720518418">
                <img
                  className={contactIcon}
                  src="/icons/phone.png"
                  width={60}
                  height={60}
                  alt=""
                  aria-hidden="true"
                  decoding="async"
                />
                <span>+91 97205 18418</span>
              </a>
              <a className={contactItem} href="mailto:support@tulascsa.in">
                <img
                  className={contactIcon}
                  src="/icons/email.png"
                  width={60}
                  height={60}
                  alt=""
                  aria-hidden="true"
                  decoding="async"
                />
                <span>support@tulascsa.in</span>
              </a>
            </div>
          </div>
        </div>

        <div className={footerBottom}>
          Copyright © 2026 All rights reserved | Designed and Developed by TULAS
          CSA Technical Team
        </div>
      </div>
    </footer>
  );
};

export default Contact;
