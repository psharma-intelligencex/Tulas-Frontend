import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ShieldCheck, CalendarDays, Users2, LayoutGrid } from "lucide-react";
import { useAuth } from "../auth/AuthContext.jsx";

const HIGHLIGHTS = [
  { Icon: LayoutGrid, text: "Manage every chapter's content from one console" },
  { Icon: CalendarDays, text: "Events, registrations, blogs, team & submissions" },
  { Icon: Users2, text: "Role-based access, scoped to your university" },
];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await login(email.trim(), password);
      const to = location.state?.from?.pathname || "/admin";
      navigate(to, { replace: true });
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="csa-admin">
      <div className="csa-auth">
        {/* Brand panel */}
        <aside className="csa-auth-brand">
          <div className="csa-auth-brand-inner">
            <div className="csa-auth-logobox">
              <img src="/logo/navbar-csa.png" alt="CSA Uttarakhand" width={986} height={253} />
            </div>
            <h1 className="csa-auth-brandname">
              Admin <span>Console</span>
            </h1>
            <p className="csa-auth-tagline">
              Cloud Security Alliance - Student Chapter platform for universities
              across Uttarakhand.
            </p>
            <ul className="csa-auth-highlights">
              {HIGHLIGHTS.map(({ Icon, text }) => (
                <li key={text}>
                  <span className="csa-auth-hl-icon"><Icon /></span>
                  {text}
                </li>
              ))}
            </ul>
            <div className="csa-auth-badge">
              <ShieldCheck /> Secure admin access
            </div>
          </div>
        </aside>

        {/* Form panel */}
        <main className="csa-auth-form">
          <form className="csa-auth-card" onSubmit={submit}>
            <div className="csa-auth-form-logo">
              <img src="/logo/navbar-csa.png" alt="CSA Uttarakhand" width={986} height={253} />
            </div>
            <h2>Welcome back</h2>
            <p>Sign in to your chapter admin console.</p>
            {error && <div className="csa-error-banner">{error}</div>}
            <div className="csa-field">
              <label className="csa-label">Email address</label>
              <input
                className="csa-admin-input"
                type="email"
                autoComplete="username"
                placeholder="you@university.ac.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>
            <div className="csa-field">
              <label className="csa-label">Password</label>
              <input
                className="csa-admin-input"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button className="csa-btn csa-btn-primary csa-auth-submit" disabled={busy}>
              {busy ? <span className="csa-spin" /> : "Sign in"}
            </button>
            <p className="csa-auth-help">
              Forgot your password? Ask your platform administrator to reset it.
            </p>
          </form>
          <div className="csa-auth-footer">© CSA Uttarakhand · Multi-chapter platform</div>
        </main>
      </div>
    </div>
  );
}
