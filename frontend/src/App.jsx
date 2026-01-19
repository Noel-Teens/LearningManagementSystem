import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './modules/auth/context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Layout components
import AppShell from './shared/components/layout/AppShell';
import ProtectedRoute from './shared/components/layout/ProtectedRoute';

// Auth pages
import LoginPage from './modules/auth/pages/LoginPage';
import ForgotPasswordPage from './modules/auth/pages/ForgotPasswordPage';
import ResetPasswordPage from './modules/auth/pages/ResetPasswordPage';

// Shared pages
import UnderDevelopmentPage from './shared/pages/UnderDevelopmentPage';

// Admin pages
import UserManagementPage from './modules/admin/pages/UserManagementPage';
import OrganizationSettingsPage from './modules/admin/pages/OrganizationSettingsPage';

const DefaultRedirect = () => {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;

  const isStaff = user.role === 'SuperAdmin' || user.role === 'Admin';
  return <Navigate to={isStaff ? "/admin/users" : "/under-development"} replace />;
};

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                iconTheme: {
                  primary: '#10B981',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#fff',
                },
              },
            }}
          />

          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

            <Route path="/under-development" element={
              <ProtectedRoute>
                <UnderDevelopmentPage />
              </ProtectedRoute>
            } />

            {/* Admin routes */}
            <Route path="/admin/users" element={
              <ProtectedRoute allowedRoles={['SuperAdmin', 'Admin']}>
                <AppShell>
                  <UserManagementPage />
                </AppShell>
              </ProtectedRoute>
            } />

            <Route path="/admin/organization" element={
              <ProtectedRoute allowedRoles={['SuperAdmin', 'Admin']}>
                <AppShell>
                  <OrganizationSettingsPage />
                </AppShell>
              </ProtectedRoute>
            } />

            {/* Default redirect */}
            <Route path="/" element={<DefaultRedirect />} />
            <Route path="*" element={<DefaultRedirect />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
