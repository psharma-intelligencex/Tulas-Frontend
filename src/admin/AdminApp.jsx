// Self-contained admin CMS mounted at /admin/* by the public App router. Has
// its own nested routes, auth provider, and styling - it never renders the
// public site's Navbar/Contact chrome.
import { Routes, Route, Navigate } from "react-router-dom";
import "./admin.css";
import { AuthProvider } from "./auth/AuthContext.jsx";
import ProtectedRoute from "./auth/ProtectedRoute.jsx";
import AdminLayout from "./layout/AdminLayout.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Submissions from "./pages/Submissions.jsx";
import Platform from "./pages/Platform.jsx";
import ResourceList from "./components/ResourceList.jsx";
import ResourceForm from "./components/ResourceForm.jsx";

const PLATFORM = ["super_admin", "csau_admin"];

export default function AdminApp() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="r/:resourceKey" element={<ResourceList />} />
          <Route path="r/:resourceKey/:id" element={<ResourceForm />} />
          <Route path="submissions" element={<Submissions />} />
          <Route path="platform/chapters" element={<ProtectedRoute roles={PLATFORM}><Platform view="chapters" /></ProtectedRoute>} />
          <Route path="platform/users" element={<ProtectedRoute roles={PLATFORM}><Platform view="users" /></ProtectedRoute>} />
          <Route path="platform/audit" element={<ProtectedRoute roles={PLATFORM}><Platform view="audit" /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
