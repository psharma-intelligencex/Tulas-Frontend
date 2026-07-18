import { useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./CommitteePage.module.css";

import PageHeading from "../../components/PageHeading/PageHeading";

// CSS STYLES
const {
  committeePageContainer,
  teamPageContainer,
  intro,
  committeeGrid,
  committeeCard,
  committeeLogoWrap,
  committeeLogo,
  committeeName,
} = styles;

// Static committee list
const COMMITTEES = [
  // {
  //   name: "Design",
  //   slug: "design",
  //   icon: "/committees/design.png",
  // },
  {
    name: "Content Writing",
    slug: "contentwriting",
    icon: "/committees/editorial.png",
  },
  // {
  //   name: "Events",
  //   slug: "events",
  //   icon: "/committees/events.png",
  // },
  // {
  //   name: "Logistics",
  //   slug: "logistics",
  //   icon: "/committees/logistics.png",
  // },
  // {
  //   name: "Photography",
  //   slug: "photography",
  //   icon: "/committees/photography.png",
  // },
  {
    name: "Public Relations & Sponsorship",
    slug: "public-relations",
    icon: "/committees/public-relations.png",
  },
  // {
  //   name: "Registrations",
  //   slug: "registrations",
  //   icon: "/committees/registrations.png",
  // },
  {
    name: "Social Media",
    slug: "social-media",
    icon: "/committees/social-media.png",
  },
  {
    name: "Technical",
    slug: "technical",
    icon: "/committees/technical.png",
  },
];

const CommitteePage = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <div className={teamPageContainer}>
      <PageHeading
        imgURL="/img/hero/hero-bg.jpg"
        text="Committees"
      />

      <div className={committeePageContainer}>
        <p className={intro}>
          <span className={"highlight"}><b>Tula&apos;s University Editorial Committee</b></span> is the creative voice of the student chapter, bringing ideas, achievements, and events to life through compelling content. From newsletters and technical articles to social media and event promotions, the team transforms complex cybersecurity concepts into engaging stories. Driven by creativity and clear communication, they ensure every message reflects the chapter&apos;s vision while inspiring the cybersecurity community.
        </p>

        <div className={committeeGrid}>
          {COMMITTEES.map((committee) => (
            <Link
              key={committee.slug}
              className={committeeCard}
              to={`/committees/${committee.slug}`}
            >
              <div className={committeeLogoWrap}>
                <img
                  className={committeeLogo}
                  src={committee.icon}
                  alt={`${committee.name} Committee`}
                  width={500}
                  height={500}
                  loading="lazy"
                  decoding="async"
                />
              </div>

              <h2 className={committeeName}>
                {committee.name}
              </h2>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommitteePage;