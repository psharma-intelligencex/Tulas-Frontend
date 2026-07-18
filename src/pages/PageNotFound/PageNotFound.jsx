import { useEffect } from "react";
import styles from "./PageNotFound.module.css";

// CSS STYLES
const { pageNotFound, innerContent, subHeading, heading } = styles;

const PageNotFound = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);
  return (
    <div className={pageNotFound}>
      <div className={innerContent}>
        <h1 className={heading}>404</h1>
        <h2 className={subHeading}>Page Not Found</h2>
      </div>
    </div>
  );
};

export default PageNotFound;
