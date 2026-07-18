import { useEffect } from "react";
import { Users, ArrowRight } from "lucide-react";
import styles from "./TeamPage.module.css";

import PageHeading from "../../components/PageHeading/PageHeading";
import Picture from "../../components/Picture/Picture";
// Single source of truth for the roster. scripts/prerender-seo.mjs imports the
// same module at build time to emit the Person / ItemList JSON-LD directly into
// dist/team/index.html, so the schema is in the served HTML rather than being
// injected on mount (and is therefore visible to crawlers that don't run JS).
import { TEAM, IMAGE_DIMS } from "./teamData";

// CSS STYLES
const {
  teamPageContainer,
  treeWrap,
  intro,
  tree,
  tier,
  detachedTier,
  connector,
  tierOrg,
  tierOrgCsa,
  tierLabel,
  tierMembers,
  tierCta,
  tierCtaCaption,
  memberCard,
  avatar,
  memberBody,
  memberName,
  memberRole,
  roleLink,
  boardCta,
  boardCtaIcon,
  boardCtaText,
  boardCtaDivider,
  boardCtaArrow,
} = styles;

const getInitials = (name) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

const TeamPage = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <div className={teamPageContainer}>
      <PageHeading imgURL="/img/hero/hero-bg.jpg" text="TEAM" />
      <div className={treeWrap}>
        <p className={intro}>
          Meet the student leaders behind the TULAS Cloud Security Alliance. From
          faculty coordinators to the core committee, heads, and associate
          heads, our team drives its cybersecurity workshops, hackathons, and
          cloud security initiatives. Together they shape a growing technical
          community at TULAS, guiding student leadership, mentoring peers, and
          organising the events that make the chapter thrive.
        </p>

        <div className={tree}>
          {TEAM.map((t, index) => (
            <div
              className={t.detached ? `${tier} ${detachedTier}` : tier}
              key={t.label}
            >
              {/* No connector into a detached tier (or the tier right after it),
                  so the standalone entry doesn't join the hierarchy. */}
              {index > 0 && !TEAM[index - 1].detached && (
                <span className={connector} aria-hidden="true" />
              )}
              {t.org && (
                <span
                  className={
                    t.orgVariant === "csa" ? `${tierOrg} ${tierOrgCsa}` : tierOrg
                  }
                >
                  {t.org}
                </span>
              )}
              <h2 className={tierLabel}>{t.label}</h2>
              <div className={tierMembers}>
                {t.members.map((member) => {
                  const key = `${member.name}-${member.position}`;
                  const photo = member.image ? (
                    <Picture
                      className={avatar}
                      src={member.image}
                      width={IMAGE_DIMS[member.image]?.[0]}
                      height={IMAGE_DIMS[member.image]?.[1]}
                      alt={
                        member.position
                          ? `${member.name} - ${member.position}${
                              t.org === "CSA Uttarakhand"
                                ? ""
                                : ", UPES Cloud Security Alliance"
                            }`
                          : `${member.name}, UPES Cloud Security Alliance`
                      }
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <span className={avatar}>{getInitials(member.name)}</span>
                  );

                  return (
                    <div className={memberCard} key={key}>
                      {member.imageLink ? (
                        <a
                          href={member.imageLink}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {photo}
                        </a>
                      ) : (
                        photo
                      )}
                      <div className={memberBody}>
                        <h3 className={memberName}>{member.name}</h3>
                        {member.position &&
                          (member.positionLink ? (
                            <a
                              className={roleLink}
                              href={member.positionLink}
                              target="_blank"
                              rel="noreferrer"
                            >
                              {member.position}
                            </a>
                          ) : (
                            <p className={memberRole}>{member.position}</p>
                          ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {t.cta && (
                <div className={tierCta}>
                  <span className={tierCtaCaption}>{t.cta.caption}</span>
                  <a
                    className={boardCta}
                    href={t.cta.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Users
                      className={boardCtaIcon}
                      size={28}
                      strokeWidth={2.2}
                      aria-hidden="true"
                    />
                    <span className={boardCtaText}>{t.cta.label}</span>
                    <span className={boardCtaDivider} aria-hidden="true" />
                    <span className={boardCtaArrow} aria-hidden="true">
                      <ArrowRight size={20} strokeWidth={2.2} />
                    </span>
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamPage;
