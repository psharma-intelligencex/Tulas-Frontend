import { Link } from "react-router-dom";
import styles from "./HomeBlogs.module.css";

// CSS STYLES
const {
  homeBlogsContainer,
  inner,
  header,
  heading,
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
  exploreWrap,
  exploreBtn,
  arrow,
  stateMsg
} = styles;

// STATIC BLOG DATA
const blogs = [
  // {
  //   title: "DevOps as a Service",
  //   summary:
  //     "DevOps is a combination of development and operations. Learn how it improves software delivery and collaboration.",
  //   author: "Khushi Arora",
  //   image: "/blogs/devops.jpg",
  //   url: "https://medium.com/",
  // },
  // {
  //   title: "Altogic and its Various Services",
  //   summary:
  //     "Explore Altogic, a backend development platform for building scalable applications quickly and efficiently.",
  //   author: "Khushi Arora",
  //   image: "/blogs/altogic.jpg",
  //   url: "https://medium.com/",
  // },
  // {
  //   title: "Azure Monitor",
  //   summary:
  //     "Azure Monitor helps maximize application availability and performance with monitoring and analytics.",
  //   author: "Khushi Arora",
  //   image: "/blogs/azure-monitor.jpg",
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

const HomeBlogs = () => {
  return (
    <section className={homeBlogsContainer} id="blogs">
      <div className={inner}>
        <div className={header}>
          <h2 className={heading}>Blogs</h2>
        </div>

        {blogs.length === 0 ? (
          <p className={stateMsg}>No blogs to show right now.</p>
        ) : (
          <>
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
                    <h3 className={cardTitle}>{blog.title}</h3>

                    <p className={cardSummary}>{blog.summary}</p>

                    <div className={cardAuthor}>
                      <span className={avatar}>{getInitials(blog.author)}</span>

                      <span className={authorName}>{blog.author}</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>

            {/* <div className={exploreWrap}>
          <Link className={exploreBtn} to="/blogs">
            Explore All Articles{" "}
            <span className={arrow} aria-hidden="true">
              →
            </span>
          </Link>
        </div> */}
          </>
        )}
      </div>
    </section>
  );
};

export default HomeBlogs;
