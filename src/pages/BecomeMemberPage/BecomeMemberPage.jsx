import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import styles from "./BecomeMemberPage.module.css";

// CSS STYLES
const {
  pageContainer,
  pageTitle,
  formCard,
  cardHeading,
  form,
  grid,
  field,
  fieldFull,
  label,
  required,
  input,
  select,
  errorText,
  inputError,
  submitRow,
  submitBtn,
  submitBtnLabel,
  submitError: submitErrorClass,
  popupOverlay,
  popupCard,
  popupIcon,
  popupTitle,
  popupMessage,
  popupCloseBtn,
  comboWrap,
  comboTrigger,
  comboPlaceholder,
  comboPanel,
  comboOption,
  comboOptionSelected,
  groupList,
  groupItem,
  groupTrigger,
  groupTriggerActive,
  groupArrow,
  submenu,
  submenuOpen,
} = styles;

// Dropdown options.
const GENDERS = ["Male", "Female", "Other", "Prefer not to say"];
const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year"];
// Courses grouped by degree family. The dropdown shows only the group label
// (e.g. "B.Tech"); hovering (or tapping) a group reveals its specific courses.
const COURSE_GROUPS = [
  {
    label: "B.Tech",
    options: [
      "B.Tech CSE",
      "B.Tech CSE in AI & ML",
      "B.Tech CSE in Cyber Security",
      "B.Tech CSE in Data Science",
      "B.Tech CSE in Full Stack Development",
      "B.Tech ECE",
      "B.Tech EEE",
      "B.Tech Civil Engineering",
      "B.Tech Mechanical Engineering",
    ],
  },
  {
    label: "M.Tech",
    options: [
      "M.Tech Computer Science Engineering",
      "M.Tech Thermal Engineering",
      "M.Tech Structural Engineering",
    ],
  },
  {
    label: "Diploma",
    options: [
      "Diploma in Civil Engineering",
      "Diploma in Mechanical Engineering",
      "Diploma in CSE",
    ],
  },
  {
    label: "BBA",
    options: ["BBA", "BBA in Digital Marketing", "BBA in Business Analytics"],
  },
  {
    label: "B.Com",
    options: [
      "Bachelor in Commerce (B.Com)",
      "Bachelor in Commerce (Hons.)",
    ],
  },
  {
    label: "MBA",
    options: [
      "MBA",
      "MBA in Marketing",
      "MBA in Human Resource Management",
      "MBA in International Business",
      "MBA in Finance",
      "MBA in Agri-Business Management",
      "MBA in Digital Marketing",
      "MBA in Business Analytics",
    ],
  },
  {
    label: "BCA",
    options: [
      "BCA",
      "BCA in Full Stack Software Development",
      "BCA in AI & ML",
    ],
  },
  {
    label: "MCA",
    options: [
      "MCA",
      "MCA in Full Stack Software Development",
      "MCA in AI & ML",
    ],
  },
  {
    label: "Journalism & Mass Comm.",
    options: ["BAJMC", "BA (Hons.) JMC"],
  },
  {
    label: "Pharmacy",
    options: [
      "Bachelor in Pharmacy (B.Pharma)",
      "Diploma in Pharmacy (D.Pharma)",
    ],
  },
  {
    label: "Law",
    options: [
      "LL.B (Bachelor of Legislative Law)",
      "B.B.A LL.B (Hons.)",
      "B.A LL.B (Hons.)",
    ],
  },
  {
    label: "Agriculture",
    options: ["B.Sc.(Hons.) Agriculture", "M.Sc. Agronomy"],
  },
];

