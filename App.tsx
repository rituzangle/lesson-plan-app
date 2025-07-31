// App.tsx - Main application entry point (ROOT LEVEL)
// Path: App.tsx  

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Platform, View, Text, StyleSheet } from 'react-native';

// Import from actual src/ structure in your repo
import { WebLayoutFix } from './src/components/WebLayoutFix';
import { WebFriendlyLogin } from './src/screens/WebFriendlyLogin';
import { TeacherDashboard } from './src/screens/TeacherDashboard';
import { AuthProvider } from './src/contexts/AuthContext'; //leaving here for context usage

// Import emergency styles for web
// import './src/styles/emergencyStyles.css'; not supported in React Native
// Emergency CSS loading for web
if (Platform.OS === 'web') {
  // Try to load emergency CSS from public folder
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/emergency-web-styles.css';
  document.head.appendChild(link);
}

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <WebLayoutFix>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#f8f9fa' }
          }}
        >
          <Stack.Screen 
            name="Login" 
            component={WebFriendlyLogin}
            options={{
              title: 'Welcome to Lesson Plan App'
            }}
          />
          <Stack.Screen 
            name="TeacherDashboard" 
            component={TeacherDashboard}
            options={{
              title: 'Teacher Dashboard'
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="auto" />
    </WebLayoutFix>
  );
}

// Emergency inline styles for web
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: Platform.OS === 'web' ? '100vw' : '100%',
    minHeight: Platform.OS === 'web' ? '100vh' : '100%',
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0f2f5',
  },
  placeholderTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 16,
    textAlign: 'center',
  },
  placeholderText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
    textAlign: 'center',
  },
  placeholderInfo: {
    fontSize: 14,
    color: '#4CAF50',
    fontFamily: Platform.OS === 'web' ? 'monospace' : 'Courier',
    backgroundColor: '#f5f5f5',
    padding: 8,
    borderRadius: 4,
  },
});
