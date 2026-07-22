import { useEffect } from "react";
import styles from "./BlogsPage.module.css";

import PageHeading from "../../components/PageHeading/PageHeading";

// CSS STYLES
const {
  blogsContainer,
  inner,
  intro,
  blogsGrid,
  card,
  cardImgWrap,
  cardImg,
  cardBody,
  cardTitle,
  cardSummary,
  cardAuthor,
  avatar,
  authorName,
  stateMsg,
} = styles;

// STATIC BLOG DATA
const blogs = [
  {
    title: "Data Protection",
    summary:
      "Data protection is the way how to protect information by using various measures, technologies, policies and procedures to keep data in a safe place and from the access of unauthorized people.",
    author: "Santosh Singh",
    image: "/img/blogs/m11.webp",
    url: "https://medium.com/@santoshnegi1800/data-protection-why-protecting-personal-information-is-essential-in-the-digital-age-839654cb4e13",
  },
  {
    title: "Data Privacy",
    summary:
      "Data privacy is concerned with how our data is collected, used, stored, shared, and protected. More importantly, data privacy can be understood as providing individuals better visibility into their data.",
    author: "Santosh Singh",
    image: "/img/blogs/m44.webp",
    url: "https://medium.com/@santoshnegi1800/data-privacy-why-protecting-your-personal-information-matters-more-than-ever-c5cdc5a7cbc0",
  },
  {
    title: "AI Uncovers a 15-Year-Old Linux Root Bug",
    summary:
      "By using the AI-based security analysis, researchers have discovered a privilege escalation vulnerability in the Linux operating system that had gone unnoticed for almost 15 years.",
    author: "Santosh Singh",
    image: "/img/blogs/m22.webp",
    url: "https://medium.com/@santoshnegi1800/ai-uncovers-a-15-year-old-linux-root-bug-pentagon-expands-hacker-program-global-privacy-debates-1f2c806fb0ac",
  },
  {
    title: "Understanding CVE-2026-48939",
    summary:
      "Understanding CVE-2026–48939 , this kind of thing usually pops up when a site has that file upload feature. You know, in web apps it’s one of the most abused parts, because if developers didn’t add proper checks, it can quietly become a backdoor. ",
    author: "Santosh Singh",
    image: "/img/blogs/m33.webp",
    url: "https://medium.com/@santoshnegi1800/understanding-cve-2026-48939-a-critical-file-upload-vulnerability-in-joomlas-icagenda-extension-bfaad2584727",
  },
  {
    title: "Jscrambler Supply Chain Incident",
    summary:
      "Research conducted by cybersecurity experts has shown that security issues regarding some packages involving Jscrambler have occurred.",
    author: "Santosh Singh",
    image: "/img/blogs/jscrambler.webp",
    url: "https://san0101.hashnode.dev/when-trusted-packages-turn-against-you-the-jscrambler-supply-chain-incident-explained",
  },
  {
    title: "Rise of Autonomous Worms",
    summary:
      "The AI-powered worm does not stick to the given algorithms but analyzes the environment, identifies the possible ways of spreading malware, and modifies its behavior according to the data it has.",
    author: "Santosh Singh",
    image: "/img/blogs/autonomous_worm.webp",
    url: "https://san0101.hashnode.dev/the-rise-of-autonomous-worms-when-malware-starts-thinking-for-itself",
  },
  {
    title: "AI Hallucinations",
    summary:
      "A new hacking technique known as HalluSquatting illustrates how hackers can trick the AI into creating fake packages and repositories instead of taking advantage of a vulnerability in the software.",
    author: "Santosh Singh",
    image: "/img/blogs/hallucinations.webp",
    url: "https://san0101.hashnode.dev/ai-hallucinations-just-became-a-cybersecurity-threat-meet-hallusquatting",
  },
  {
    title: "Fake Minecraft Mod",
    summary:
      "Researchers discovered a malware called WeedHack, which cost very little to create but can steal passwords through a Minecraft mod. At first glance, it looks like nothing more than a game mod, but in reality, it was developed to steal sensitive information from computers of its victims.",
    author: "Santosh Singh",
    image: "/img/blogs/fake-minecraft.webp",
    url: "https://san0101.hashnode.dev/a-fake-minecraft-mod-a-10-malware-and-a-bigger-problem-we-need-to-talk-about",
  },
  {
    title: "GitHub Ghost Accounts",
    summary:
      "Cyberattacks often begin long before exploitation. GitHub \"ghost accounts\" quietly monitor public repositories, developers, and release cycles to gather intelligence over time.",
    author: "Santosh Singh",
    image: "/img/blogs/github-ghost.webp",
    url: "https://san0101.hashnode.dev/github-ghost-accounts-the-silent-reconnaissance-threat-hiding-in-plain-sight",
  },
  {
    title: " Secure Sandbox Environments for AI",
    summary:
      "Google has started introducing safeguarded sandbox environments for AI workloads, aiming at separating AI operations and minimizing the possibility of unwanted code, prompt injection, and compromised operation of the model.",
    author: "Santosh Singh",
    image: "/img/blogs/secure-sandbox.webp",
    url: "https://san0101.hashnode.dev/google-is-rolling-out-secure-sandbox-environments-for-ai-a-big-step-toward-safer-ai-development",
  },
];

// INITIALS
const getInitials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

const BlogsPage = () => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, []);

  return (
    <div className={blogsContainer}>
      <PageHeading imgURL="/img/hero/hero-bg.jpg" text="BLOGS" />

      <div className={inner}>
        <p className={intro}>
          Explore the TULAS CSA blog featuring articles on cybersecurity, cloud
          computing, ethical hacking, software development, DevOps, and emerging
          technologies written by members of our student chapter.
        </p>

        {blogs.length === 0 ? (
          <p className={stateMsg}>No blogs available.</p>
        ) : (
          <div className={blogsGrid}>
            {blogs.map((blog, index) => (
              <a
                key={index}
                className={card}
                href={blog.url}
                target="_blank"
                rel="noreferrer"
              >
                <div className={cardImgWrap}>
                  <img
                    className={cardImg}
                    src={blog.image}
                    alt={blog.title}
                    loading="lazy"
                    decoding="async"
                  />
                </div>

                <div className={cardBody}>
                  <h2 className={cardTitle}>{blog.title}</h2>

                  <p className={cardSummary}>{blog.summary}</p>

                  <div className={cardAuthor}>
                    <span className={avatar}>{getInitials(blog.author)}</span>

                    <span className={authorName}>{blog.author}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogsPage;
