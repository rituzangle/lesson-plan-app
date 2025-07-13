import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { authService } from '../services/authService';

// Types for our multi-role system
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
  // Accessibility preferences
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
  // Core auth state
  user: User | null;
  userProfile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  
  // Auth methods
  signUp: (email: string, password: string, userData: Partial<UserProfile>) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithOAuth: (provider: 'google' | 'apple') => Promise<void>;
  signOut: () => Promise<void>;
  
  // Role management
  hasRole: (role: UserRole | UserRole[]) => boolean;
  isAdmin: () => boolean;
  isTeacher: () => boolean;
  isStudent: () => boolean;
  
  // Profile management
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  updateAccessibilitySettings: (settings: Partial<UserProfile['accessibilitySettings']>) => Promise<void>;
  
  // Accessibility helpers
  announceToScreenReader: (message: string) => void;
  
  // Error handling
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

  // Screen reader announcements
  const announceToScreenReader = (message: string) => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  };

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Get initial session
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

    // Listen for auth changes
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

  // Fetch user profile from database
  const fetchUserProfile = async (userId: string) => {
    try {
      const profile = await authService.getUserProfile(userId);
      setUserProfile(profile);
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError('Failed to load user profile');
    }
  };

  // Sign up new user
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

  // Sign in existing user
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

  // OAuth sign in
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

  // Sign out
  const signOut = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await authService.signOut();
      
      // Clear local state
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

  // Role checking helpers
  const hasRole = (roles: UserRole | UserRole[]): boolean => {
    if (!userProfile) return false;
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(userProfile.role);
  };

  const isAdmin = (): boolean => hasRole('admin');
  const isTeacher = (): boolean => hasRole('teacher');
  const isStudent = (): boolean => hasRole('student');

  // Update user profile
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

  // Update accessibility settings
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

  // Clear error state
  const clearError = () => setError(null);

  const value: AuthContextType = {
    // State
    user,
    userProfile,
    session,
    loading,
    error,
    
    // Methods
    signUp,
    signIn,
    signInWithOAuth,
    signOut,
    
    // Role helpers
    hasRole,
    isAdmin,
    isTeacher,
    isStudent,
    
    // Profile management
    updateProfile,
    updateAccessibilitySettings,
    
    // Accessibility
    announceToScreenReader,
    
    // Error handling
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Higher-order component for role-based access
export const withRoleAccess = <P extends object>(
  Component: React.ComponentType<P>,
  allowedRoles: UserRole[]
) => {
  return function RoleProtectedComponent(props: P) {
    const { hasRole, loading, userProfile } = useAuth();
    
    if (loading) {
      return (
        <div 
          className="flex items-center justify-center p-8"
          role="status"
          aria-live="polite"
        >
          <span className="sr-only">Loading authentication...</span>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      );
    }
    
    if (!userProfile) {
      return (
        <div 
          className="text-center p-8"
          role="alert"
          aria-live="assertive"
        >
          <h2 className="text-xl font-semibold mb-4">Access Denied</h2>
          <p>Please sign in to access this page.</p>
        </div>
      );
    }
    
    if (!hasRole(allowedRoles)) {
      return (
        <div 
          className="text-center p-8"
          role="alert"
          aria-live="assertive"
        >
          <h2 className="text-xl font-semibold mb-4">Access Denied</h2>
          <p>You don't have permission to view this page.</p>
        </div>
      );
    }
    
    return <Component {...props} />;
  };
};

export default AuthContext;