/**
 * Assessment Engine Type Definitions
 * Project: K-12 Lesson Plan App
 * Path: lesson-plan-app/src/types/assessment.ts
 */

export interface Student {
  id: string;
  name: string;
  academicLevel: number;
  domains: Record<string, number>;
  lastAssessment: Date;
  accessibilityNeeds?: string[];
  preferredLearningStyle?: 'visual' | 'auditory' | 'kinesthetic' | 'mixed';
}

export interface AssessmentDomain {
  id: string;
  name: string;
  bloomsLevels: string[];
  competencies: string[];
  color: string;
  accessibilityFeatures: string[];
}

export interface AssessmentQuestion {
  id: string;
  domain: string;
  bloomsLevel: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: number;
  accessibilityMetadata?: {
    hasAudio: boolean;
    hasVisualAids: boolean;
    screenReaderOptimized: boolean;
  };
}

export interface AssessmentResult {
  studentId: string;
  domain: string;
  score: number;
  bloomsLevel: number;
  recommendations: string[];
  nextSteps: string[];
  completedAt: Date;
  accessibilityUsed: string[];
}
