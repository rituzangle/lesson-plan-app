// Destination: src/services/lesson.service.ts
// Business logic service for lesson plan management with encryption

import AsyncStorage from '@react-native-async-storage/async-storage';
import { LessonPlan, Subject, LessonTemplate, SearchFilters, LessonSummary } from '../types/lesson.types';
import { EncryptionService } from './encryption.service';
import { generateId } from '../utils/helpers';

const STORAGE_KEYS = {
  LESSONS: 'lessons',
  SUBJECTS: 'subjects',
  TEMPLATES: 'templates',
  USER_PREFERENCES: 'user_preferences'
};

export class LessonService {
  private static currentUserId = 'default_user'; // Will be set by auth system

  /**
   * Set current user ID for data isolation
   */
  static setCurrentUser(userId: string) {
    this.currentUserId = userId;
  }

  /**
   * Get user-specific storage key
   */
  private static getUserKey(key: string): string {
    return `${this.currentUserId}_${key}`;
  }

  /**
   * Save lesson plan with encryption
   */
  static async saveLesson(lesson: LessonPlan): Promise<LessonPlan> {
    try {
      // Generate ID if new lesson
      if (!lesson.id) {
        lesson.id = generateId();
        lesson.createdAt = new Date().toISOString();
      }
      lesson.updatedAt = new Date().toISOString();
      lesson.userId = this.currentUserId;

      // Get existing lessons
      const lessons = await this.getLessons();
      
      // Update or add lesson
      const existingIndex = lessons.findIndex(l => l.id === lesson.id);
      if (existingIndex >= 0) {
        lessons[existingIndex] = lesson;
      } else {
        lessons.push(lesson);
      }

      // Encrypt and save
      const encryptedData = await EncryptionService.encrypt(JSON.stringify(lessons));
      await AsyncStorage.setItem(this.getUserKey(STORAGE_KEYS.LESSONS), encryptedData);

      return lesson;
    } catch (error) {
      console.error('Error saving lesson:', error);
      throw new Error('Failed to save lesson');
    }
  }

  /**
   * Get all lessons for current user
   */
  static async getLessons(): Promise<LessonPlan[]> {
    try {
      const encryptedData = await AsyncStorage.getItem(this.getUserKey(STORAGE_KEYS.LESSONS));
      if (!encryptedData) return [];

      const decryptedData = await EncryptionService.decrypt(encryptedData);
      return JSON.parse(decryptedData) as LessonPlan[];
    } catch (error) {
      console.error('Error loading lessons:', error);
      return [];
    }
  }

  /**
   * Get single lesson by ID
   */
  static async getLesson(id: string): Promise<LessonPlan | null> {
    try {
      const lessons = await this.getLessons();
      return lessons.find(lesson => lesson.id === id) || null;
    } catch (error) {
      console.error('Error loading lesson:', error);
      return null;
    }
  }

  /**
   * Delete lesson
   */
  static async deleteLesson(id: string): Promise<boolean> {
    try {
      const lessons = await this.getLessons();
      const filteredLessons = lessons.filter(lesson => lesson.id !== id);
      
      const encryptedData = await EncryptionService.encrypt(JSON.stringify(filteredLessons));
      await AsyncStorage.setItem(this.getUserKey(STORAGE_KEYS.LESSONS), encryptedData);
      
      return true;
    } catch (error) {
      console.error('Error deleting lesson:', error);
      return false;
    }
  }

  /**
   * Search lessons with filters
   */
  static async searchLessons(filters: SearchFilters): Promise<LessonSummary[]> {
    try {
      const lessons = await this.getLessons();
      
      return lessons
        .filter(lesson => {
          if (filters.subject && lesson.subject !== filters.subject) return false;
          if (filters.gradeLevel && lesson.gradeLevel !== filters.gradeLevel) return false;
          if (filters.duration) {
            if (lesson.duration < filters.duration.min || lesson.duration > filters.duration.max) {
              return false;
            }
          }
          if (filters.tags && filters.tags.length > 0) {
            const lessonTags = lesson.tags || [];
            if (!filters.tags.some(tag => lessonTags.includes(tag))) return false;
          }
          return true;
        })
        .map(lesson => ({
          id: lesson.id,
          title: lesson.title,
          subject: lesson.subject,
          gradeLevel: lesson.gradeLevel,
          duration: lesson.duration,
          createdAt: lesson.createdAt,
          updatedAt: lesson.updatedAt,
          tags: lesson.tags || []
        }));
    } catch (error) {
      console.error('Error searching lessons:', error);
      return [];
    }
  }

  /**
   * Get subjects from JSON data
   */
  static async getSubjects(): Promise<Subject[]> {
    try {
      // In a real app, this would load from a JSON file or API
      // For now, return hardcoded subjects
      return [
        {
          id: 'performing_arts',
          name: 'Performing Arts',
          description: 'Theater, dance, music, and creative expression',
          standards: ['creativity', 'collaboration', 'communication'],
          color: '#ff6b6b',
          icon: '🎭'
        },
        {
          id: 'science',
          name: 'Science',
          description: 'Scientific inquiry and discovery',
          standards: ['inquiry', 'analysis', 'evidence'],
          color: '#4ecdc4',
          icon: '🔬'
        },
        {
          id: 'mathematics',
          name: 'Mathematics',
          description: 'Mathematical concepts and problem solving',
          standards: ['problem_solving', 'reasoning', 'communication'],
          color: '#45b7d1',
          icon: '📊'
        }
      ];
    } catch (error) {
      console.error('Error loading subjects:', error);
      return [];
    }
  }

  /**
   * Get lesson templates
   */
  static async getTemplates(subject?: string): Promise<LessonTemplate[]> {
    try {
      const storedTemplates = await AsyncStorage.getItem(STORAGE_KEYS.TEMPLATES);
      const templates: LessonTemplate[] = storedTemplates ? JSON.parse(storedTemplates) : [];
      
      if (subject) {
        return templates.filter(template => template.subject === subject);
      }
      
      return templates;
    } catch (error) {
      console.error('Error loading templates:', error);
      return [];
    }
  }

  /**
   * Export lesson to JSON
   */
  static async exportLesson(lessonId: string): Promise<string> {
    try {
      const lesson = await this.getLesson(lessonId);
      if (!lesson) throw new Error('Lesson not found');
      
      return JSON.stringify(lesson, null, 2);
    } catch (error) {
      console.error('Error exporting lesson:', error);
      throw new Error('Failed to export lesson');
    }
  }

  /**
   * Import lesson from JSON
   */
  static async importLesson(jsonData: string): Promise<LessonPlan> {
    try {
      const lesson = JSON.parse(jsonData) as LessonPlan;
      
      // Generate new ID for imported lesson
      lesson.id = generateId();
      lesson.createdAt = new Date().toISOString();
      lesson.updatedAt = new Date().toISOString();
      
      return await this.saveLesson(lesson);
    } catch (error) {
      console.error('Error importing lesson:', error);
      throw new Error('Failed to import lesson');
    }
  }
}