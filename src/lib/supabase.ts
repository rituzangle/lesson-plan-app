// src/lib/supabase.ts - july 28, 2025
import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

// Environment variables - these should be set in your .env file
// NOTE: Supabase has updated their API key terminology:
// - Legacy: `anon` and `service_role` keys
// - New: `publishable` and `secret` keys
// Both formats are supported, but new projects should use the updated terminology
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 
                       process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 
                       'YOUR_SUPABASE_PUBLISHABLE_KEY';

// Validate environment variables
if (!supabaseUrl || supabaseUrl === 'YOUR_SUPABASE_URL') {
  throw new Error('Missing EXPO_PUBLIC_SUPABASE_URL environment variable');
}

if (!supabaseAnonKey || 
    supabaseAnonKey === 'YOUR_SUPABASE_ANON_KEY' || 
    supabaseAnonKey === 'YOUR_SUPABASE_PUBLISHABLE_KEY') {
  throw new Error('Missing EXPO_PUBLIC_SUPABASE_ANON_KEY or EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY environment variable');
}

// Create Supabase client with enhanced configuration
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Enhanced auth configuration
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    
    // Custom storage for React Native/Expo
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    
    // OAuth redirect configuration
    redirectTo: typeof window !== 'undefined' ? window.location.origin : undefined,
  },
  
  // Real-time configuration
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
  
  // Global headers
  global: {
    headers: {
      'X-Client-Info': 'lesson-plan-app',
    },
  },
});

// Helper function to check if Supabase is properly configured
export const isSupabaseConfigured = (): boolean => {
  try {
    return Boolean(supabase.supabaseUrl && supabase.supabaseKey);
  } catch {
    return false;
  }
};

// Helper function to get current session
export const getCurrentSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  } catch (error) {
    console.error('Error getting current session:', error);
    return null;
  }
};

// Helper function to get current user
export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

// Health check function
export const healthCheck = async (): Promise<boolean> => {
  try {
    const { error } = await supabase.from('health_check').select('*').limit(1);
    return !error;
  } catch {
    return false;
  }
};

export default supabase;