// src/pages/ProfilePage.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Switch,
} from 'react-native';
import { useAuth } from '../components/AuthContext';

interface ProfilePageProps {
  navigation?: any;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ navigation }) => {
  const { 
    userProfile, 
    updateProfile, 
    updateAccessibilitySettings,
    signOut,
    announceToScreenReader,
    loading 
  } = useAuth();

  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });
  const [accessibilitySettings, setAccessibilitySettings] = useState({
    highContrast: false,
    fontSize: 'medium' as 'small' | 'medium' | 'large' | 'xl',
    voiceEnabled: false,
    screenReader: false,
    keyboardNavigation: false,
    reducedMotion: false,
  });
  const [saving, setSaving] = useState(false);

  // Initialize form data when user profile loads
  useEffect(() => {
    if (userProfile) {
      setFormData({
        firstName: userProfile.firstName || '',
        lastName: userProfile.lastName || '',
        email: userProfile.email || '',
      });
      
      if (userProfile.accessibilitySettings) {
        setAccessibilitySettings({
          highContrast: userProfile.accessibilitySettings.highContrast || false,
          fontSize: userProfile.accessibilitySettings.fontSize || 'medium',
          voiceEnabled: userProfile.accessibilitySettings.voiceEnabled || false,
          screenReader: userProfile.accessibilitySettings.screenReader || false,
          keyboardNavigation: userProfile.accessibilitySettings.keyboardNavigation || false,
          reducedMotion: userProfile.accessibilitySettings.reducedMotion || false,
        });
      }
    }
  }, [userProfile]);

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Update profile info
      await updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
      });
      
      // Update accessibility settings
      await updateAccessibilitySettings(accessibilitySettings);
      
      setEditing(false);
      announceToScreenReader('Profile updated successfully');
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', error.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset form data
    if (userProfile) {
      setFormData({
        firstName: userProfile.firstName || '',
        lastName: userProfile.lastName || '',
        email: userProfile.email || '',
      });
    }
    setEditing(false);
    announceToScreenReader('Edit cancelled');
  };

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
              announceToScreenReader('Signed out successfully');
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to sign out');
            }
          },
        },
      ]
    );
  };

  const updateAccessibility = (key: keyof typeof accessibilitySettings, value: any) => {
    setAccessibilitySettings(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  if (!userProfile) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Profile Settings</Text>
        <Text style={styles.subtitle}>Manage your account and preferences</Text>
      </View>

      {/* Profile Information Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          {!editing && (
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setEditing(true)}
              accessibilityRole="button"
              accessibilityLabel="Edit profile information"
            >
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>First Name</Text>
          <TextInput
            style={[styles.input, !editing && styles.inputDisabled]}
            value={formData.firstName}
            onChangeText={(text) => setFormData(prev => ({ ...prev, firstName: text }))}
            editable={editing}
            accessibilityLabel="First name"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Last Name</Text>
          <TextInput
            style={[styles.input, !editing && styles.inputDisabled]}
            value={formData.lastName}
            onChangeText={(text) => setFormData(prev => ({ ...prev, lastName: text }))}
            editable={editing}
            accessibilityLabel="Last name"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, styles.inputDisabled]}
            value={formData.email}
            editable={false}
            accessibilityLabel="Email address (read only)"
          />
          <Text style={styles.helperText}>Email cannot be changed</Text>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Role</Text>
          <View style={styles.roleContainer}>
            <Text style={styles.roleText}>{userProfile.role}</Text>
            <Text style={styles.roleBadge}>
              {userProfile.role === 'admin' ? '👑' : 
               userProfile.role === 'teacher' ? '👩‍🏫' : '🎓'}
            </Text>
          </View>
        </View>

        {editing && (
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleCancel}
              accessibilityRole="button"
              accessibilityLabel="Cancel editing"
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={handleSave}
              disabled={saving}
              accessibilityRole="button"
              accessibilityLabel="Save changes"
            >
              {saving ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Text style={styles.saveButtonText}>Save</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Accessibility Settings Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Accessibility Settings</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingContent}>
            <Text style={styles.settingLabel}>High Contrast Mode</Text>
            <Text style={styles.settingDescription}>Increase visual contrast</Text>
          </View>
          <Switch
            value={accessibilitySettings.highContrast}
            onValueChange={(value) => updateAccessibility('highContrast', value)}
            accessibilityLabel="Toggle high contrast mode"
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingContent}>
            <Text style={styles.settingLabel}>Screen Reader Support</Text>
            <Text style={styles.settingDescription}>Enhanced screen reader compatibility</Text>
          </View>
          <Switch
            value={accessibilitySettings.screenReader}
            onValueChange={(value) => updateAccessibility('screenReader', value)}
            accessibilityLabel="Toggle screen reader support"
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingContent}>
            <Text style={styles.settingLabel}>Voice Announcements</Text>
            <Text style={styles.settingDescription}>Audio feedback for actions</Text>
          </View>
          <Switch
            value={accessibilitySettings.voiceEnabled}
            onValueChange={(value) => updateAccessibility('voiceEnabled', value)}
            accessibilityLabel="Toggle voice announcements"
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingContent}>
            <Text style={styles.settingLabel}>Keyboard Navigation</Text>
            <Text style={styles.settingDescription}>Enhanced keyboard support</Text>
          </View>
          <Switch
            value={accessibilitySettings.keyboardNavigation}
            onValueChange={(value) => updateAccessibility('keyboardNavigation', value)}
            accessibilityLabel="Toggle keyboard navigation"
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingContent}>
            <Text style={styles.settingLabel}>Reduced Motion</Text>
            <Text style={styles.settingDescription}>Minimize animations</Text>
          </View>
          <Switch
            value={accessibilitySettings.reducedMotion}
            onValueChange={(value) => updateAccessibility('reducedMotion', value)}
            accessibilityLabel="Toggle reduced motion"
          />
        </View>

        {/* Font Size Setting */}
        <View style={styles.settingItem}>
          <View style={styles.settingContent}>
            <Text style={styles.settingLabel}>Font Size</Text>
            <View style={styles.fontSizeButtons}>
              {(['small', 'medium', 'large', 'xl'] as const).map((size) => (
                <TouchableOpacity
                  key={size}
                  style={[
                    styles.fontSizeButton,
                    accessibilitySettings.fontSize === size && styles.fontSizeButtonActive
                  ]}
                  onPress={() => updateAccessibility('fontSize', size)}
                  accessibilityRole="button"
                  accessibilityLabel={`Set font size to ${size}`}
                >
                  <Text style={[
                    styles.fontSizeButtonText,
                    accessibilitySettings.fontSize === size && styles.fontSizeButtonTextActive
                  ]}>
                    {size.charAt(0).toUpperCase() + size.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </View>

      {/* Account Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        
        <TouchableOpacity
          style={[styles.button, styles.signOutButton]}
          onPress={handleSignOut}
          accessibilityRole="button"
          accessibilityLabel="Sign out of account"
        >
          <Text style={styles.signOutButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      {/* Version Info */}
      <View style={styles.versionContainer}>
        <Text style={styles.versionText}>Lesson Plan App v1.0.0</Text>
        <Text style={styles.versionText}>
          User ID: {userProfile.id.substring(0, 8)}...
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  contentContainer: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#64748b',
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
  },
  section: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  editButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#2563eb',
    borderRadius: 6,
  },
  editButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1f2937',
    backgroundColor: '#ffffff',
  },
  inputDisabled: {
    backgroundColor: '#f9fafb',
    color: '#6b7280',
  },
  helperText: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  roleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
  },
  roleText: {
    fontSize: 16,
    color: '#1f2937',
    textTransform: 'capitalize',
    flex: 1,
  },
  roleBadge: {
    fontSize: 20,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f3f4f6',
    marginRight: 8,
  },
  cancelButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: '#2563eb',
    marginLeft: 8,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
  signOutButton: {
    backgroundColor: '#dc2626',
  },
  signOutButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  settingContent: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
  fontSizeButtons: {
    flexDirection: 'row',
    marginTop: 8,
  },
  fontSizeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#d1d5db',
    marginRight: 8,
    backgroundColor: '#ffffff',
  },
  fontSizeButtonActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  fontSizeButtonText: {
    fontSize: 12,
    color: '#374151',
  },
  fontSizeButtonTextActive: {
    color: '#ffffff',
  },
  versionContainer: {
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 16,
  },
  versionText: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 2,
  },
});

export default ProfilePa