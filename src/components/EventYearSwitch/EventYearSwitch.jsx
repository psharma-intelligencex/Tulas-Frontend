import Proptypes from "prop-types";
import styles from "./EventYearSwitch.module.css";

// CSS STYLES
const { eventYearSwitchContainer, eventYearSwitchButton, activeButton } = styles;

const EventYearSwitch = ({ yearData, activeYear, changeYear }) => {
  return (
    <div className={eventYearSwitchContainer}>
      {yearData.map((year) => (
        <button
          key={year}
          className={`${eventYearSwitchButton} ${
            activeYear === year ? activeButton : ""
          }`}
          onClick={() => changeYear(year)}
        >
          {year}
        </button>
      ))}
    </div>
  );
};

EventYearSwitch.propTypes = {
  yearData: Proptypes.arrayOf(Proptypes.number),
  activeYear: Proptypes.number.isRequired,
  changeYear: Proptypes.func.isRequired,
};

export default EventYearSwitch;
