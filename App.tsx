// App.tsx - Main application entry point with web layout fix
// Path: App.tsx  
// Created: 2025-07-28 for lesson-plan-app (updated for web-first)

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider } from './src/auth/AuthContext';
import { WebLayoutFix } from './src/components/WebLayoutFix';
import { WebFriendlyLogin } from './src/screens/WebFriendlyLogin';
import { TeacherDashboard } from './src/screens/TeacherDashboard';
import { LessonEditor } from './src/screens/LessonEditor';
import { Platform } from 'react-native';

// Import web styles for better layout
if (Platform.OS === 'web') {
  require('./src/assets/emergency-web-styles.css');
}

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <WebLayoutFix>
      <AuthProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Login"
            screenOptions={{
              headerShown: false, // Clean look for web
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
            <Stack.Screen 
              name="LessonEditor" 
              component={LessonEditor}
              options={{
                title: 'Lesson Editor',
                headerShown: true,
                headerBackTitle: 'Back'
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
        <StatusBar style="auto" />
      </AuthProvider>
    </WebLayoutFix>
  );
}