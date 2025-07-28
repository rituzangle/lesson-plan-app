// App.tsx - Main application entry point
import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, Platform } from 'react-native';
import { AuthProvider } from './src/components/AuthContext';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Import screens
import LessonList from './src/screens/LessonList';
import LessonEditor from './src/screens/LessonEditor';

// Import components
import UserGreeting from './src/components/UserGreeting';
import StorageStats from './src/components/StorageStats';

// Create navigation stack
const Stack = createNativeStackNavigator();

// Main navigation component
function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'Lesson Plan App' }}
        />
        <Stack.Screen 
          name="LessonList" 
          component={LessonList} 
          options={{ title: 'My Lessons' }}
        />
        <Stack.Screen 
          name="LessonEditor" 
          component={LessonEditor} 
          options={{ title: 'Edit Lesson' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Home screen component
function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lesson Plan App</Text>
      <UserGreeting />
      <StorageStats />
      <StatusBar style="auto" />
    </View>
  );
}

// Error boundary component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('App Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Something went wrong</Text>
          <Text style={styles.errorMessage}>
            {this.state.error?.message || 'An unexpected error occurred'}
          </Text>
          <Text style={styles.errorHelper}>
            Please restart the app or check the console for details.
          </Text>
        </View>
      );
    }

    return this.props.children;
  }
}

// Main App component
export default function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // App initialization
    const initializeApp = async () => {
      try {
        // Add any initialization logic here
        console.log('App initializing...');
        
        // Simulate initialization time
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        console.log('App initialization complete');
        setIsReady(true);
      } catch (error) {
        console.error('App initialization error:', error);
        setIsReady(true); // Still set to true to prevent infinite loading
      }
    };

    initializeApp();
  }, []);

  // Loading screen
  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  // Main app with providers
  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <AuthProvider>
          <AppNavigator />
        </AuthProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#d32f2f',
    marginBottom: 10,
  },
  errorMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  errorHelper: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});