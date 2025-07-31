import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';

interface BiometricLoginProps {
  onSuccess: () => void;
  onError?: (error: string) => void;
}

const BiometricLogin: React.FC<BiometricLoginProps> = ({ onSuccess, onError }) => {
  const [isLoading, setIsLoading] = useState(false);

  const checkBiometricSupport = async () => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      
      if (!hasHardware) {
        Alert.alert('Error', 'Biometric authentication is not available on this device');
        return false;
      }
      
      if (!isEnrolled) {
        Alert.alert('Error', 'No biometric data is enrolled on this device');
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Biometric check error:', error);
      return false;
    }
  };

  const handleBiometricAuth = async () => {
    setIsLoading(true);
    
    try {
      const isSupported = await checkBiometricSupport();
      if (!isSupported) {
        setIsLoading(false);
        return;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to access your account',
        cancelLabel: 'Cancel',
        fallbackLabel: 'Use Password',
        requireConfirmation: false,
      });

      if (result.success) {
        onSuccess();
      } else {
        const errorMsg = result.error || 'Biometric authentication failed';
        onError?.(errorMsg);
        Alert.alert('Authentication Failed', errorMsg);
      }
    } catch (error) {
      const errorMsg = 'Biometric authentication error occurred';
      onError?.(errorMsg);
      Alert.alert('Error', errorMsg);
      console.error('Biometric auth error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleBiometricAuth}
        disabled={isLoading}
        accessibilityLabel="Biometric Login"
        accessibilityHint="Use fingerprint or face recognition to log in"
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'Authenticating...' : '🔐 Biometric Login'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#999',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default BiometricLogin;
