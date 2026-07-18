import styles from "./About.module.css";

import Stats from "../Stats/Stats";

// CSS STYLES
const { aboutContainer, heading, aboutText, highlight, statsDiv } = styles;

const About = () => {
  // STATS DATA
  const statsData = [
    {
      number: "10+",
      text: (
        <p>
          Years of <br /> Excellence
        </p>
      ),
    },
    {
      number: "2000+",
      text: (
        <p>
          Successful <br /> Alumni
        </p>
      ),
    },
    {
      number: "120+",
      text: (
        <p>
          Engaging <br /> Events
        </p>
      ),
    },
    {
      number: "5+",
      text: (
        <p>
          Industry <br /> Collaborations
        </p>
      ),
    },
  ];

  return (
    <div className={aboutContainer} id="about">
      <h2 className={heading}>Legacy of Excellence</h2>
      <div className={aboutText}>
        With a vision to foster cybersecurity awareness, cloud security
        excellence, and innovation, <span className={highlight}>the Cloud Security Alliance (CSA)
        Uttarakhand Student Chapter at Tula&apos;s University</span> was established in
        <span className={highlight}> 2026</span>. As a collaborative initiative under the <span className={highlight}>Cloud Security Alliance(CSA) Uttarakhand Chapter</span>, the student chapter is committed to
        empowering the next generation of cybersecurity professionals by
        creating a vibrant ecosystem of learning, collaboration, and innovation.<br/><br/>
        The chapter serves as a platform where students can bridge the gap
        between academic knowledge and industry expectations through expert-led
        workshops, hands-on technical sessions, hackathons, cybersecurity
        competitions, seminars, and networking opportunities with industry
        leaders. By encouraging practical learning and continuous skill
        development, CSA Uttarakhand at Tula&apos;s University aims to cultivate
        a community of future-ready cybersecurity enthusiasts equipped to
        address the evolving challenges of the digital world.<br/><br/> Guided by the
        belief that <i>&quot;innovation thrives through collaboration and continuous
        learning,&quot;</i> the CSA Uttarakhand Student Chapter at Tula&apos;s Institute
        aspires to inspire students to become skilled professionals, responsible
        digital citizens, and leaders in the fields of cloud security,
        cybersecurity, and emerging technologies.
      </div>

      {/* <div className={statsDiv}>
        {statsData.map((data) => (
          <Stats key={data.number} number={data.number} statText={data.text} />
        ))}
      </div> */}
    </div>
  );
};

export default About;
