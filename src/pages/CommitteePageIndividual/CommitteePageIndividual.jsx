import { useEffect } from "react";
import { useParams } from "react-router-dom";
import styles from "./CommitteePageIndividual.module.css";

import PageHeading from "../../components/PageHeading/PageHeading";
import { committees } from "../../data/committees.js";

// CSS STYLES
const {
  page,
  content,
  overline,
  description,
  sectionLabel,
  headsRow,
  card,
  cardLink,
  avatar,
  avatarImg,
  cardName,
  cardRole,
  membersGrid,
  memberChip,
  stateWrap,
  stateText,
} = styles;

// Build initials if no image is provided
const getInitials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

const CommitteePageIndividual = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const { committee } = useParams();

  const committeeData = committees[committee];

  // Invalid URL
  if (!committeeData) {
    return (
      <div className={page}>
        <PageHeading
          imgURL="/img/hero/hero-bg.jpg"
          text="Committee"
          compact
        />

        <div className={stateWrap}>
          <p className={stateText}>
            Committee not found.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={page}>
      <PageHeading
        imgURL="/img/hero/hero-bg.jpg"
        text={committeeData.title}
        compact
      />

      <div className={content}>
        <p className={overline}>TULAS CSA COMMITTEE</p>

        {committeeData.description && (
          <p className={description}>
            {committeeData.description}
          </p>
        )}

        {committeeData.heads?.length > 0 && (
          <>
            <h2 className={sectionLabel}>
              Heads
            </h2>

            <div className={headsRow}>
              {committeeData.heads.map((head, index) => {
                const inner = (
                  <>
                    {head.image ? (
                      <img
                        className={`${avatar} ${avatarImg}`}
                        src={head.image}
                        alt={head.name}
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <span className={avatar}>
                        {getInitials(head.name)}
                      </span>
                    )}

                    <div>
                      <h3 className={cardName}>
                        {head.name}
                      </h3>

                      {head.position && (
                        <p className={cardRole}>
                          {head.position}
                        </p>
                      )}
                    </div>
                  </>
                );

                return head.linkedIn ? (
                  <a
                    key={index}
                    className={`${card} ${cardLink}`}
                    href={head.linkedIn}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {inner}
                  </a>
                ) : (
                  <div key={index} className={card}>
                    {inner}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {committeeData.members?.length > 0 && (
          <>
            <h2 className={sectionLabel}>Members</h2>

            <div className={membersGrid}>
              {committeeData.members.map((member, index) => (
                <div key={index} className={memberChip}>
                  {typeof member === "string"
                    ? member
                    : member.name}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CommitteePageIndividual;