// Duration (in years) of each course. Drives the "Year of Study" options - a
// course only offers years up to its duration (e.g. a 2-year MCA shows only
// 1st/2nd Year). Keys must match the course strings in COURSE_GROUPS exactly.
const COURSE_DURATIONS = {
  "B.Tech CSE": 4,
  "B.Tech CSE in AI & ML": 4,
  "B.Tech CSE in Cyber Security": 4,
  "B.Tech CSE in Data Science": 4,
  "B.Tech CSE in Full Stack Development": 4,
  "B.Tech ECE": 4,
  "B.Tech EEE": 4,
  "B.Tech Civil Engineering": 4,
  "B.Tech Mechanical Engineering": 4,
  "M.Tech Computer Science Engineering": 2,
  "M.Tech Thermal Engineering": 2,
  "M.Tech Structural Engineering": 2,
  "Diploma in Civil Engineering": 3,
  "Diploma in Mechanical Engineering": 3,
  "Diploma in CSE": 3,
  BBA: 3,
  "BBA in Digital Marketing": 3,
  "BBA in Business Analytics": 3,
  "Bachelor in Commerce (B.Com)": 3,
  "Bachelor in Commerce (Hons.)": 4,
  MBA: 2,
  "MBA in Marketing": 2,
  "MBA in Human Resource Management": 2,
  "MBA in International Business": 2,
  "MBA in Finance": 2,
  "MBA in Agri-Business Management": 2,
  "MBA in Digital Marketing": 2,
  "MBA in Business Analytics": 2,
  BCA: 3,
  "BCA in Full Stack Software Development": 3,
  "BCA in AI & ML": 3,
  MCA: 2,
  "MCA in Full Stack Software Development": 2,
  "MCA in AI & ML": 2,
  BAJMC: 3,
  "BA (Hons.) JMC": 4,
  "Bachelor in Pharmacy (B.Pharma)": 4,
  "Diploma in Pharmacy (D.Pharma)": 2,
  "LL.B (Bachelor of Legislative Law)": 3,
  "B.B.A LL.B (Hons.)": 5,
  "B.A LL.B (Hons.)": 5,
  "B.Sc.(Hons.) Agriculture": 4,
  "M.Sc. Agronomy": 2,
};

const COMMITTEES = [
  "Design",
  "Editorial",
  "Events",
  "Logistics",
  "Public Relations and Sponsorship",
  "Registrations",
  "Technical",
  "Social Media",
  "Photography",
];

const INITIAL_FORM = {
  fullName: "",
  gender: "",
  contactNumber: "",
  whatsappNumber: "",
  collegeEmail: "",
  personalEmail: "",
  course: "",
  yearOfStudy: "",
  committeeOne: "",
  committeeTwo: "",
};

// Strict email shape: exactly one "@"; letters/digits with dot, underscore,
// plus or hyphen separators in the local part (no leading/trailing/double
// dots); a dotted domain ending in a 2+ letter TLD.
const EMAIL_REGEX =
  /^[A-Za-z0-9_+-]+(?:\.[A-Za-z0-9_+-]+)*@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;
