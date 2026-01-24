import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { AuthProvider, useAuth } from "./modules/auth/context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";

// Layout & Protection
import AppShell from "./shared/components/layout/AppShell";
import ProtectedRoute from "./shared/components/layout/ProtectedRoute";

// Auth pages (PUBLIC)
import LoginPage from "./modules/auth/pages/LoginPage";
import ForgotPasswordPage from "./modules/auth/pages/ForgotPasswordPage";
import ResetPasswordPage from "./modules/auth/pages/ResetPasswordPage";

// Knowledge Base pages
import Search from "./pages/Search";
import ArticleDetails from "./pages/ArticleDetails";
import CreateArticle from "./pages/CreateArticle";
import EditArticle from "./pages/EditArticle";

// Admin pages
import UserManagementPage from "./modules/admin/pages/UserManagementPage";
import OrganizationSettingsPage from "./modules/admin/pages/OrganizationSettingsPage";

// Misc
import UnderDevelopmentPage from "./shared/pages/UnderDevelopmentPage";

/* ---------- Role-Based Default Redirect ---------- */
const DefaultRedirect = () => {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  const role = user.role?.toLowerCase();

  if (role === "admin" || role === "superadmin") {
    return <Navigate to="/admin/users" replace />;
  }

  return <Navigate to="/search" replace />;
};

/* ---------- App ---------- */
function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: { background: "#363636", color: "#fff" }
            }}
          />

          <Routes>
            {/* ================= PUBLIC AUTH ROUTES ================= */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

            {/* ================= PROTECTED APP ROUTES ================= */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <AppShell />
                </ProtectedRoute>
              }
            >
              {/* Default Landing */}
              <Route index element={<DefaultRedirect />} />

              {/* Knowledge Base */}
              <Route path="search" element={<Search />} />
              <Route path="article/:id" element={<ArticleDetails />} />

              {/* Admin: Knowledge Base */}
              <Route
                path="admin/create"
                element={
                  <ProtectedRoute allowedRoles={["SuperAdmin", "Admin","Trainer"]}>
                    <CreateArticle />
                  </ProtectedRoute>
                }
              />

              <Route
                path="admin/edit/:id"
                element={
                  <ProtectedRoute allowedRoles={["SuperAdmin", "Admin","Trainer"]}>
                    <EditArticle />
                  </ProtectedRoute>
                }
              />

              {/* Admin: System */}
              <Route
                path="admin/users"
                element={
                  <ProtectedRoute allowedRoles={["SuperAdmin", "Admin"]}>
                    <UserManagementPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="admin/organization"
                element={
                  <ProtectedRoute allowedRoles={["SuperAdmin", "Admin"]}>
                    <OrganizationSettingsPage />
                  </ProtectedRoute>
                }
              />

              {/* Misc */}
              <Route path="under-development" element={<UnderDevelopmentPage />} />
            </Route>

            {/* ================= FALLBACK ================= */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
