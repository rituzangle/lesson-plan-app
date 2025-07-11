/**
 * storage.ts
 * 
 * TypeScript interfaces for storage operations
 * Final destination: src/types/storage-types.ts
 * 
 * Defines all storage-related types and interfaces
 */

// Storage key types for type safety
export type StorageKey = 
  | 'lesson_plans'
  | 'user_preferences'
  | 'app_settings'
  | 'curriculum_data'
  | 'user_profile'
  | 'performance_arts'
  | 'accessibility_settings'
  | 'offline_data'
  | 'temp_drafts'
  | 'backup_data'
  | string; // Allow custom keys

// Storage value types
export type StorageValue = 
  | string 
  | number 
  | boolean 
  | object 
  | Array<any> 
  | null;

// Storage options
export interface StorageOptions {
  skipEncryption?: boolean;
  expirationTime?: number; // Unix timestamp
  compress?: boolean;
}

// Storage statistics
export interface StorageStats {
  totalSize: number;
  itemCount: number;
  keys: string[];
  estimatedSizeInMB: number;
}

// Lesson Plan specific types
export interface LessonPlan {
  id: string;
  title: string;
  description: string;
  subject: string;
  gradeLevel: string;
  duration: number; // in minutes
  learningObjectives: string[];
  materials: string[];
  activities: Activity[];
  assessment: Assessment;
  accessibility: AccessibilityFeatures;
  performingArts?: PerformingArtsIntegration;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  tags: string[];
  isPublic: boolean;
  curriculum: CurriculumStandard[];
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  duration: number;
  type: ActivityType;
  materials: string[];
  instructions: string[];
  adaptations: string[];
}

export type ActivityType = 
  | 'introduction'
  | 'instruction'
  | 'practice'
  | 'assessment'
  | 'closure'
  | 'performing_arts'
  | 'accessibility_focused';

export interface Assessment {
  type: AssessmentType;
  description: string;
  criteria: string[];
  accommodations: string[];
  rubric?: Rubric;
}

export type AssessmentType = 
  | 'formative'
  | 'summative'
  | 'diagnostic'
  | 'performance'
  | 'portfolio';

export interface Rubric {
  id: string;
  name: string;
  criteria: RubricCriteria[];
  scale: RubricScale;
}

export interface RubricCriteria {
  criterion: string;
  description: string;
  weight: number;
}

export interface RubricScale {
  levels: number;
  labels: string[];
  descriptions: string[];
}

// Accessibility features
export interface AccessibilityFeatures {
  visualSupports: string[];
  audioSupports: string[];
  tactileSupports: string[];
  cognitiveSupports: string[];
  motorSupports: string[];
  languageSupports: string[];
  alternativeFormats: string[];
}

// Performing arts integration
export interface PerformingArtsIntegration {
  discipline: PerformingArtsDiscipline[];
  techniques: string[];
  skills: string[];
  assessmentCriteria: string[];
  resources: string[];
}

export type PerformingArtsDiscipline = 
  | 'theater'
  | 'music'
  | 'dance'
  | 'creative_movement'
  | 'storytelling'
  | 'mime'
  | 'puppetry';

// Curriculum standards
export interface CurriculumStandard {
  id: string;
  standard: string;
  description: string;
  source: string; // Common Core, state standards, etc.
  gradeLevel: string;
  subject: string;
}

// User preferences
export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  defaultGradeLevel: string;
  defaultSubject: string;
  lessonPlanTemplate: string;
  notificationSettings: NotificationSettings;
  accessibilityPreferences: AccessibilityPreferences;
  performingArtsPreferences: PerformingArtsPreferences;
  autoSave: boolean;
  backupFrequency: 'daily' | 'weekly' | 'monthly';
}

export interface NotificationSettings {
  enabled: boolean;
  reminderTime: number; // minutes before class
  backupReminders: boolean;
  updateNotifications: boolean;
}

export interface AccessibilityPreferences {
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  contrast: 'normal' | 'high';
  screenReader: boolean;
  voiceNavigation: boolean;
  keyboardNavigation: boolean;
  reducedMotion: boolean;
}

export interface PerformingArtsPreferences {
  preferredDisciplines: PerformingArtsDiscipline[];
  integrationLevel: 'minimal' | 'moderate' | 'extensive';
  showSuggestions: boolean;
  includeResources: boolean;
}

// App settings
export interface AppSettings {
  version: string;
  firstLaunch: boolean;
  onboardingCompleted: boolean;
  dataSync: boolean;
  offlineMode: boolean;
  encryptionEnabled: boolean;
  debugMode: boolean;
  analyticsEnabled: boolean;
  crashReportingEnabled: boolean;
}

// User profile
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  school?: string;
  district?: string;
  subjects: string[];
  gradeLevels: string[];
  yearsExperience: number;
  certifications: string[];
  specializations: string[];
  createdAt: Date;
  lastLogin: Date;
}

export type UserRole = 
  | 'teacher'
  | 'parent'
  | 'student'
  | 'administrator'
  | 'self_study';

// Backup data structure
export interface BackupData {
  version: string;
  timestamp: Date;
  userProfile: UserProfile;
  lessonPlans: LessonPlan[];
  userPreferences: UserPreferences;
  appSettings: AppSettings;
  checksum: string;
}

// Storage migration interface
export interface StorageMigration {
  version: string;
  migrate: (data: any) => Promise<any>;
  rollback: (data: any) => Promise<any>;
}

// Export/Import interfaces
export interface ExportOptions {
  includeUserData: boolean;
  includeSettings: boolean;
  includeDrafts: boolean;
  format: 'json' | 'csv' | 'pdf';
  encryption: boolean;
}

export interface ImportOptions {
  overwriteExisting: boolean;
  mergeStrategy: 'replace' | 'merge' | 'skip';
  validateData: boolean;
  createBackup: boolean;
}