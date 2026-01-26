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

// Admin pages
import UserManagementPage from './modules/admin/pages/UserManagementPage';
import OrganizationSettingsPage from './modules/admin/pages/OrganizationSettingsPage';

// Course Management pages
import CourseList from './modules/courses/pages/CourseList';
import CourseBuilder from './modules/courses/pages/CourseBuilder';
import TrashBin from './modules/courses/pages/TrashBin';
import LessonViewer from './modules/courses/pages/LessonViewer';
// Knowledge Base pages
import Search from "./pages/Search";
import ArticleDetails from "./pages/ArticleDetails";
import CreateArticle from "./pages/CreateArticle";
import EditArticle from "./pages/EditArticle";

const DefaultRedirect = () => {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
    const role = user.role?.toLowerCase();
  // Trainers go to courses, staff to admin
  if (user.role === 'trainer') {
    return <Navigate to="/courses" replace />;
  }
  if (role === 'learner') {
    return <Navigate to="/search" replace />; }
  return <Navigate to="/admin/users" replace />;
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

            {/* Course Management routes (Trainer only) */}
            <Route path="/courses" element={
              <ProtectedRoute allowedRoles={['Trainer']}>
                <AppShell>
                  <CourseList />
                </AppShell>
              </ProtectedRoute>
            } />

            <Route path="/courses/create" element={
              <ProtectedRoute allowedRoles={['Trainer']}>
                <AppShell>
                  <CourseBuilder />
                </AppShell>
              </ProtectedRoute>
            } />

            <Route path="/courses/trash" element={
              <ProtectedRoute allowedRoles={['Trainer']}>
                <AppShell>
                  <TrashBin />
                </AppShell>
              </ProtectedRoute>
            } />

            <Route path="/courses/:courseId/edit" element={
              <ProtectedRoute allowedRoles={['Trainer']}>
                <AppShell>
                  <CourseBuilder />
                </AppShell>
              </ProtectedRoute>
            } />

            <Route path="/courses/:courseId/modules/:moduleId/lessons/:lessonId" element={
              <ProtectedRoute allowedRoles={['Trainer']}>
                <LessonViewer />
              </ProtectedRoute>
            } />
            
            {/* Knowledge Base */}
              <Route path="/search" element={<AppShell><Search /></AppShell>} />
              <Route path="/article/:id" element={<AppShell><ArticleDetails /></AppShell>} />

              {/* Admin: Knowledge Base */}
              <Route
                path="/admin/create"
                element={
                  <ProtectedRoute allowedRoles={["SuperAdmin", "Admin","Trainer"]}>
                    <AppShell>
                    <CreateArticle />
                    </AppShell>
                  </ProtectedRoute>
                }
              />
             <Route
                path="/admin/edit/:id"
                element={
                  <ProtectedRoute allowedRoles={["SuperAdmin", "Admin","Trainer"]}>
                    <AppShell><EditArticle /></AppShell>
                  </ProtectedRoute>
                }
              />

              {/* Default + fallback */}
<Route path="/" element={<DefaultRedirect />} />


          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
