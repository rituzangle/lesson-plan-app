// src/auth/supabase.ts
// Supabase client configuration for lesson plan app

import { createClient } from '@supabase/supabase-js';
import { Database } from './types';

// Environment variables - add these to your .env file
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create Supabase client with enhanced security
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce', // Enhanced security for mobile apps
  },
  // Global settings for privacy
  global: {
    headers: {
      'X-Client-Info': 'lesson-plan-app',
    },
  },
});

// Auth configuration
export const authConfig = {
  // Email verification required
  emailRedirectTo: process.env.EXPO_PUBLIC_AUTH_REDIRECT_URL || 'exp://localhost:19006/auth/callback',
  
  // Password requirements
  passwordRules: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: false, // Keep simple for teachers/students
  },
  
  // Display ID format rules
  displayIdRules: {
    teacherPrefix: 'TCH',
    studentPrefixLength: 3, // Class code ABC
    totalLength: 8,
    allowedChars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
  },
};

// Helper function to validate password
export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  const { minLength, requireUppercase, requireLowercase, requireNumbers } = authConfig.passwordRules;
  
  if (password.length < minLength) {
    errors.push(`Password must be at least ${minLength} characters long`);
  }
  
  if (requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (requireNumbers && !/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Helper function to generate secure display IDs
export const generateDisplayId = (role: 'teacher' | 'student', classCode?: string): string => {
  const { teacherPrefix, studentPrefixLength, totalLength, allowedChars } = authConfig.displayIdRules;
  
  let prefix: string;
  let suffixLength: number;
  
  if (role === 'teacher') {
    prefix = teacherPrefix;
    suffixLength = totalLength - teacherPrefix.length;
  } else {
    if (!classCode || classCode.length !== studentPrefixLength) {
      throw new Error('Valid class code required for student accounts');
    }
    prefix = classCode.toUpperCase();
    suffixLength = totalLength - studentPrefixLength;
  }
  
  // Generate random suffix
  let suffix = '';
  for (let i = 0; i < suffixLength; i++) {
    suffix += allowedChars.charAt(Math.floor(Math.random() * allowedChars.length));
  }
  
  return prefix + suffix;
};

// Test connection function
export const testSupabaseConnection = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.from('users').select('count').limit(1);
    return !error;
  } catch (error) {
    console.error('Supabase connection test failed:', error);
    return false;
  }
};

// Export types for use in components
export type { Database } from './types';