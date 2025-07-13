// src/auth/types.ts
// TypeScript types for authentication system

import { User as SupabaseUser } from '@supabase/supabase-js';

// Database schema types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          display_id: string;
          email: string;
          role: UserRole;
          class_code: string | null;
          email_verified: boolean;
          created_at: string;
          updated_at: string;
          last_login: string | null;
          is_active: boolean;
        };
        Insert: {
          id?: string;
          display_id: string;
          email: string;
          role: UserRole;
          class_code?: string | null;
          email_verified?: boolean;
          created_at?: string;
          updated_at?: string;
          last_login?: string | null;
          is_active?: boolean;
        };
        Update: {
          id?: string;
          display_id?: string;
          email?: string;
          role?: UserRole;
          class_code?: string | null;
          email_verified?: boolean;
          created_at?: string;
          updated_at?: string;
          last_login?: string | null;
          is_active?: boolean;
        };
      };
      user_profiles: {
        Row: {
          id: string;
          user_id: string;
          display_name: string | null;
          avatar_url: string | null;
          preferences: Record<string, any>;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          display_name?: string | null;
          avatar_url?: string | null;
          preferences?: Record<string, any>;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          display_name?: string | null;
          avatar_url?: string | null;
          preferences?: Record<string, any>;
          created_at?: string;
          updated_at?: string;
        };
      };
      classes: {
        Row: {
          id: string;
          class_code: string;
          class_name: string;
          teacher_id: string;
          description: string | null;
          max_students: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          class_code: string;
          class_name: string;
          teacher_id: string;
          description?: string | null;
          max_students?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          class_code?: string;
          class_name?: string;
          teacher_id?: string;
          description?: string | null;
          max_students?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

// User roles with clear permissions
export type UserRole = 'teacher' | 'student' | 'admin';

// Enhanced user interface combining Supabase auth with our custom data
export interface AppUser {
  id: string;
  displayId: string;
  email: string;
  role: UserRole;
  classCode?: string;
  emailVerified: boolean;
  profile?: UserProfile;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

// User profile interface
export interface UserProfile {
  id: string;
  userId: string;
  displayName?: string;
  avatarUrl?: string;
  preferences: UserPreferences;
  createdAt: string;
  updatedAt: string;
}

// User preferences
export interface UserPreferences {
  theme?: 'light' | 'dark' | 'system';
  language?: string;
  notifications?: {
    email: boolean;
    push: boolean;
    lessonReminders: boolean;
  };
  accessibility?: {
    fontSize: 'small' | 'medium' | 'large';
    highContrast: boolean;
    reduceMotion: boolean;
  };
}

// Class interface
export interface ClassInfo {
  id: string;
  classCode: string;
  className: string;
  teacherId: string;
  description?: string;
  maxStudents: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  studentCount?: number;
}

// Authentication state
export interface AuthState {
  user: AppUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

// Auth form interfaces
export interface LoginForm {
  email: string;
  password: string;
}

export interface SignupForm {
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
  classCode?: string; // Required for students
  displayName?: string;
}

export interface CreateClassForm {
  className: string;
  description?: string;
  maxStudents?: number;
}

// Auth service responses
export interface AuthResponse {
  success: boolean;
  user?: AppUser;
  error?: string;
  requiresVerification?: boolean;
}

export interface ValidationError {
  field: string;
  message: string;
}

// Form validation
export interface FormValidation {
  isValid: boolean;
  errors: ValidationError[];
}

// Permission checks
export interface UserPermissions {
  canCreateClass: boolean;
  canManageStudents: boolean;
  canAccessLessons: boolean;
  canViewReports: boolean;
  canEditProfile: boolean;
}

// Auth context interface
export interface AuthContextType {
  // State
  user: AppUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  
  // Auth actions
  login: (credentials: LoginForm) => Promise<AuthResponse>;
  signup: (userData: SignupForm) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  
  // User management
  updateProfile: (updates: Partial<UserProfile>) => Promise<AuthResponse>;
  refreshUser: () => Promise<void>;
  
  // Class management (teachers only)
  createClass: (classData: CreateClassForm) => Promise<{ success: boolean; classCode?: string; error?: string }>;
  getClassInfo: (classCode: string) => Promise<ClassInfo | null>;
  
  // Utility
  clearError: () => void;
  checkPermissions: () => UserPermissions;
}

// Error types
export type AuthError = 
  | 'invalid-credentials'
  | 'email-not-verified'
  | 'user-not-found'
  | 'email-already-exists'
  | 'weak-password'
  | 'invalid-class-code'
  | 'class-full'
  | 'network-error'
  | 'unknown-error';

// Constants
export const USER_ROLES = {
  TEACHER: 'teacher' as const,
  STUDENT: 'student' as const,
  ADMIN: 'admin' as const,
} as const;

export const DISPLAY_ID_PATTERNS = {
  TEACHER: /^TCH[A-Z0-9]{5}$/,
  STUDENT: /^[A-Z]{3}[A-Z0-9]{5}$/,
  CLASS_CODE: /^[A-Z]{3}$/,
} as const;

// Default preferences
export const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'system',
  language: 'en',
  notifications: {
    email: true,
    push: true,
    lessonReminders: true,
  },
  accessibility: {
    fontSize: 'medium',
    highContrast: false,
    reduceMotion: false,
  },
};

// Role-based permissions
export const ROLE_PERMISSIONS: Record<UserRole, UserPermissions> = {
  teacher: {
    canCreateClass: true,
    canManageStudents: true,
    canAccessLessons: true,
    canViewReports: true,
    canEditProfile: true,
  },
  student: {
    canCreateClass: false,
    canManageStudents: false,
    canAccessLessons: true,
    canViewReports: false,
    canEditProfile: true,
  },
  admin: {
    canCreateClass: true,
    canManageStudents: true,
    canAccessLessons: true,
    canViewReports: true,
    canEditProfile: true,
  },
};