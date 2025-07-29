import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { authService } from '../services/authService';
import { AccessibilityInfo, View, Text, StyleSheet, ActivityIndicator } from 'react-native';

export type UserRole = 'admin' | 'teacher' | 'student';

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  schoolId?: string;
  classIds?: string[];
  createdAt: string;
  updatedAt: string;
  accessibilitySettings?: {
    highContrast: boolean;
    fontSize: 'small' | 'medium' | 'large' | 'xl';
    voiceEnabled: boolean;
    screenReader: boolean;
    keyboardNavigation: boolean;
    reducedMotion: boolean;
  };
}

export interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  
  signUp: (email: string, password: string, userData: Partial<UserProfile>) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithOAuth: (provider: 'google' | 'apple') => Promise<void>;
  signOut: () => Promise<void>;
  
  hasRole: (role: UserRole | UserRole[]) => boolean;
  isAdmin: () => boolean;
  isTeacher: () => boolean;
  isStudent: () => boolean;
  
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  updateAccessibilitySettings: (settings: Partial<UserProfile['accessibilitySettings']>) => Promise<void>;
  
  announceToScreenReader: (message: string) => void;
  
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const announceToScreenReader = (message: string) => {
    AccessibilityInfo.announceForAccessibility(message);
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        
        if (initialSession) {
          setSession(initialSession);
          setUser(initialSession.user);
          await fetchUserProfile(initialSession.user.id);
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        setError('Failed to initialize authentication');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchUserProfile(session.user.id);
          announceToScreenReader(`Welcome back, ${session.user.email}`);
        } else {
          setUserProfile(null);
          announceToScreenReader('You have been signed out');
        }
        
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const profile = await authService.getUserProfile(userId);
      setUserProfile(profile);
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError('Failed to load user profile');
    }
  };

  const signUp = async (email: string, password: string, userData: Partial<UserProfile>) => {
    try {
      setLoading(true);
      setError(null);
      
      const { user: newUser } = await authService.signUp(email, password, userData);
      
      announceToScreenReader(`Account created successfully for ${email}`);
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
      announceToScreenReader(`Error creating account: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      await authService.signIn(email, password);
      
      announceToScreenReader(`Successfully signed in as ${email}`);
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
      announceToScreenReader(`Sign in failed: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signInWithOAuth = async (provider: 'google' | 'apple') => {
    try {
      setLoading(true);
      setError(null);
      
      await authService.signInWithOAuth(provider);
      
      announceToScreenReader(`Signing in with ${provider}`);
    } catch (err: any) {
      setError(err.message || `Failed to sign in with ${provider}`);
      announceToScreenReader(`${provider} sign in failed: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await authService.signOut();
      
      setUser(null);
      setUserProfile(null);
      setSession(null);
      
      announceToScreenReader('You have been signed out successfully');
    } catch (err: any) {
      setError(err.message || 'Failed to sign out');
      announceToScreenReader(`Sign out failed: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const hasRole = (roles: UserRole | UserRole[]): boolean => {
    if (!userProfile) return false;
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(userProfile.role);
  };

  const isAdmin = (): boolean => hasRole('admin');
  const isTeacher = (): boolean => hasRole('teacher');
  const isStudent = (): boolean => hasRole('student');

  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      if (!user) throw new Error('No user logged in');
      
      setLoading(true);
      const updatedProfile = await authService.updateUserProfile(user.id, updates);
      setUserProfile(updatedProfile);
      
      announceToScreenReader('Profile updated successfully');
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
      announceToScreenReader(`Profile update failed: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateAccessibilitySettings = async (settings: Partial<UserProfile['accessibilitySettings']>) => {
    try {
      if (!userProfile) throw new Error('No user profile available');
      
      const updatedSettings = {
        ...userProfile.accessibilitySettings,
        ...settings
      };
      
      await updateProfile({ accessibilitySettings: updatedSettings });
      
      announceToScreenReader('Accessibility settings updated');
    } catch (err: any) {
      setError(err.message || 'Failed to update accessibility settings');
      throw err;
    }
  };

  const clearError = () => setError(null);

  const value: AuthContextType = {
    user,
    userProfile,
    session,
    loading,
    error,
    
    signUp,
    signIn,
    signInWithOAuth,
    signOut,
    
    hasRole,
    isAdmin,
    isTeacher,
    isStudent,
    
    updateProfile,
    updateAccessibilitySettings,
    
    announceToScreenReader,
    
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  accessDeniedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  accessDeniedTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  accessDeniedText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
  },
});

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const withRoleAccess = <P extends object>(
  Component: React.ComponentType<P>,
  allowedRoles: UserRole[]
) => {
  return function RoleProtectedComponent(props: P) {
    const { hasRole, loading, userProfile } = useAuth();
    
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>Loading authentication...</Text>
        </View>
      );
    }
    
    if (!userProfile) {
      return (
        <View style={styles.accessDeniedContainer}>
          <Text style={styles.accessDeniedTitle}>Access Denied</Text>
          <Text style={styles.accessDeniedText}>Please sign in to access this page.</Text>
        </View>
      );
    }
    
    if (!hasRole(allowedRoles)) {
      return (
        <View style={styles.accessDeniedContainer}>
          <Text style={styles.accessDeniedTitle}>Access Denied</Text>
          <Text style={styles.accessDeniedText}>You don't have permission to view this page.</Text>
        </View>
      );
    }
    
    return <Component {...props} />;
  };
};

export default AuthContext;
