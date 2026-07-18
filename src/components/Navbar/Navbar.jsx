import { useEffect, useState, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./Navbar.module.css";

// COMPONENTS
// import Logo from "../Logo/Logo";
import Navlinks from "../Navlinks/Navlinks";
import Socials from "../Socials/Socials";

// CSS STYLES
const {
  navbarContainer,
  navbar,
  hamburger,
  hamburgerIcon,
  logoDiv,
  logoLink,
  logoImg,
  logoDivider,
  logoUpes,
  menu,
  navLinks,
  navCta,
  mobileLine,
  socialsDiv,
  backdrop,
} = styles;

// Mobile/desktop boundary - below this width the hamburger drawer is used.
const MOBILE_BREAKPOINT = 1024;

const Navbar = () => {
  // STATES
  const [open, setOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  const location = useLocation();

  // DATA
  const navlinks = [
    {
      title: "Events",
      action: "/events",
    },
    {
      title: "Team",
      action: "/team",
    },
    {
      title: "Committees",
      action: "/committees",
    },
    // {
    //   title: "CSR",
    //   action: "/csr",
    // },
    {
      title: "Blogs",
      action: "/blogs",
    },
    // {
    //   title: "Alumni",
    //   action: "/alumni",
    // },
    {
      title: "Contact Us",
      action: "https://uk.cloudsecurityalliance.in/contact",
      external: true,
    },
  ];

  // Centered navigation links vs. right-aligned actions (Contact Us + CTA).
  // Same links, routes and order as before - only the layout grouping changes.
  const centerLinks = navlinks.filter(
    (link) => !link.glow && !link.external && !link.action.startsWith("#")
  );
  const rightLinks = navlinks.filter(
    (link) => link.glow || link.external || link.action.startsWith("#")
  );

  // FUNCTIONS
  const closeMenu = useCallback(() => setOpen(false), []);
  const toggleMenu = useCallback(() => setOpen((prev) => !prev), []);

  // Clicking the logo should always land on the homepage at the very top.
  // When we're already on "/" the route doesn't change, so HomePage never
  // re-mounts - scroll to top here so the logo always resets the view.
  const handleLogoClick = useCallback(() => {
    closeMenu();
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [closeMenu]);

  // Track scroll position (desktop translucency) and viewport width.
  useEffect(() => {
    const handleScroll = () => setScrollPosition(window.scrollY);
    const handleResize = () => setScreenWidth(window.innerWidth);

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Close the mobile menu automatically when navigating to a new route.
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Close the menu if the viewport grows past the desktop breakpoint.
  useEffect(() => {
    if (screenWidth >= MOBILE_BREAKPOINT) setOpen(false);
  }, [screenWidth]);

  // While the menu is open: lock body scrolling (iOS-Safari-safe) and allow
  // Escape to close. The position:fixed technique reliably prevents the page
  // behind the drawer from scrolling on iOS, Android and desktop.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);

    const scrollY = window.scrollY;
    const { body } = document;
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      body.style.position = "";
      body.style.top = "";
      body.style.left = "";
      body.style.right = "";
      body.style.width = "";
      window.scrollTo(0, scrollY);
    };
  }, [open]);

  // Glassmorphism navbar: translucent dark background + backdrop blur.
  const glassBase = {
    backdropFilter: "blur(14px)",
    WebkitBackdropFilter: "blur(14px)",
    borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
  };

  let navbarStyle;
  if (screenWidth < MOBILE_BREAKPOINT) {
    navbarStyle = { ...glassBase, backgroundColor: "rgba(5, 7, 12, 0.88)" };
  } else {
    navbarStyle = {
      ...glassBase,
      backgroundColor:
        scrollPosition > 0 ? "rgba(5, 7, 12, 0.72)" : "rgba(5, 7, 12, 0.42)",
    };
  }

  return (
    <header className={navbarContainer} style={navbarStyle}>
      <nav className={navbar} id="navbar" aria-label="Primary">
        <div className={logoDiv}>
          <Link
            to="/"
            className={logoLink}
            aria-label="UPES CSA - Uttarakhand Chapter"
            onClick={handleLogoClick}
          >
            {/* Transparent logos served from /public/logo. Layout:
                CSA Uttarakhand lockup (navbar-csa.png, used as-is) on the
                left, a thin vertical divider, then the UPES logo on the
                right - kept as two separate images. */}
            <img
              className={logoImg}
              src="/logo/navbar-csa.png"
              alt="CSA Uttarakhand Chapter"
              width={986}
              height={253}
              decoding="async"
            />
            <span className={logoDivider} aria-hidden="true" />
            <img className={logoUpes} src="/logo/tulaslogo.png" alt="UPES" width={1280} height={350} decoding="async" />
          </Link>
          {/* <Logo height="4rem" /> */}
        </div>

        {/* Desktop: `menu` is display:contents so its children become direct
            grid items (identical desktop layout). Mobile: `menu` is a
            full-width drawer that slides open below the bar. */}
        <div className={menu} id="primary-navigation" data-open={open}>
          <ul className={navLinks}>
            <hr className={mobileLine} />
            {centerLinks.map((navlink) => (
              <Navlinks
                key={navlink.title}
                title={navlink.title}
                action={navlink.action}
                separatePage={navlink.separatePage}
                closeNavbar={closeMenu}
                glow={false}
              />
            ))}
          </ul>
          <div className={navCta}>
            {rightLinks.map((navlink) => (
              <Navlinks
                key={navlink.title}
                title={navlink.title}
                action={navlink.action}
                separatePage={navlink.separatePage}
                closeNavbar={closeMenu}
                glow={navlink.glow ? true : false}
              />
            ))}
          </div>
          <div className={socialsDiv}>
            <Socials orientation={"row"} closeNavbar={closeMenu} />
          </div>
        </div>

        <button
          type="button"
          className={hamburger}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="primary-navigation"
          onClick={toggleMenu}
        >
          <img
            className={hamburgerIcon}
            src={open ? "/icons/hamburgercross.png" : "/icons/hamburger.png"}
            alt=""
            aria-hidden="true"
            decoding="async"
          />
        </button>
      </nav>

      {/* Click-outside / dim backdrop (mobile only). */}
      <div
        className={backdrop}
        data-open={open}
        onClick={closeMenu}
        aria-hidden="true"
      />
    </header>
  );
};

export default Navbar;
