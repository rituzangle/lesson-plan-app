#!/usr/bin/env python3
"""
Create Missing Auth Components
File: scripts/create-missing-auth-components.py

Create the missing authentication components needed by accessibleLogin.tsx
"""

import os
from pathlib import Path

def create_biometric_login():
    """Create BiometricLogin component"""
    return '''import React, { useState } from 'react';
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
'''

def create_voice_input():
    """Create VoiceInput component"""
    return '''import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';

interface VoiceInputProps {
  onVoiceResult: (text: string) => void;
  placeholder?: string;
}

const VoiceInput: React.FC<VoiceInputProps> = ({ onVoiceResult, placeholder = "Tap to speak" }) => {
  const [isListening, setIsListening] = useState(false);

  const startVoiceRecognition = async () => {
    setIsListening(true);
    
    try {
      // Note: This is a placeholder implementation
      // For production, you would integrate with expo-speech or react-native-voice
      Alert.alert(
        'Voice Input',
        'Voice recognition would be implemented here with expo-speech or react-native-voice library',
        [
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => setIsListening(false),
          },
          {
            text: 'Simulate Input',
            onPress: () => {
              // Simulate voice input for development
              onVoiceResult('Hello, this is simulated voice input');
              setIsListening(false);
            },
          },
        ]
      );
    } catch (error) {
      console.error('Voice recognition error:', error);
      Alert.alert('Error', 'Voice recognition failed');
      setIsListening(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, isListening && styles.buttonActive]}
        onPress={startVoiceRecognition}
        disabled={isListening}
        accessibilityLabel="Voice Input"
        accessibilityHint="Tap to use voice input"
      >
        <Text style={styles.buttonText}>
          {isListening ? '🎤 Listening...' : '🎤 Voice Input'}
        </Text>
      </TouchableOpacity>
      {placeholder && !isListening && (
        <Text style={styles.placeholder}>{placeholder}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  button: {
    backgroundColor: '#34C759',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonActive: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  placeholder: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
    marginTop: 5,
  },
});

export default VoiceInput;
'''

def create_qr_code_login():
    """Create QRCodeLogin component"""
    return '''import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';

interface QRCodeLoginProps {
  onQRCodeScan: (data: string) => void;
  onError?: (error: string) => void;
}

const QRCodeLogin: React.FC<QRCodeLoginProps> = ({ onQRCodeScan, onError }) => {
  const [isScanning, setIsScanning] = useState(false);

  const startQRScanner = async () => {
    setIsScanning(true);
    
    try {
      // Note: This is a placeholder implementation
      // For production, you would integrate with expo-camera and expo-barcode-scanner
      Alert.alert(
        'QR Code Scanner',
        'QR code scanning would be implemented here with expo-camera and expo-barcode-scanner',
        [
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => setIsScanning(false),
          },
          {
            text: 'Simulate Scan',
            onPress: () => {
              // Simulate QR code scan for development
              const mockQRData = 'mock-login-token-123456';
              onQRCodeScan(mockQRData);
              setIsScanning(false);
            },
          },
        ]
      );
    } catch (error) {
      const errorMsg = 'QR code scanning failed';
      onError?.(errorMsg);
      Alert.alert('Error', errorMsg);
      console.error('QR scanner error:', error);
      setIsScanning(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, isScanning && styles.buttonActive]}
        onPress={startQRScanner}
        disabled={isScanning}
        accessibilityLabel="QR Code Login"
        accessibilityHint="Scan QR code to log in"
      >
        <Text style={styles.buttonText}>
          {isScanning ? '📷 Scanning...' : '📱 QR Code Login'}
        </Text>
      </TouchableOpacity>
      
      {isScanning && (
        <View style={styles.scanningIndicator}>
          <Text style={styles.scanningText}>
            Point your camera at a QR code
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  button: {
    backgroundColor: '#FF9500',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonActive: {
    backgroundColor: '#FF6B00',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  scanningIndicator: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#F0F0F0',
    borderRadius: 5,
  },
  scanningText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
  },
});

export default QRCodeLogin;
'''

def create_components():
    """Create all missing authentication components"""
    project_root = Path.cwd()
    components_dir = project_root / "src" / "components"
    
    # Ensure components directory exists
    components_dir.mkdir(parents=True, exist_ok=True)
    
    components = [
        ('BiometricLogin.tsx', create_biometric_login()),
        ('VoiceInput.tsx', create_voice_input()),
        ('QRCodeLogin.tsx', create_qr_code_login()),
    ]
    
    created_files = []
    
    for filename, content in components:
        file_path = components_dir / filename
        
        if not file_path.exists():
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            created_files.append(str(file_path.relative_to(project_root)))
            print(f"✅ Created: {file_path.relative_to(project_root)}")
        else:
            print(f"⚠️  Already exists: {file_path.relative_to(project_root)}")
    
    return created_files

def main():
    """Main function to create missing components"""
    print("🔧 Creating missing authentication components...")
    print("=" * 50)
    
    created_files = create_components()
    
    if created_files:
        print(f"\n✅ Successfully created {len(created_files)} components!")
        print("\n📋 Next steps:")
        print("1. Run 'npm start' to test the app")
        print("2. These components use placeholder implementations")
        print("3. For production, install:")
        print("   - expo-local-authentication (for biometrics)")
        print("   - expo-camera + expo-barcode-scanner (for QR codes)")
        print("   - expo-speech (for voice input)")
    else:
        print("ℹ️  All components already exist")
    
    print(f"\n🚀 Ready to test your app!")

if __name__ == "__main__":
    main()
