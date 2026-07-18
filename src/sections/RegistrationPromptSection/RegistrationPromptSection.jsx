import { Link } from "react-router-dom";
import styles from "./RegistrationPromptSection.module.css";

const { mainDiv, content, contentHeading } = styles;

const RegistrationPromptSection = () => {
  return (
    <div className={mainDiv}>
      <div className={content}>
        <h1 className="heading" id={contentHeading}>
          Unleash your research, Build the future. <br />
          Join the Hackathon!
        </h1>
        {/* <Link to={"/hackathon4.0/register"}>
          <button className="registrationButton">REGISTER NOW!</button>
        </Link> */}
      </div>
    </div>
  );
};

export default RegistrationPromptSection;
