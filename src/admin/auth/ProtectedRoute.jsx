// Gate admin routes behind an authenticated session. While the session is
// restoring we render a lightweight loader to avoid a login flash.
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";
import CsaLoader from "../components/CsaLoader.jsx";

export default function ProtectedRoute({ children, roles }) {
  const { me, loading, hasRole } = useAuth();
  const location = useLocation();

  if (loading) {
    return <CsaLoader label="Restoring session" />;
  }
  if (!me) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }
  if (roles && !hasRole(...roles)) {
    return <div className="csa-admin-forbidden">You don’t have access to this section.</div>;
  }
  return children;
}
