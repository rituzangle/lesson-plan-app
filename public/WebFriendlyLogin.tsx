// WebFriendlyLogin.tsx - Web-optimized login screen  
// Path: src/screens/WebFriendlyLogin.tsx
// Created: 2025-07-28 for lesson-plan-app

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  Dimensions,
} from 'react-native';
import { useAuth } from '../auth/AuthContext';

const { width } = Dimensions.get('window');

interface WebFriendlyLoginProps {
  navigation?: any;
}

export const WebFriendlyLogin: React.FC<WebFriendlyLoginProps> = ({ navigation }) => {
  const { signIn, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Default teacher credentials for testing
  const handleQuickLogin = (userType: 'teacher' | 'demo') => {
    if (userType === 'teacher') {
      setEmail('misskate@school.edu');
      setPassword('jazzy&1taz');
    } else {
      setEmail('demo@lessonplan.app');
      setPassword('demo123');
    }
  };

  const handleLogin = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }
    
    if (!password.trim()) {
      Alert.alert('Error', 'Please enter your password');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    try {
      await signIn(email, password);
      // Navigation handled by AuthContext
    } catch (error: any) {
      Alert.alert(
        'Login Failed', 
        error.message || 'Please check your credentials and try again'
      );
    }
  };

  const isWeb = Platform.OS === 'web';
  const containerWidth = isWeb ? Math.min(width * 0.9, 400) : width * 0.9;

  return (
    <View style={styles.container}>
      <View style={[styles.loginCard, { width: containerWidth }]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>📚 Lesson Plan App</Text>
          <Text style={styles.subtitle}>Welcome back, educator!</Text>
        </View>

        {/* Quick Login Buttons */}
        <View style={styles.quickLoginSection}>
          <Text style={styles.quickLoginTitle}>Quick Login:</Text>
          <View style={styles.quickButtonsRow}>
            <TouchableOpacity
              style={styles.quickButton}
              onPress={() => handleQuickLogin('teacher')}
            >
              <Text style={styles.quickButtonText}>👩‍🏫 Miss Kate</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.quickButton, styles.demoButton]}
              onPress={() => handleQuickLogin('demo')}
            >
              <Text style={styles.quickButtonTextDemo}>🎯 Demo</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Login Form */}
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              placeholder="teacher@school.edu"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              accessibilityLabel="Email address"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, styles.passwordInput]}
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoComplete="current-password"
                accessibilityLabel="Password"
                placeholderTextColor="#999"
              />
              <TouchableOpacity
                style={styles.showPasswordButton}
                onPress={() => setShowPassword(!showPassword)}
                accessibilityLabel={showPassword ? "Hide password" : "Show password"}
              >
                <Text style={styles.showPasswordText}>
                  {showPassword ? '🙈' : '👁️'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.loginButton, loading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={loading}
            accessibilityLabel="Sign in"
          >
            <Text style={styles.loginButtonText}>
              {loading ? 'Signing In...' : 'Sign In'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            New to the app? Contact your administrator for access.
          </Text>
          {isWeb && (
            <Text style={styles.webNote}>
              💡 Optimized for web browsers - mobile apps coming soon!
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    minHeight: Platform.OS === 'web' ? '100vh' : '100%',
  },
  loginCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    maxWidth: 400,
    width: '100%',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  quickLoginSection: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
  },
  quickLoginTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: 12,
    textAlign: 'center',
  },
  quickButtonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  quickButton: {
    flex: 1,
    backgroundColor: '#2196F3',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  demoButton: {
    backgroundColor: '#4CAF50',
  },
  quickButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  quickButtonTextDemo: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  form: {
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#fafafa',
    color: '#333',
    minHeight: 50,
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 50,
  },
  showPasswordButton: {
    position: 'absolute',
    right: 16,
    top: 16,
    padding: 4,
  },
  showPasswordText: {
    fontSize: 18,
  },
  loginButton: {
    backgroundColor: '#1976D2',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  loginButtonDisabled: {
    backgroundColor: '#ccc',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 18,
  },
  webNote: {
    fontSize: 12,
    color: '#4CAF50',
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
});