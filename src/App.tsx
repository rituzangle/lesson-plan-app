import React from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LoadingSpinner } from './components/LoadingSpinner';

// Import your route components
import { LoginPage } from '@pages/auth/LoginPage';
import { SignUpPage } from '@pages/auth/SignUpPage';
import { DashboardPage } from '@pages/DashboardPage';
import { AdminDashboard } from '@pages/admin/AdminDashboard';
import { TeacherDashboard } from '@pages/teacher/TeacherDashboard';
import { StudentDashboard } from '@pages/student/StudentDashboard';
import { ProfilePage } from '@pages/ProfilePage';
import { AccessibilityPage } from '@pages/AccessibilityPage';
import { NotFoundPage } from '@pages/NotFoundPage';

// Import layout components (these might need adjustment if they rely on web-specific divs)
// For now, I'll keep them, but they might need to be replaced with React Native Views
import { AppLayout } from './components/layout/AppLayout';
import { AuthLayout } from './components/layout/AuthLayout';

const Stack = createNativeStackNavigator();

/**
 * Protected Route Component - Requires authentication
 */
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const navigation = useNavigation();

  if (loading) {
    return <LoadingSpinner message="Checking authentication..." />;
  }

  if (!user) {
    // Use navigation.navigate for React Navigation
    React.useEffect(() => {
      navigation.navigate('AuthStack', { screen: 'Login' });
    }, [navigation]);
    return null; // Or a loading indicator while navigating
  }

  return <>{children}</>;
}

/**
 * Public Route Component - Redirects if already authenticated
 */
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const navigation = useNavigation();

  if (loading) {
    return <LoadingSpinner message="Loading..." />;
  }

  if (user) {
    // Use navigation.navigate for React Navigation
    React.useEffect(() => {
      navigation.navigate('AppStack', { screen: 'Dashboard' });
    }, [navigation]);
    return null; // Or a loading indicator while navigating
  }

  return <>{children}</>;
}

/**
 * Role-based Dashboard Router
 */
function DashboardRouter() {
  const { userProfile, loading } = useAuth();
  const navigation = useNavigation();

  if (loading) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  if (!userProfile) {
    React.useEffect(() => {
      navigation.navigate('AuthStack', { screen: 'Login' });
    }, [navigation]);
    return null;
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
 * Main App Component
 */
function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            {/* Auth Stack */}
            <Stack.Screen name="AuthStack" options={{ headerShown: false }}>
              {() => (
                <AuthLayout>
                  <Stack.Navigator screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="Login" component={LoginPage} />
                    <Stack.Screen name="SignUp" component={SignUpPage} />
                  </Stack.Navigator>
                </AuthLayout>
              )}
            </Stack.Screen>

            {/* App Stack */}
            <Stack.Screen name="AppStack" options={{ headerShown: false }}>
              {() => (
                <AppLayout>
                  <Stack.Navigator screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="Dashboard" component={DashboardRouter} />
                    <Stack.Screen name="Profile" component={ProfilePage} />
                    <Stack.Screen name="Accessibility" component={AccessibilityPage} />
                    {/* Add more protected routes here */}
                    <Stack.Screen name="Lessons" component={() => null /* Placeholder for Lessons */} />
                    <Stack.Screen name="Classes" component={() => null /* Placeholder for Classes */} />
                    <Stack.Screen name="Reports" component={() => null /* Placeholder for Reports */} />
                  </Stack.Navigator>
                </AppLayout>
              )}
            </Stack.Screen>

            {/* Not Found */}
            <Stack.Screen name="NotFound" component={NotFoundPage} />
          </Stack.Navigator>
        </NavigationContainer>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
