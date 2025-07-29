// src/services/authService.ts
import { supabase } from '../lib/supabase';
import { UserProfile, UserRole } from '../components/AuthContext';

export class AuthService {
  // Sign up new user
  async signUp(email: string, password: string, userData: Partial<UserProfile>) {
    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: userData.firstName,
            last_name: userData.lastName,
            role: userData.role || 'student',
          }
        }
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('No user returned from signup');

      // Create user profile in database
      const profileData: Partial<UserProfile> = {
        id: authData.user.id,
        email: authData.user.email!,
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        role: userData.role || 'student',
        schoolId: userData.schoolId,
        classIds: userData.classIds || [],
        accessibilitySettings: {
          highContrast: false,
          fontSize: 'medium',
          voiceEnabled: false,
          screenReader: false,
          keyboardNavigation: false,
          reducedMotion: false,
          ...userData.accessibilitySettings
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert([profileData]);

      if (profileError) {
        // Clean up auth user if profile creation fails
        await supabase.auth.admin.deleteUser(authData.user.id);
        throw profileError;
      }

      return { user: authData.user, profile: profileData };
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  }

  // Sign in existing user
  async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      if (!data.user) throw new Error('No user returned from signin');

      return { user: data.user, session: data.session };
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  }

  // OAuth sign in
  async signInWithOAuth(provider: 'google' | 'apple') {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: typeof window !== 'undefined' ? window.location.origin : undefined,
        }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`OAuth ${provider} sign in error:`, error);
      throw error;
    }
  }

  // Sign out
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }

  // Get user profile
  async getUserProfile(userId: string): Promise<UserProfile> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      if (!data) throw new Error('User profile not found');

      return data as UserProfile;
    } catch (error) {
      console.error('Get user profile error:', error);
      throw error;
    }
  }

  // Update user profile
  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    try {
      const updateData = {
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('user_profiles')
        .update(updateData)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error('Failed to update user profile');

      return data as UserProfile;
    } catch (error) {
      console.error('Update user profile error:', error);
      throw error;
    }
  }

  // Reset password
  async resetPassword(email: string) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/reset-password` : undefined,
      });

      if (error) throw error;
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  }

  // Update password
  async updatePassword(newPassword: string) {
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

  // Delete user account
  async deleteAccount(userId: string) {
    try {
      // First delete user profile
      const { error: profileError } = await supabase
        .from('user_profiles')
        .delete()
        .eq('id', userId);

      if (profileError) throw profileError;

      // Then delete auth user (requires admin privileges)
      const { error: authError } = await supabase.auth.admin.deleteUser(userId);
      if (authError) throw authError;
    } catch (error) {
      console.error('Delete account error:', error);
      throw error;
    }
  }

  // Check if user has specific role
  async hasRole(userId: string, role: UserRole | UserRole[]): Promise<boolean> {
    try {
      const profile = await this.getUserProfile(userId);
      const roles = Array.isArray(role) ? role : [role];
      return roles.includes(profile.role);
    } catch (error) {
      console.error('Check role error:', error);
      return false;
    }
  }

  // Get users by role (admin only)
  async getUsersByRole(role: UserRole): Promise<UserProfile[]> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('role', role);

      if (error) throw error;
      return data as UserProfile[];
    } catch (error) {
      console.error('Get users by role error:', error);
      throw error;
    }
  }

  // Get session info
  async getSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      return session;
    } catch (error) {
      console.error('Get session error:', error);
      return null;
    }
  }

  // Refresh session
  async refreshSession() {
    try {
      const { data: { session }, error } = await supabase.auth.refreshSession();
      if (error) throw error;
      return session;
    } catch (error) {
      console.error('Refresh session error:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;