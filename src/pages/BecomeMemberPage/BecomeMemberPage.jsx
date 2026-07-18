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
  placeholderOption,
  errorText,
  inputError,
  submitRow,
  submitBtn,
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
  comboSearch,
  comboList,
  comboOption,
  comboOptionSelected,
  comboEmpty,
} = styles;

// Dropdown options.
const GENDERS = ["Male", "Female", "Other", "Prefer not to say"];
const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
const COURSES = [
  "B.Tech. in Aerospace Engineering",
  "B.Tech. in Chemical Engineering",
  "B.Tech. in Fire Safety Engineering",
  "B.Tech. in Civil Engineering",
  "B.Tech. in Sustainability Engineering",
  "B.Tech. in Electrical Engineering",
  "B.Tech. in Electronics and Computer Engineering",
  "B.Tech. in VLSI Design and Technology",
  "B.Tech. in Mechanical Engineering",
  "B.Tech. in Applied Petroleum Engineering",
];

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

// Searchable single-select dropdown, styled to match the theme's native
// selects. Defined at module level (not nested) so it isn't remounted on every
// parent render - which would otherwise close the panel on each keystroke.
const SearchableSelect = ({
  id,
  labelText,
  options,
  value,
  placeholder,
  error,
  onSelect,
}) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
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

  const filtered = options.filter((option) =>
    option.toLowerCase().includes(query.trim().toLowerCase()),
  );

  const choose = (option) => {
    onSelect(option);
    setOpen(false);
    setQuery("");
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
            <input
              className={comboSearch}
              type="text"
              autoFocus
              placeholder="Search course..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <ul className={comboList} role="listbox">
              {filtered.length === 0 ? (
                <li className={comboEmpty}>No matches found</li>
              ) : (
                filtered.map((option) => (
                  <li
                    key={option}
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
                  </li>
                ))
              )}
            </ul>
          </div>
        )}
      </div>
      {error && <span className={errorText}>{error}</span>}
    </div>
  );
};

SearchableSelect.propTypes = {
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

    case "yearOfStudy":
      return value ? undefined : "Please select your year.";

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

  // Set a value directly (used by the searchable dropdown) and validate it.
  const handleSelectValue = (name, value) => {
    const nextValues = { ...values, [name]: value };
    setValues(nextValues);
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value, nextValues),
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

  // Small helper to render a labelled select.
  const renderSelect = (name, text, options, placeholder) => (
    <div className={field}>
      <label className={label} htmlFor={name}>
        {text} <span className={required}>*</span>
      </label>
      <select
        id={name}
        name={name}
        className={errors[name] ? `${select} ${inputError}` : select}
        value={values[name]}
        onChange={handleChange}
        onBlur={handleBlur}
        aria-invalid={errors[name] ? "true" : "false"}
      >
        <option value="" disabled className={placeholderOption}>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {errors[name] && <span className={errorText}>{errors[name]}</span>}
    </div>
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
            {renderSelect("gender", "Gender", GENDERS, "Select gender")}
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
              "name@stu.tulas.ac.in",
            )}
            {renderInput(
              "personalEmail",
              "Personal Email ID",
              "email",
              "name@example.com",
            )}
            <SearchableSelect
              id="course"
              labelText="Course"
              options={COURSES}
              value={values.course}
              placeholder="Select course"
              error={errors.course}
              onSelect={(value) => handleSelectValue("course", value)}
            />
            {renderSelect("yearOfStudy", "Year of Study", YEARS, "Select year")}
            {renderSelect(
              "committeeOne",
              "Committee Preference One",
              COMMITTEES,
              "Select a committee",
            )}
            {renderSelect(
              "committeeTwo",
              "Committee Preference Two",
              COMMITTEES,
              "Select a committee",
            )}
          </div>

          {submitError && (
            <div className={submitErrorClass} role="alert">
              {submitError}
            </div>
          )}

          <div className={submitRow}>
            <button type="submit" className={submitBtn} disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Application"}
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
