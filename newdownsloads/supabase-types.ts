// src/types/supabase.ts
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          email: string
          role: 'admin' | 'teacher' | 'student'
          first_name: string
          last_name: string
          school_id: string | null
          class_ids: string[] | null
          accessibility_settings: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          role?: 'admin' | 'teacher' | 'student'
          first_name: string
          last_name: string
          school_id?: string | null
          class_ids?: string[] | null
          accessibility_settings?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          role?: 'admin' | 'teacher' | 'student'
          first_name?: string
          last_name?: string
          school_id?: string | null
          class_ids?: string[] | null
          accessibility_settings?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      lesson_plans: {
        Row: {
          id: string
          title: string
          description: string | null
          subject: string
          grade_level: string
          duration_minutes: number
          learning_objectives: string[]
          materials_needed: string[]
          activities: Json
          assessment_methods: string[]
          accessibility_features: Json | null
          created_by: string
          created_at: string
          updated_at: string
          is_template: boolean
          is_public: boolean
          tags: string[]
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          subject: string
          grade_level: string
          duration_minutes: number
          learning_objectives: string[]
          materials_needed: string[]
          activities: Json
          assessment_methods: string[]
          accessibility_features?: Json | null
          created_by: string
          created_at?: string
          updated_at?: string
          is_template?: boolean
          is_public?: boolean
          tags?: string[]
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          subject?: string
          grade_level?: string
          duration_minutes?: number
          learning_objectives?: string[]
          materials_needed?: string[]
          activities?: Json
          assessment_methods?: string[]
          accessibility_features?: Json | null
          created_by?: string
          created_at?: string
          updated_at?: string
          is_template?: boolean
          is_public?: boolean
          tags?: string[]
        }
      }
      schools: {
        Row: {
          id: string
          name: string
          district: string | null
          address: string | null
          phone: string | null
          email: string | null
          principal_name: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          district?: string | null
          address?: string | null
          phone?: string | null
          email?: string | null
          principal_name?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          district?: string | null
          address?: string | null
          phone?: string | null
          email?: string | null
          principal_name?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      classes: {
        Row: {
          id: string
          name: string
          subject: string
          grade_level: string
          school_id: string
          teacher_id: string
          student_count: number
          room_number: string | null
          schedule: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          subject: string
          grade_level: string
          school_id: string
          teacher_id: string
          student_count?: number
          room_number?: string | null
          schedule?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          subject?: string
          grade_level?: string
          school_id?: string
          teacher_id?: string
          student_count?: number
          room_number?: string | null
          schedule?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'admin' | 'teacher' | 'student'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}