const PHONE_REGEX = /^[0-9]{10}$/;
// Indian mobile numbers start with 6-9.
const PHONE_START_REGEX = /^[6-9]/;
// Letters with spaces / dots / apostrophes / hyphens between name parts.
const NAME_REGEX = /^[A-Za-z][A-Za-z\s.'-]*$/;
// College email must belong to UPES (name@stu.upes.ac.in, name@upes.ac.in, …).
const UPES_EMAIL_REGEX = /@([a-z0-9-]+\.)*upes\.ac\.in$/i;

// Email fields: only characters that can appear in an email address are
// accepted (letters, digits and ". _ + -") and only ONE "@" - spaces, other
// symbols or a second "@" can't be typed or pasted at all.
const sanitizeEmail = (value) => {
  const cleaned = value.replace(/[^A-Za-z0-9@._+-]/g, "").slice(0, 254);
  const firstAt = cleaned.indexOf("@");
  return firstAt === -1
    ? cleaned
    : cleaned.slice(0, firstAt + 1) +
        cleaned.slice(firstAt + 1).replace(/@/g, "");
};

// Per-field input filters - applied on every keystroke AND paste, so invalid
// characters can never enter the field at all.
const SANITIZERS = {
  // Digits only, hard-capped at 10.
  contactNumber: (value) => value.replace(/\D/g, "").slice(0, 10),
  whatsappNumber: (value) => value.replace(/\D/g, "").slice(0, 10),
  // No digits/symbols in names; collapse repeated spaces.
  fullName: (value) =>
    value
      .replace(/[^A-Za-z\s.'-]/g, "")
      .replace(/\s{2,}/g, " ")
      .slice(0, 60),
  collegeEmail: sanitizeEmail,
  personalEmail: sanitizeEmail,
};

// Fields whose value is picked atomically (selects) - validated immediately
// on change instead of on blur.
const SELECT_FIELDS = new Set([
  "gender",
  "course",
  "yearOfStudy",
  "committeeOne",
  "committeeTwo",
]);

// Grouped single-select dropdown, styled to match the theme's native selects.
// The panel lists only the top-level group labels (e.g. "B.Tech"); hovering a
// group (or tapping it on touch devices) opens a flyout with that group's
// specific courses. Defined at module level (not nested) so it isn't remounted
// on every parent render - which would otherwise close the panel mid-interaction.
const GroupedSelect = ({
  id,
  labelText,
  groups,
  value,
  placeholder,
  error,
  onSelect,
}) => {
  const [open, setOpen] = useState(false);
  // The group whose flyout submenu is currently expanded (by label).
  const [openGroup, setOpenGroup] = useState(null);
  const wrapRef = useRef(null);

  // Close on outside click while open.
  useEffect(() => {
    if (!open) return undefined;
    const onDocMouseDown = (event) => {
      if (wrapRef.current && !wrapRef.current.contains(event.target)) {
        setOpen(false);
        setOpenGroup(null);
      }
    };
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, [open]);

  const choose = (option) => {
    onSelect(option);
    setOpen(false);
    setOpenGroup(null);
  };

  return (
    <div className={field}>
      <label className={label} htmlFor={id}>
        {labelText} <span className={required}>*</span>
      </label>
      <div className={comboWrap} ref={wrapRef}>
        <button
          type="button"
          id={id}
          className={
            error
              ? `${select} ${comboTrigger} ${inputError}`
              : `${select} ${comboTrigger}`
          }
          onClick={() => setOpen((prev) => !prev)}
          aria-haspopup="menu"
          aria-expanded={open}
          aria-invalid={error ? "true" : "false"}
        >
          <span className={value ? undefined : comboPlaceholder}>
            {value || placeholder}
          </span>
        </button>
        {open && (
          <div className={comboPanel}>
            <ul className={groupList} role="menu">
              {groups.map((group) => {
                const groupHasValue = group.options.includes(value);
                const expanded = openGroup === group.label;
                return (
                  <li
                    key={group.label}
                    className={groupItem}
                    onMouseEnter={() => setOpenGroup(group.label)}
                    onMouseLeave={() =>
                      setOpenGroup((prev) =>
                        prev === group.label ? null : prev,
                      )
                    }
                  >
                    <button
                      type="button"
                      className={
                        groupHasValue
                          ? `${groupTrigger} ${groupTriggerActive}`
                          : groupTrigger
                      }
                      onClick={() =>
                        setOpenGroup((prev) =>
                          prev === group.label ? null : group.label,
                        )
                      }
                      aria-haspopup="menu"
                      aria-expanded={expanded}
                    >
                      <span>{group.label}</span>
                      <span className={groupArrow} aria-hidden="true">
                        ›
                      </span>
                    </button>
                    <ul
                      className={expanded ? `${submenu} ${submenuOpen}` : submenu}
                      role="menu"
                    >
                      {group.options.map((option) => (
                        <li key={option} role="none">
                          <button
                            type="button"
                            role="menuitem"
                            className={
                              value === option
                                ? `${comboOption} ${comboOptionSelected}`
                                : comboOption
                            }
                            onClick={() => choose(option)}
                          >
                            {option}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
      {error && <span className={errorText}>{error}</span>}
    </div>
  );
};

GroupedSelect.propTypes = {
  id: PropTypes.string.isRequired,
  labelText: PropTypes.string.isRequired,
  groups: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      options: PropTypes.arrayOf(PropTypes.string).isRequired,
    }),
  ).isRequired,
  value: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  error: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
};

// Flat single-select dropdown sharing the same themed trigger/panel look as
// GroupedSelect, but for a simple (ungrouped) option list. Replaces the native
// <select> for gender, year and committee fields so every dropdown matches.
const PlainSelect = ({
  id,
  labelText,
  options,
  value,
  placeholder,
  error,
  onSelect,
}) => {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  // Close on outside click while open.
  useEffect(() => {
    if (!open) return undefined;
    const onDocMouseDown = (event) => {
      if (wrapRef.current && !wrapRef.current.contains(event.target))
        setOpen(false);
    };
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, [open]);

  const choose = (option) => {
    onSelect(option);
    setOpen(false);
  };

  return (
    <div className={field}>
      <label className={label} htmlFor={id}>
        {labelText} <span className={required}>*</span>
      </label>
      <div className={comboWrap} ref={wrapRef}>
        <button
          type="button"
          id={id}
          className={
            error
              ? `${select} ${comboTrigger} ${inputError}`
              : `${select} ${comboTrigger}`
          }
          onClick={() => setOpen((prev) => !prev)}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-invalid={error ? "true" : "false"}
        >
          <span className={value ? undefined : comboPlaceholder}>
            {value || placeholder}
          </span>
        </button>
        {open && (
          <div className={comboPanel}>
            <ul className={groupList} role="listbox">
              {options.map((option) => (
                <li key={option} role="none">
                  <button
                    type="button"
                    role="option"
                    aria-selected={value === option}
                    className={
                      value === option
                        ? `${comboOption} ${comboOptionSelected}`
                        : comboOption
                    }
                    onClick={() => choose(option)}
                  >
                    {option}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {error && <span className={errorText}>{error}</span>}
    </div>
  );
};

PlainSelect.propTypes = {
  id: PropTypes.string.isRequired,
  labelText: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  value: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  error: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
};

// Validates one field; returns an error message or undefined. `all` provides
// the other fields for cross-field rules (duplicate committee, same emails).
const validateField = (name, rawValue, all) => {
  const value = typeof rawValue === "string" ? rawValue.trim() : rawValue;

  switch (name) {
    case "fullName":
      if (!value) return "Full name is required.";
      if (value.length < 3) return "Full name must be at least 3 characters.";
      if (!NAME_REGEX.test(value))
        return "Use letters only (spaces, dots, hyphens allowed).";
      return undefined;

    case "gender":
      return value ? undefined : "Please select your gender.";

    case "contactNumber":
    case "whatsappNumber": {
      const which =
        name === "contactNumber" ? "Contact number" : "WhatsApp number";
      if (!value) return `${which} is required.`;
      if (!PHONE_REGEX.test(value)) return "Enter exactly 10 digits.";
      if (!PHONE_START_REGEX.test(value))
        return "Mobile number must start with 6, 7, 8 or 9.";
      return undefined;
    }

    case "collegeEmail":
      if (!value) return "College email is required.";
      if (!EMAIL_REGEX.test(value)) return "Enter a valid email address.";
      if (!UPES_EMAIL_REGEX.test(value))
        return "Use your UPES college email (ends with upes.ac.in).";
      return undefined;

    case "personalEmail":
      if (!value) return "Personal email is required.";
      if (!EMAIL_REGEX.test(value)) return "Enter a valid email address.";
      if (
        all.collegeEmail &&
        value.toLowerCase() === all.collegeEmail.trim().toLowerCase()
      )
        return "Personal email must be different from your college email.";
      return undefined;

    case "course":
      return value ? undefined : "Course is required.";

    case "yearOfStudy": {
      if (!value) return "Please select your year.";
      // Guard against a year beyond the chosen course's duration (e.g. left
      // over from a longer course picked earlier).
      if (all.course) {
        const maxYears = COURSE_DURATIONS[all.course] || YEARS.length;
        if (YEARS.indexOf(value) >= maxYears)
          return "Selected year exceeds the course duration.";
      }
      return undefined;
    }

    case "committeeOne":
      return value ? undefined : "Please select a committee preference.";

    case "committeeTwo":
      if (!value) return "Please select a committee preference.";
      if (all.committeeOne && all.committeeOne === value)
        return "Choose a different committee than preference one.";
      return undefined;

    default:
      return undefined;
  }
};

const BecomeMemberPage = () => {
  const [values, setValues] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // While the thank-you popup is open, allow Escape to close it.
  useEffect(() => {
    if (!submitted) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") setSubmitted(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [submitted]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    // Filter the raw value first - phone fields accept digits only (max 10),
    // the name field accepts letters/spaces only. Covers typing and pasting.
    const clean = SANITIZERS[name] ? SANITIZERS[name](value) : value;
    const nextValues = { ...values, [name]: clean };
    setValues(nextValues);

    if (SELECT_FIELDS.has(name)) {
      // Selects are atomic choices - validate immediately. Changing
      // preference one can also (in)validate preference two.
      setErrors((prev) => ({
        ...prev,
        [name]: validateField(name, clean, nextValues),
        ...(name === "committeeOne" && nextValues.committeeTwo
          ? {
              committeeTwo: validateField(
                "committeeTwo",
                nextValues.committeeTwo,
                nextValues,
              ),
            }
          : {}),
      }));
    } else {
      // Text fields: clear the error while editing; re-check on blur/submit.
      setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev));
    }
  };

  // Show the field's error as soon as the user leaves it.
  const handleBlur = (event) => {
    const { name } = event.target;
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, values[name], values),
    }));
  };

  // Set a value directly (used by the custom dropdowns) and validate it.
  const handleSelectValue = (name, value) => {
    const nextValues = { ...values, [name]: value };

    // Changing the course can shrink the valid year range. If the currently
    // picked year no longer fits the new course's duration (e.g. "4th Year"
    // held while switching to a 2-year MCA), clear it so only in-range years
    // remain selectable.
    let clearedYear = false;
    if (name === "course") {
      const maxYears = COURSE_DURATIONS[value] || YEARS.length;
      if (YEARS.indexOf(nextValues.yearOfStudy) >= maxYears) {
        nextValues.yearOfStudy = "";
        clearedYear = true;
      }
    }

    setValues(nextValues);
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value, nextValues),
      // Drop any stale year error when the year was reset - don't flag the
      // field red until the user re-picks.
      ...(clearedYear ? { yearOfStudy: undefined } : {}),
      // Changing preference one can (in)validate preference two.
      ...(name === "committeeOne" && nextValues.committeeTwo
        ? {
            committeeTwo: validateField(
              "committeeTwo",
              nextValues.committeeTwo,
              nextValues,
            ),
          }
        : {}),
    }));
  };

  const validate = () => {
    const next = {};
    Object.keys(INITIAL_FORM).forEach((name) => {
      const message = validateField(name, values[name], values);
      if (message) next[name] = message;
    });
    return next;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    setSubmitError("");

    if (Object.keys(nextErrors).length > 0) {
      setSubmitted(false);
      return;
    }

    // Persist the application via the backend, then confirm with the popup.
    try {
      setSubmitting(true);
      await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/membership/`,
        values,
      );
      setSubmitted(true);
      setValues(INITIAL_FORM);
      setErrors({});
    } catch (error) {
      setSubmitError(
        error.response && error.response.status === 409
          ? "An application with this college email has already been submitted."
          : "Something went wrong while submitting. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Small helper to render a labelled text/email/tel input. Phone fields get
  // a numeric on-screen keyboard and a hard 10-character cap on top of the
  // digits-only sanitizer.
  const renderInput = (
    name,
    text,
    type = "text",
    placeholder = "",
    full = false,
  ) => {
    const isPhone = type === "tel";
    return (
      <div className={full ? `${field} ${fieldFull}` : field}>
        <label className={label} htmlFor={name}>
          {text} <span className={required}>*</span>
        </label>
        <input
          id={name}
          name={name}
          type={type}
          className={errors[name] ? `${input} ${inputError}` : input}
          placeholder={placeholder}
          value={values[name]}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={errors[name] ? "true" : "false"}
          {...(isPhone
            ? { inputMode: "numeric", pattern: "[0-9]*", maxLength: 10 }
            : {})}
          {...(name === "fullName" ? { maxLength: 60 } : {})}
          {...(type === "email" ? { maxLength: 254 } : {})}
        />
        {errors[name] && <span className={errorText}>{errors[name]}</span>}
      </div>
    );
  };

  // Year options limited to the selected course's duration. Before a course is
  // chosen, show the full range.
  const availableYears = values.course
    ? YEARS.slice(0, COURSE_DURATIONS[values.course] || YEARS.length)
    : YEARS;

  // A committee chosen in one preference is hidden from the other so the same
  // committee can't be picked twice.
  const committeeOneOptions = COMMITTEES.filter(
    (committee) => committee !== values.committeeTwo,
  );
  const committeeTwoOptions = COMMITTEES.filter(
    (committee) => committee !== values.committeeOne,
  );

  return (
    <div className={pageContainer}>
      <h1 className={pageTitle}>Registration Drive 2026-27</h1>

      <div className={formCard}>
        <h2 className={cardHeading}>Participant Details</h2>
        <form className={form} onSubmit={handleSubmit} noValidate>
          <div className={grid}>
            {renderInput(
              "fullName",
              "Full Name",
              "text",
              "Your full name",
              true,
            )}
            <PlainSelect
              id="gender"
              labelText="Gender"
              options={GENDERS}
              value={values.gender}
              placeholder="Select gender"
              error={errors.gender}
              onSelect={(value) => handleSelectValue("gender", value)}
            />
            {renderInput(
              "contactNumber",
              "Contact Number",
              "tel",
              "10-digit number",
            )}
            {renderInput(
              "whatsappNumber",
              "WhatsApp Number",
              "tel",
              "10-digit number",
            )}
            {renderInput(
              "collegeEmail",
              "College Email ID",
              "email",
              "name@tulas.edu.in",
            )}
            {renderInput(
              "personalEmail",
              "Personal Email ID",
              "email",
              "name@example.com",
            )}
            <GroupedSelect
              id="course"
              labelText="Course"
              groups={COURSE_GROUPS}
              value={values.course}
              placeholder="Select course"
              error={errors.course}
              onSelect={(value) => handleSelectValue("course", value)}
            />
            <PlainSelect
              id="yearOfStudy"
              labelText="Year of Study"
              options={availableYears}
              value={values.yearOfStudy}
              placeholder="Select year"
              error={errors.yearOfStudy}
              onSelect={(value) => handleSelectValue("yearOfStudy", value)}
            />
            <PlainSelect
              id="committeeOne"
              labelText="Committee Preference One"
              options={committeeOneOptions}
              value={values.committeeOne}
              placeholder="Select a committee"
              error={errors.committeeOne}
              onSelect={(value) => handleSelectValue("committeeOne", value)}
            />
            <PlainSelect
              id="committeeTwo"
              labelText="Committee Preference Two"
              options={committeeTwoOptions}
              value={values.committeeTwo}
              placeholder="Select a committee"
              error={errors.committeeTwo}
              onSelect={(value) => handleSelectValue("committeeTwo", value)}
            />
          </div>

          {submitError && (
            <div className={submitErrorClass} role="alert">
              {submitError}
            </div>
          )}

          <div className={submitRow}>
            <button type="submit" className={submitBtn} disabled={submitting}>
              <span className={submitBtnLabel}>
                {submitting ? "Submitting..." : "Submit Application"}
              </span>
            </button>
          </div>
        </form>
      </div>

      {/* Thank-you popup after a valid submission. Closes via the button,
          clicking the backdrop, or Escape. */}
      {submitted && (
        <div
          className={popupOverlay}
          role="presentation"
          onClick={() => setSubmitted(false)}
        >
          <div
            className={popupCard}
            role="dialog"
            aria-modal="true"
            aria-labelledby="member-success-title"
            onClick={(event) => event.stopPropagation()}
          >
            <span className={popupIcon} aria-hidden="true">
              ✓
            </span>
            <h3 id="member-success-title" className={popupTitle}>
              Thank you!
            </h3>
            <p className={popupMessage}>Your application has been submitted.</p>
            <button
              type="button"
              className={popupCloseBtn}
              autoFocus
              onClick={() => setSubmitted(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BecomeMemberPage;
