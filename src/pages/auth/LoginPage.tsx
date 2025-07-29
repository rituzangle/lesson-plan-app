import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';

// Placeholder components for now
const VoiceInput: React.FC<any> = ({ placeholder }) => (
  <View style={styles.placeholderContainer}>
    <Text style={styles.placeholderText}>Voice Input: {placeholder}</Text>
  </View>
);
const QRCodeLogin: React.FC<any> = () => (
  <View style={styles.placeholderContainer}>
    <Text style={styles.placeholderText}>QR Code Login</Text>
  </View>
);
const BiometricLogin: React.FC<any> = () => (
  <View style={styles.placeholderContainer}>
    <Text style={styles.placeholderText}>Biometric Login</Text>
  </View>
);

interface LoginForm {
  email: string;
  password: string;
}

export const LoginPage: React.FC = () => {
  const [form, setForm] = useState<LoginForm>({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inputMethod, setInputMethod] = useState<'keyboard' | 'voice' | 'qr' | 'biometric'>('keyboard');
  const [showPassword, setShowPassword] = useState(false);
  const [attempts, setAttempts] = useState(0);
  
  const { signIn, signInWithOAuth, announceToScreenReader } = useAuth();
  const navigation = useNavigation();

  // Handle form submission
  const handleSubmit = async () => {
    setError(null);
    setIsLoading(true);

    try {
      await signIn(form.email, form.password);
      announceToScreenReader('Login successful, redirecting to dashboard');
      navigation.navigate('AppStack', { screen: 'Dashboard' });
    } catch (err: any) {
      setError(err.message || 'Login failed');
      setAttempts(prev => prev + 1);
      announceToScreenReader(`Login failed: ${err.message}`);
      Alert.alert('Login Failed', err.message || 'Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OAuth login
  const handleOAuthLogin = async (provider: 'google' | 'apple') => {
    setError(null);
    setIsLoading(true);

    try {
      await signInWithOAuth(provider);
      announceToScreenReader(`Signing in with ${provider}`);
    } catch (err: any) {
      setError(err.message || `${provider} login failed`);
      announceToScreenReader(`${provider} login failed: ${err.message}`);
      Alert.alert(`${provider} Login Failed`, err.message || 'Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle voice input results
  const handleVoiceInput = (field: 'email' | 'password', value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    announceToScreenReader(`${field} filled using voice input`);
  };

  // Handle QR code login
  const handleQRLogin = async (loginData: { email: string; token: string }) => {
    setError(null);
    setIsLoading(true);

    try {
      // Custom QR login logic would go here
      announceToScreenReader('QR code login successful');
      navigation.navigate('AppStack', { screen: 'Dashboard' });
    } catch (err: any) {
      setError(err.message || 'QR login failed');
      announceToScreenReader(`QR login failed: ${err.message}`);
      Alert.alert('QR Login Failed', err.message || 'Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle biometric login
  const handleBiometricLogin = async () => {
    setError(null);
    setIsLoading(true);

    try {
      // Biometric login logic would go here
      announceToScreenReader('Biometric login successful');
      navigation.navigate('AppStack', { screen: 'Dashboard' });
    } catch (err: any) {
      setError(err.message || 'Biometric login failed');
      announceToScreenReader(`Biometric login failed: ${err.message}`);
      Alert.alert('Biometric Login Failed', err.message || 'Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Sign In</Text>
        <Text style={styles.subtitle}>Access your lesson plan dashboard</Text>
      </View>

      {/* Input Method Selector */}
      <View style={styles.inputMethodSelector}>
        <Text style={styles.inputMethodText}>Choose your preferred login method:</Text>
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            onPress={() => setInputMethod('keyboard')}
            style={[styles.methodButton, inputMethod === 'keyboard' && styles.selectedMethodButton]}
            accessibilityRole="button"
            accessibilityState={{ selected: inputMethod === 'keyboard' }}
          >
            <Text style={[styles.methodButtonText, inputMethod === 'keyboard' && styles.selectedMethodButtonText]}>⌨️ Keyboard</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setInputMethod('voice')}
            style={[styles.methodButton, inputMethod === 'voice' && styles.selectedMethodButton]}
            accessibilityRole="button"
            accessibilityState={{ selected: inputMethod === 'voice' }}
          >
            <Text style={[styles.methodButtonText, inputMethod === 'voice' && styles.selectedMethodButtonText]}>🎤 Voice</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setInputMethod('qr')}
            style={[styles.methodButton, inputMethod === 'qr' && styles.selectedMethodButton]}
            accessibilityRole="button"
            accessibilityState={{ selected: inputMethod === 'qr' }}
          >
            <Text style={[styles.methodButtonText, inputMethod === 'qr' && styles.selectedMethodButtonText]}>📱 QR Code</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setInputMethod('biometric')}
            style={[styles.methodButton, inputMethod === 'biometric' && styles.selectedMethodButton]}
            accessibilityRole="button"
            accessibilityState={{ selected: inputMethod === 'biometric' }}
          >
            <Text style={[styles.methodButtonText, inputMethod === 'biometric' && styles.selectedMethodButtonText]}>👤 Biometric</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Error Message */}
      {error && (
        <View 
          style={styles.errorContainer}
          accessibilityLiveRegion="assertive"
        >
          <Text style={styles.errorText}>{error}</Text>
          {attempts >= 3 && (
            <Text style={styles.errorSubText}>
              Having trouble? Try <Text 
                onPress={() => setInputMethod('voice')}
                style={styles.underlineText}
              >
                voice input
              </Text> or contact support.
            </Text>
          )}
        </View>
      )}

      {/* Login Forms based on input method */}
      {inputMethod === 'keyboard' && (
        <View style={styles.formContainer}>
          <View>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              onChangeText={(text) => setForm(prev => ({ ...prev, email: text }))}
              value={form.email}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="Enter your registered email address"
              accessibilityLabel="Email Address"
            />
          </View>

          <View>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={styles.passwordInput}
                onChangeText={(text) => setForm(prev => ({ ...prev, password: text }))}
                value={form.password}
                secureTextEntry={!showPassword}
                placeholder="Enter your password"
                accessibilityLabel="Password"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.passwordVisibilityToggle}
                accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
              >
                <Text style={styles.passwordVisibilityIcon}>
                  {showPassword ? '🙈' : '👁️'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            onPress={handleSubmit}
            disabled={isLoading}
            style={[styles.button, isLoading && styles.buttonDisabled]}
          >
            {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign In</Text>}
          </TouchableOpacity>
        </View>
      )}

      {inputMethod === 'voice' && (
        <View style={styles.voiceInputContainer}>
          <View style={styles.infoBox}>
            <Text style={styles.infoBoxTitle}>Voice Input Mode</Text>
            <Text style={styles.infoBoxText}>
              Click the microphone buttons to speak your email and password
            </Text>
          </View>
          
          <VoiceInput
            onResult={(value: string) => handleVoiceInput('email', value)}
            placeholder="Email Address"
            value={form.email}
            fieldType="email"
          />
          
          <VoiceInput
            onResult={(value: string) => handleVoiceInput('password', value)}
            placeholder="Password"
            value={form.password}
            fieldType="password"
          />
          
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={isLoading || !form.email || !form.password}
            style={[styles.button, (isLoading || !form.email || !form.password) && styles.buttonDisabled]}
          >
            {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign In with Voice</Text>}
          </TouchableOpacity>
        </View>
      )}

      {inputMethod === 'qr' && (
        <QRCodeLogin 
          onLogin={handleQRLogin}
          isLoading={isLoading}
        />
      )}

      {inputMethod === 'biometric' && (
        <BiometricLogin 
          onLogin={handleBiometricLogin}
          isLoading={isLoading}
        />
      )}

      {/* OAuth Options */}
      <View style={styles.oauthContainer}>
        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>Or continue with</Text>
          <View style={styles.divider} />
        </View>

        <View style={styles.oauthButtonGroup}>
          <TouchableOpacity
            onPress={() => handleOAuthLogin('google')}
            disabled={isLoading}
            style={[styles.oauthButton, isLoading && styles.buttonDisabled]}
          >
            {/* Placeholder for Google Icon */}
            <Text style={styles.oauthButtonText}>G</Text>
            <Text style={styles.oauthButtonText}>Google</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => handleOAuthLogin('apple')}
            disabled={isLoading}
            style={[styles.oauthButton, isLoading && styles.buttonDisabled]}
          >
            {/* Placeholder for Apple Icon */}
            <Text style={styles.oauthButtonText}></Text>
            <Text style={styles.oauthButtonText}>Apple</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Don't have an account?{' '}
          <Text style={styles.signUpLink} onPress={() => navigation.navigate('AuthStack', { screen: 'SignUp' })}>
            Sign Up
          </Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  inputMethodSelector: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 15,
  },
  inputMethodText: {
    fontSize: 15,
    color: '#555',
    marginBottom: 10,
  },
  buttonGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  methodButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
  },
  selectedMethodButton: {
    backgroundColor: '#cce0ff',
  },
  methodButtonText: {
    fontSize: 14,
    color: '#333',
  },
  selectedMethodButtonText: {
    color: '#0056b3',
  },
  errorContainer: {
    backgroundColor: '#ffe0e0',
    borderWidth: 1,
    borderColor: '#ffb3b3',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
  },
  errorText: {
    fontSize: 14,
    color: '#cc0000',
  },
  errorSubText: {
    fontSize: 13,
    color: '#990000',
    marginTop: 8,
  },
  underlineText: {
    textDecorationLine: 'underline',
    color: '#0056b3',
  },
  formContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    marginBottom: 15,
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 15,
  },
  passwordInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  passwordVisibilityToggle: {
    padding: 10,
  },
  passwordVisibilityIcon: {
    fontSize: 20,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#a0c8f7',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  voiceInputContainer: {
    marginBottom: 20,
  },
  infoBox: {
    backgroundColor: '#e0f7fa',
    borderWidth: 1,
    borderColor: '#b2ebf2',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
  },
  infoBoxTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00796b',
    marginBottom: 5,
  },
  infoBoxText: {
    fontSize: 14,
    color: '#004d40',
  },
  oauthContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  dividerText: {
    marginHorizontal: 10,
    color: '#666',
    fontSize: 14,
  },
  oauthButtonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 10,
  },
  oauthButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  oauthButtonText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 5,
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#666',
  },
  signUpLink: {
    color: '#007bff',
    fontWeight: 'bold',
  },
  placeholderContainer: {
    padding: 15,
    backgroundColor: '#ffe0b2',
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  placeholderText: {
    color: '#e65100',
    fontSize: 14,
  },
});
