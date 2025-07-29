import React from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/AuthContext';

export const AccessibilityPage: React.FC = () => {
  const { userProfile, updateAccessibilitySettings } = useAuth();

  const handleSettingChange = async (setting: string, value: any) => {
    await updateAccessibilitySettings({ [setting]: value });
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>
          Accessibility Settings
        </Text>
        <View style={styles.settingItem}>
          <View>
            <Text style={styles.label}>High Contrast</Text>
            <Text style={styles.description}>Increase color contrast for better visibility</Text>
          </View>
          <Switch
            onValueChange={(value) => handleSettingChange('highContrast', value)}
            value={userProfile?.accessibilitySettings?.highContrast || false}
          />
        </View>
        
        <View style={styles.settingItem}>
          <View>
            <Text style={styles.label}>Voice Input</Text>
            <Text style={styles.description}>Enable voice input for forms</Text>
          </View>
          <Switch
            onValueChange={(value) => handleSettingChange('voiceEnabled', value)}
            value={userProfile?.accessibilitySettings?.voiceEnabled || false}
          />
        </View>
        
        <View style={styles.settingItem}>
          <Text style={styles.label}>Font Size</Text>
          {/* React Native Picker would go here for font size selection */}
          <Text style={styles.description}>Current: {userProfile?.accessibilitySettings?.fontSize || 'medium'}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
});