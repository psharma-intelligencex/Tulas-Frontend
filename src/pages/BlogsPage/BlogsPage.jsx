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
  // {
  //   title: "DevOps as a Service",
  //   summary:
  //     "DevOps is a combination of development and operations. It helps improve collaboration, automation, and software delivery.",
  //   author: "Khushi Arora",
  //   image: "/blogs/devops.jpg",
  //   url: "https://medium.com/",
  // },
  // {
  //   title: "Altogic and its Various Services",
  //   summary:
  //     "Altogic is a backend development platform that helps developers build scalable applications quickly.",
  //   author: "Khushi Arora",
  //   image: "/blogs/altogic.jpg",
  //   url: "https://medium.com/",
  // },
  // {
  //   title: "Azure Monitor",
  //   summary:
  //     "Azure Monitor provides monitoring, reporting, and analytics for cloud resources and applications.",
  //   author: "Khushi Arora",
  //   image: "/blogs/azure-monitor.jpg",
  //   url: "https://medium.com/",
  // },
  // {
  //   title: "Dockerize and Deploy a MERN Stack Application",
  //   summary:
  //     "Learn how to containerize and deploy a MERN Stack application using Docker and AWS.",
  //   author: "Ayush Singh Kushwah",
  //   image: "/blogs/docker.jpg",
  //   url: "https://medium.com/",
  // },
  // {
  //   title: "Cloud Computing Fundamentals",
  //   summary:
  //     "An introduction to cloud computing concepts, deployment models, and service models.",
  //   author: "John Doe",
  //   image: "/blogs/cloud.jpg",
  //   url: "https://medium.com/",
  // },
  // {
  //   title: "Next.js vs React",
  //   summary:
  //     "Understand the differences between React and Next.js and when each one should be used.",
  //   author: "Ayush Singh Kushwah",
  //   image: "/blogs/next-react.jpg",
  //   url: "https://medium.com/",
  // },
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
      <PageHeading
        imgURL="/img/hero/hero-bg.jpg"
        text="BLOGS"
      />

      <div className={inner}>
        <p className={intro}>
          Explore the TULAS CSA blog featuring articles on cybersecurity,
          cloud computing, ethical hacking, software development, DevOps,
          and emerging technologies written by members of our student chapter.
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

                  <p className={cardSummary}>
                    {blog.summary}
                  </p>

                  <div className={cardAuthor}>
                    <span className={avatar}>
                      {getInitials(blog.author)}
                    </span>

                    <span className={authorName}>
                      {blog.author}
                    </span>
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