import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LoadingSpinner } from './components/LoadingSpinner';

// Import your route components
import { LoginPage } from './pages/auth/LoginPage';
import { SignUpPage } from './pages/auth/SignUpPage';
import { DashboardPage } from './pages/DashboardPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { TeacherDashboard } from './pages/teacher/TeacherDashboard';
import { StudentDashboard } from './pages/student/StudentDashboard';
import { ProfilePage } from './pages/ProfilePage';
import { AccessibilityPage } from './pages/AccessibilityPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Import layout components
import { AppLayout } from './components/layout/AppLayout';
import { AuthLayout } from './components/layout/AuthLayout';

// Accessibility CSS classes for screen reader support
const accessibilityStyles = `
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
  
  .skip-link {
    position: absolute;
    top: -40px;
    left: 6px;
    background: #000;
    color: #fff;
    padding: 8px;
    text-decoration: none;
    border-radius: 4px;
    z-index: 1000;
  }
  
  .skip-link:focus {
    top: 6px;
  }
`;

/**
 * Protected Route Component - Requires authentication
 */
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner message="Checking authentication..." />;
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  return <>{children}</>;
}

/**
 * Public Route Component - Redirects if already authenticated
 */
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner message="Loading..." />;
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

/**
 * Role-based Dashboard Router
 */
function DashboardRouter() {
  const { userProfile, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  if (!userProfile) {
    return <Navigate to="/auth/login" replace />;
  }

  // Route based on user role
  switch (userProfile.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'teacher':
      return <TeacherDashboard />;
    case 'student':
      return <StudentDashboard />;
    default:
      return <DashboardPage />;
  }
}

/**
 * App Routes Component
 */
function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/auth" element={<AuthLayout />}>
        <Route
          path="login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="signup"
          element={
            <PublicRoute>
              <SignUpPage />
            </PublicRoute>
          }
        />
      </Route>

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardRouter />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="accessibility" element={<AccessibilityPage />} />
        
        {/* Add more protected routes here */}
        <Route path="lessons/*" element={<div>Lessons coming soon</div>} />
        <Route path="classes/*" element={<div>Classes coming soon</div>} />
        <Route path="reports/*" element={<div>Reports coming soon</div>} />
      </Route>

      {/* Catch all - 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

/**
 * Main App Component
 */
function App() {
  React.useEffect(() => {
    // Inject accessibility styles
    const style = document.createElement('style');
    style.textContent = accessibilityStyles;
    document.head.appendChild(style);

    // Set up keyboard navigation
    const handleKeyDown = (event: KeyboardEvent) => {
      // Alt + / for accessibility menu
      if (event.altKey && event.key === '/') {
        event.preventDefault();
        const accessibilityMenu = document.querySelector('[data-accessibility-menu]');
        if (accessibilityMenu) {
          (accessibilityMenu as HTMLElement).focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <ErrorBoundary>
      <div className="App">
        {/* Skip to main content link for screen readers */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>

        {/* Screen reader announcements region */}
        <div
          id="screen-reader-announcements"
          aria-live="polite"
          aria-atomic="true"
          className="sr-only"
        />

        <AuthProvider>
          <Router>
            <AppRoutes />
          </Router>
        </AuthProvider>
      </div>
    </ErrorBoundary>
  );
}

export default App;