// src/auth/AuthService.ts
// Authentication service for secure user management

import { supabase, validatePassword, generateDisplayId } from './supabase';
import { 
  AppUser, 
  AuthResponse, 
  LoginForm, 
  SignupForm, 
  UserProfile, 
  ClassInfo, 
  CreateClassForm,
  FormValidation,
  ValidationError,
  UserRole,
  DEFAULT_PREFERENCES,
  DISPLAY_ID_PATTERNS,
} from './types';

export class AuthService {
  /**
   * User Authentication Methods
   */
  
  // Login with email and password
  static async login(credentials: LoginForm): Promise<AuthResponse> {
    try {
      const { email, password } = credentials;
      
      // Validate input
      const validation = this.validateLoginForm(credentials);
      if (!validation.isValid) {
        return { 
          success: false, 
          error: validation.errors.map(e => e.message).join(', ') 
        };
      }
      
      // Attempt authentication
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (authError) {
        return { 
          success: false, 
          error: this.mapAuthError(authError.message) 
        };
      }
      
      if (!authData.user) {
        return { 
          success: false, 
          error: 'Authentication failed' 
        };
      }
      
      // Check email verification
      if (!authData.user.email_confirmed_at) {
        return { 
          success: false, 
          error: 'Please verify your email before logging in',
          requiresVerification: true 
        };
      }
      
      // Get user profile data
      const user = await this.getUserProfile(authData.user.id);
      if (!user) {
        return { 
          success: false, 
          error: 'User profile not found' 
        };
      }
      
      // Update last login
      await this.updateLastLogin(authData.user.id);
      
      return { 
        success: true, 
        user 
      };
      
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: 'Login failed. Please try again.' 
      };
    }
  }
  
  // Sign up new user
  static async signup(userData: SignupForm): Promise<AuthResponse> {
    try {
      // Validate form data
      const validation = this.validateSignupForm(userData);
      if (!validation.isValid) {
        return { 
          success: false, 
          error: validation.errors.map(e => e.message).join(', ') 
        };
      }
      
      const { email, password, role, classCode, displayName } = userData;
      
      // Generate display ID
      const displayId = generateDisplayId(role, classCode);
      
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: process.env.EXPO_PUBLIC_AUTH_REDIRECT_URL,
        },
      });
      
      if (authError) {
        return { 
          success: false, 
          error: this.mapAuthError(authError.message) 
        };
      }
      
      if (!authData.user) {
        return { 
          success: false, 
          error: 'Failed to create account' 
        };
      }
      
      // Create user profile in database
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          display_id: displayId,
          email,
          role,
          class_code: role === 'student' ? classCode : null,
          email_verified: false,
        });
      
      if (profileError) {
        // Clean up auth user if profile creation fails
        await supabase.auth.admin.deleteUser(authData.user.id);
        return { 
          success: false, 
          error: 'Failed to create user profile' 
        };
      }
      
      // Create user profile details
      const { error: detailsError } = await supabase
        .from('user_profiles')
        .insert({
          user_id: authData.user.id,
          display_name: displayName || this.generateDisplayName(role, displayId),
          preferences: DEFAULT_PREFERENCES,
        });
      
      if (detailsError) {
        console.error('Profile details creation failed:', detailsError);
        // Not critical, continue
      }
      
      return { 
        success: true, 
        requiresVerification: true 
      };
      
    } catch (error) {
      console.error('Signup error:', error);
      return { 
        success: false, 
        error: 'Account creation failed. Please try again.' 
      };
    }
  }
  
  // Logout user
  static async logout(): Promise<void> {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
  
  // Reset password
  static async resetPassword(email: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: process.env.EXPO_PUBLIC_AUTH_REDIRECT_URL,
      });
      
      if (error) {
        return { 
          success: false, 
          error: this.mapAuthError(error.message) 
        };
      }
      
      return { success: true };
      
    } catch (error) {
      console.error('Password reset error:', error);
      return { 
        success: false, 
        error: 'Password reset failed. Please try again.' 
      };
    }
  }
  
  /**
   * User Profile Methods
   */
  
  // Get current user profile
  static async getCurrentUser(): Promise<AppUser | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      
      return await this.getUserProfile(user.id);
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }
  
  // Get user profile by ID
  static async getUserProfile(userId: string): Promise<AppUser | null> {
    try {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (userError || !userData) {
        return null;
      }
      
      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      return {
        id: userData.id,
        displayId: userData.display_id,
        email: userData.email,
        role: userData.role,
        classCode: userData.class_code,
        emailVerified: userData.email_verified,
        isActive: userData.is_active,
        createdAt: userData.created_at,
        lastLogin: userData.last_login,
        profile: profileData ? {
          id: profileData.id,
          userId: profileData.user_id,
          displayName: profileData.display_name,
          avatarUrl: profileData.avatar_url,
          preferences: profileData.preferences,
          createdAt: profileData.created_at,
          updatedAt: profileData.updated_at,
        } : undefined,
      };
    } catch (error) {
      console.error('Get user profile error:', error);
      return null;
    }
  }
  
  // Update user profile
  static async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<AuthResponse> {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          display_name: updates.displayName,
          avatar_url: updates.avatarUrl,
          preferences: updates.preferences,
        })
        .eq('user_id', userId);
      
      if (error) {
        return { 
          success: false, 
          error: 'Failed to update profile' 
        };
      }
      
      const user = await this.getUserProfile(userId);
      return { 
        success: true, 
        user: user || undefined 
      };
      
    } catch (error) {
      console.error('Update profile error:', error);
      return { 
        success: false, 
        error: 'Profile update failed' 
      };
    }
  }
  
  /**
   * Class Management Methods (Teachers only)
   */
  
  // Create a new class
  static async createClass(teacherId: string, classData: CreateClassForm): Promise<{ success: boolean; classCode?: string; error?: string }> {
    try {
      // Generate unique class code
      const classCode = await this.generateUniqueClassCode();
      
      const { data, error } = await supabase
        .from('classes')
        .insert({
          class_code: classCode,
          class_name: classData.className,
          teacher_id: teacherId,
          description: classData.description,
          max_students: classData.maxStudents || 26,
        })
        .select()
        .single();
      
      if (error) {
        return { 
          success: false, 
          error: 'Failed to create class' 
        };
      }
      
      return { 
        success: true, 
        classCode 
      };
      
    } catch (error) {
      console.error('Create class error:', error);
      return { 
        success: false, 
        error: 'Class creation failed' 
      };
    }
  }
  
  // Get class information
  static async getClassInfo(classCode: string): Promise<ClassInfo | null> {
    try {
      const { data, error } = await supabase
        .from('classes')
        .select('*')
        .eq('class_code', classCode)
        .single();
      
      if (error || !data) {
        return null;
      }
      
      // Get student count
      const { count } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('class_code', classCode)
        .eq('role', 'student');
      
      return {
        id: data.id,
        classCode: data.class_code,
        className: data.class_name,
        teacherId: data.teacher_id,
        description: data.description,
        maxStudents: data.max_students,
        isActive: data.is_active,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        studentCount: count || 0,
      };
    } catch (error) {
      console.error('Get class info error:', error);
      return null;
    }
  }
  
  /**
   * Validation Methods
   */
  
  private static validateLoginForm(form: LoginForm): FormValidation {
    const errors: ValidationError[] = [];
    
    if (!form.email || !form.email.trim()) {
      errors.push({ field: 'email', message: 'Email is required' });
    } else if (!this.isValidEmail(form.email)) {
      errors.push({ field: 'email', message: 'Please enter a valid email address' });
    }
    
    if (!form.password || !form.password.trim()) {
      errors.push({ field: 'password', message: 'Password is required' });
    }
    
    return {
      isValid: errors.length === 0,
      errors,
    };
  }
  
  private static validateSignupForm(form: SignupForm): FormValidation {
    const errors: ValidationError[] = [];
    
    // Email validation
    if (!form.email || !form.email.trim()) {
      errors.push({ field: 'email', message: 'Email is required' });
    } else if (!this.isValidEmail(form.email)) {
      errors.push({ field: 'email', message: 'Please enter a valid email address' });
    }
    
    // Password validation
    const passwordValidation = validatePassword(form.password);
    if (!passwordValidation.isValid) {
      errors.push({ field: 'password', message: passwordValidation.errors.join(', ') });
    }
    
    // Confirm password
    if (form.password !== form.confirmPassword) {
      errors.push({ field: 'confirmPassword', message: 'Passwords do not match' });
    }
    
    // Role validation
    if (!form.role || !['teacher', 'student'].includes(form.role)) {
      errors.push({ field: 'role', message: 'Please select a valid role' });
    }
    
    // Class code validation for students
    if (form.role === 'student') {
      if (!form.classCode || !form.classCode.trim()) {
        errors.push({ field: 'classCode', message: 'Class code is required for students' });
      } else if (!DISPLAY_ID_PATTERNS.CLASS_CODE.test(form.classCode.toUpperCase())) {
        errors.push({ field: 'classCode', message: 'Class code must be 3 letters (e.g., ABC)' });
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors,
    };
  }
  
  /**
   * Utility Methods
   */
  
  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  private static generateDisplayName(role: UserRole, displayId: string): string {
    if (role === 'teacher') {
      return `Teacher ${displayId}`;
    } else {
      return `Student ${displayId}`;
    }
  }
  
  private static async generateUniqueClassCode(): Promise<string> {
    let attempts = 0;
    const maxAttempts = 10;
    
    while (attempts < maxAttempts) {
      const code = this.generateRandomClassCode();
      
      const { data, error } = await supabase
        .from('classes')
        .select('class_code')
        .eq('class_code', code)
        .single();
      
      if (error && error.code === 'PGRST116') {
        // No row found, code is unique
        return code;
      }
      
      attempts++;
    }
    
    throw new Error('Failed to generate unique class code');
  }
  
  private static generateRandomClassCode(): string {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < 3; i++) {
      result += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    return result;
  }
  
  private static async updateLastLogin(userId: string): Promise<void> {
    try {
      await supabase
        .from('users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', userId);
    } catch (error) {
      console.error('Update last login error:', error);
    }
  }
  
  private static mapAuthError(error: string): string {
    const errorMappings: Record<string, string> = {
      'Invalid login credentials': 'Invalid email or password',
      'Email not confirmed': 'Please verify your email address',
      'User not found': 'No account found with this email',
      'Password should be at least 6 characters': 'Password must be at least 8 characters',
      'User already registered': 'An account with this email already exists',
      'Too many requests': 'Too many attempts. Please try again later',
    };
    
    return errorMappings[error] || 'An error occurred. Please try again.';
  }
}