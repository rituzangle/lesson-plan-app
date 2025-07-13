import { supabase } from '../lib/supabase';
import { AuthError, User } from '@supabase/supabase-js';
import { UserProfile, UserRole } from '../contexts/AuthContext';

interface SignUpData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  schoolId?: string;
}

interface AuthResponse {
  user: User;
  error?: AuthError;
}

/**
 * Authentication service for handling all auth operations with Supabase
 * Includes role-based user management and accessibility features
 */
export class AuthService {
  /**
   * Sign up a new user with role and profile data
   */
  async signUp(email: string, password: string, userData: Partial<UserProfile>): Promise<AuthResponse> {
    try {
      // Step 1: Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            firstName: userData.firstName,
            lastName: userData.lastName,
            role: userData.role
          }
        }
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('No user returned from signup');

      // Step 2: Create user profile in database
      const profileData: Partial<UserProfile> = {
        id: authData.user.id,
        email: authData.user.email!,
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        role: userData.role || 'student',
        schoolId: userData.schoolId,
        classIds: userData.classIds || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        accessibilitySettings: {
          highContrast: false,
          fontSize: 'medium',
          voiceEnabled: false,
          screenReader: false,
          keyboardNavigation: false,
          reducedMotion: false,
          ...userData.accessibilitySettings
        }
      };

      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert(profileData);

      if (profileError) {
        console.error('Profile creation error:', profileError);
        // Note: Don't throw here as auth user is created
        // We'll handle profile creation retry in the UI
      }

      return { user: authData.user };
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  }

  /**
   * Sign in existing user
   */
  async signIn(email: string, password: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      if (!data.user) throw new Error('No user returned from signin');

      return { user: data.user };
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  }

  /**
   * Sign in with OAuth provider
   */
  async signInWithOAuth(provider: 'google' | 'apple'): Promise<void> {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) throw error;
    } catch (error) {
      console.error(`OAuth ${provider} error:`, error);
      throw error;
    }
  }

  /**
   * Sign out current user
   */
  async signOut(): Promise<void> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }

  /**
   * Get user profile from database
   */
  async getUserProfile(userId: string): Promise<UserProfile> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Profile doesn't exist, create a basic one
          return await this.createMissingProfile(userId);
        }
        throw error;
      }

      return data as UserProfile;
    } catch (error) {
      console.error('Get user profile error:', error);
      throw error;
    }
  }

  /**
   * Create a missing profile (fallback)
   */
  private async createMissingProfile(userId: string): Promise<UserProfile> {
    try {
      // Get user info from auth
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      const basicProfile: UserProfile = {
        id: userId,
        email: user.email!,
        firstName: user.user_metadata?.firstName || '',
        lastName: user.user_metadata?.lastName || '',
        role: user.user_metadata?.role || 'student',
        schoolId: user.user_metadata?.schoolId,
        classIds: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        accessibilitySettings: {
          highContrast: false,
          fontSize: 'medium',
          voiceEnabled: false,
          screenReader: false,
          keyboardNavigation: false,
          reducedMotion: false
        }
      };

      const { data, error } = await supabase
        .from('user_profiles')
        .insert(basicProfile)
        .select()
        .single();

      if (error) throw error;
      return data as UserProfile;
    } catch (error) {
      console.error('Create missing profile error:', error);
      throw error;
    }
  }

  /**
   * Update user profile
   */
  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update({
          ...updates,
          updatedAt: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return data as UserProfile;
    } catch (error) {
      console.error('Update user profile error:', error);
      throw error;
    }
  }

  /**
   * Reset password
   */
  async resetPassword(email: string): Promise<void> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      });

      if (error) throw error;
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  }

  /**
   * Update password
   */
  async updatePassword(newPassword: string): Promise<void> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;
    } catch (error) {
      console.error('Update password error:', error);
      throw error;
    }
  }

  /**
   * Get all users by role (admin only)
   */
  async getUsersByRole(role: UserRole): Promise<UserProfile[]> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('role', role)
        .order('createdAt', { ascending: false });

      if (error) throw error;
      return data as UserProfile[];
    } catch (error) {
      console.error('Get users by role error:', error);
      throw error;
    }
  }

  /**
   * Get users by school (admin/teacher only)
   */
  async getUsersBySchool(schoolId: string): Promise<UserProfile[]> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('schoolId', schoolId)
        .order('role', { ascending: true });

      if (error) throw error;
      return data as UserProfile[];
    } catch (error) {
      console.error('Get users by school error:', error);
      throw error;
    }
  }

  /**
   * Check if user has specific permissions
   */
  async checkPermissions(userId: string, action: string, resource: string): Promise<boolean> {
    try {
      // Get user profile to check role
      const profile = await this.getUserProfile(userId);
      
      // Role-based permissions logic
      switch (profile.role) {
        case 'admin':
          return true; // Admins have all permissions
        case 'teacher':
          // Teachers can manage their own classes and students
          return ['read', 'create', 'update'].includes(action);
        case 'student':
          // Students can only read their own data
          return action === 'read';
        default:
          return false;
      }
    } catch (error) {
      console.error('Check permissions error:', error);
      return false;
    }
  }
}

// Export singleton instance
export const authService = new AuthService();