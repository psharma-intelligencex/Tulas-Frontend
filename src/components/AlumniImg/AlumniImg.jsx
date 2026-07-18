import React from "react";
import styles from "./AlumniImg.module.css";
const AlumniImg = ({ src }) => {
  const { ImageDiv, Image } = styles;
  return (
    <div className={ImageDiv}>
      <img src={src} className={Image} alt="TULAS CSA alumnus" loading="lazy" />
    </div>
  );
};

export default AlumniImg;
