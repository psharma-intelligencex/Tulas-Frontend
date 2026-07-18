// Branded CSA loader for the admin CMS. Full-screen by default (used for the
// auth-restore / initial page-load state); pass `inline` for an in-content
// spinner. Matches the enterprise theme (indigo on dark slate).
export default function CsaLoader({ label = "Loading", inline = false }) {
  return (
    <div className={inline ? "csa-loader csa-loader--inline" : "csa-loader"}>
      <div className="csa-loader-mark">
        <span className="csa-loader-ring" />
        <span className="csa-loader-badge">C</span>
      </div>
      <div className="csa-loader-title">
        CSA <span className="csa-loader-accent">Uttarakhand</span>
      </div>
      <div className="csa-loader-label">{label}
        <span className="csa-loader-dots"><i /><i /><i /></span>
      </div>
    </div>
  );
}
