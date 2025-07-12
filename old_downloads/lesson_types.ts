// Destination: src/types/lesson.types.ts
// TypeScript definitions for lesson plan app

export interface LessonPlan {
  id: string;
  title: string;
  subject: string;
  gradeLevel: string;
  duration: number; // in minutes
  objectives: string[];
  materials: string[];
  activities: Activity[];
  assessment: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  userId?: string; // For user isolation
  isTemplate?: boolean;
  tags?: string[];
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  type: ActivityType;
  materials: string[];
  instructions: string[];
  groupSize: GroupSize;
  notes?: string;
}

export enum ActivityType {
  WARMUP = 'warmup',
  MAIN = 'main',
  PRACTICE = 'practice',
  ASSESSMENT = 'assessment',
  COOLDOWN = 'cooldown',
  DISCUSSION = 'discussion',
  HANDS_ON = 'hands_on'
}

export enum GroupSize {
  INDIVIDUAL = 'individual',
  PAIRS = 'pairs',
  SMALL_GROUP = 'small_group',
  WHOLE_CLASS = 'whole_class'
}

export interface Subject {
  id: string;
  name: string;
  description: string;
  standards: string[];
  color?: string;
  icon?: string;
}

export interface LessonTemplate {
  id: string;
  name: string;
  description: string;
  subject: string;
  gradeLevel: string;
  duration: number;
  activities: Activity[];
  materials: string[];
  tags: string[];
  isPublic: boolean;
  createdBy?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  preferences: UserPreferences;
  createdAt: string;
}

export enum UserRole {
  TEACHER = 'teacher',
  ADMIN = 'admin',
  STUDENT = 'student'
}

export interface UserPreferences {
  defaultSubject?: string;
  defaultGradeLevel?: string;
  defaultDuration?: number;
  theme: 'light' | 'dark';
  notifications: boolean;
  autoSave: boolean;
}

export interface SearchFilters {
  subject?: string;
  gradeLevel?: string;
  duration?: {
    min: number;
    max: number;
  };
  tags?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface LessonSummary {
  id: string;
  title: string;
  subject: string;
  gradeLevel: string;
  duration: number;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}