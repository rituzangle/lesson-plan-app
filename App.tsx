// App.tsx - Main application entry point (ROOT LEVEL)
// Path: App.tsx  

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { createStackNavigator } from '@react-navigation/stack'; // instead of native stack
import 'react-native-gesture-handler'; // Required for navigation
import 'react-native-reanimated'; // Required for navigation
import 'react-native-screens'; // Required for navigation
import 'react-native-safe-area-context'; // Required for navigation
import 'expo-dev-client'; // Required for development client
import { enableScreens } from 'react-native-screens'; // Required for navigation
enableScreens(); // Enable screens for better performance
import { NavigationContainer } from '@react-navigation/native'; // Required for navigation
import { Platform, StyleSheet } from 'react-native';

// Import from actual src/ structure in your repo
import { WebLayoutFix } from './src/components/WebLayoutFix';
import { WebFriendlyLogin } from './src/screens/WebFriendlyLogin';
import { TeacherDashboard } from './src/screens/TeacherDashboard';

const Stack = createStackNavigator();
// Import emergency styles for web
// import './src/styles/emergencyStyles.css'; not supported in React Native
// Emergency CSS loading for web
// if (Platform.OS === 'web') {
//   // Try to load emergency CSS from public folder
//   const link = document.createElement('link');
//   link.rel = 'stylesheet';
//   link.href = '/emergency-web-styles.css';
//   document.head.appendChild(link);
// }
// const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <WebLayoutFix>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerShown: false,
            // Removed contentStyle, not supported in StackNavigationOptions
            // If you want to set background color, use a wrapper or cardStyle for native-stack
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
// Styles for the app
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa', // Default background color
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});
// Note: The styles above are not used in the WebLayoutFix component,
// but can be used in other components or screens as needed.
// This file serves as the main entry point for the application,
// setting up navigation and wrapping the app in the WebLayoutFix component.
// This ensures that the WebLayoutFix component is applied globally
// to all screens in the app, providing a consistent layout and styling.
