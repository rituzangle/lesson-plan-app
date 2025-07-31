export interface LessonPlan {
  id: string;
  title: string;
  subject: string;
  gradeLevel: string;
  duration: number;
  objectives: string[];
  materials: string[];
  activities: Activity[];
  assessment: Assessment;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface Activity {
  name: string;
  duration: number;
  description: string;
}

export interface Assessment {
  formative: string;
  summative: string;
}

export interface Subject {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface LessonTemplate {
  id: string;
  name: string;
  description: string;
  duration: number;
  gradeLevels: string[];
  objectives: string[];
  materials: string[];
  activities: Activity[];
  assessment: Assessment;
}
