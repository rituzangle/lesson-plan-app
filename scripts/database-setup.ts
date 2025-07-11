/*
 * DATABASE SCHEMA & MANAGER
 * Path: src/database/schema.ts
 * 
 * Dependencies (auto-install):
 * npm install @react-native-async-storage/async-storage crypto-js
 * npm install --save-dev @types/crypto-js
 * 
 * Self-healing script: npm run setup:database
 * Add to package.json scripts:
 * "setup:database": "npm install @react-native-async-storage/async-storage crypto-js && npm install --save-dev @types/crypto-js"
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import CryptoJS from 'crypto-js';

// Database Schema Types
export interface UserProfile {
  id: string;
  userType: 'teacher' | 'parent' | 'student';
  name: string;
  email?: string;
  createdAt: string;
  updatedAt: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications: boolean;
  accessibility: {
    fontSize: 'small' | 'medium' | 'large';
    highContrast: boolean;
    screenReader: boolean;
  };
}

export interface ChildProfile {
  id: string;
  parentId: string;
  name: string;
  grade: string;
  subjects: string[];
  learningStyle: string[];
  accommodations: string[];
  createdAt: string;
  updatedAt: string;
}

export interface LessonPlan {
  id: string;
  creatorId: string;
  title: string;
  subject: string;
  grade: string;
  duration: number; // minutes
  objectives: string[];
  materials: string[];
  activities: Activity[];
  assessment: Assessment;
  adaptations: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  duration: number;
  type: 'warmup' | 'instruction' | 'practice' | 'assessment' | 'closure';
  materials: string[];
  accessibility: string[];
}

export interface Assessment {
  type: 'formative' | 'summative';
  methods: string[];
  criteria: string[];
  accommodations: string[];
}

// Database Manager Class
export class DatabaseManager {
  private static instance: DatabaseManager;
  private encryptionKey: string;

  private constructor() {
    this.encryptionKey = 'lesson-plan-app-key-2024'; // In production, use secure key generation
  }

  static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager();
    }
    return DatabaseManager.instance;
  }

  // Encryption utilities
  private encrypt(data: string): string {
    return CryptoJS.AES.encrypt(data, this.encryptionKey).toString();
  }

  private decrypt(encryptedData: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedData, this.encryptionKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  // Generic CRUD operations
  async save<T>(key: string, data: T, encrypt: boolean = true): Promise<void> {
    try {
      const jsonData = JSON.stringify(data);
      const finalData = encrypt ? this.encrypt(jsonData) : jsonData;
      await AsyncStorage.setItem(key, finalData);
    } catch (error) {
      console.error(`Error saving ${key}:`, error);
      throw new Error(`Failed to save ${key}`);
    }
  }

  async load<T>(key: string, decrypt: boolean = true): Promise<T | null> {
    try {
      const data = await AsyncStorage.getItem(key);
      if (!data) return null;
      
      const jsonData = decrypt ? this.decrypt(data) : data;
      return JSON.parse(jsonData) as T;
    } catch (error) {
      console.error(`Error loading ${key}:`, error);
      return null;
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Error deleting ${key}:`, error);
      throw new Error(`Failed to delete ${key}`);
    }
  }

  // User Profile Operations
  async saveUserProfile(profile: UserProfile): Promise<void> {
    await this.save(`user_profile_${profile.id}`, profile);
    await this.updateUserList(profile.id, 'add');
  }

  async loadUserProfile(userId: string): Promise<UserProfile | null> {
    return await this.load<UserProfile>(`user_profile_${userId}`);
  }

  async getCurrentUser(): Promise<UserProfile | null> {
    const currentUserId = await AsyncStorage.getItem('current_user_id');
    if (!currentUserId) return null;
    return await this.loadUserProfile(currentUserId);
  }

  async setCurrentUser(userId: string): Promise<void> {
    await AsyncStorage.setItem('current_user_id', userId);
  }

  // Child Profile Operations
  async saveChildProfile(child: ChildProfile): Promise<void> {
    await this.save(`child_profile_${child.id}`, child);
    await this.updateChildList(child.parentId, child.id, 'add');
  }

  async loadChildProfile(childId: string): Promise<ChildProfile | null> {
    return await this.load<ChildProfile>(`child_profile_${childId}`);
  }

  async getChildrenByParent(parentId: string): Promise<ChildProfile[]> {
    const childIds = await this.load<string[]>(`children_${parentId}`, false) || [];
    const children: ChildProfile[] = [];
    
    for (const childId of childIds) {
      const child = await this.loadChildProfile(childId);
      if (child) children.push(child);
    }
    
    return children;
  }

  // Lesson Plan Operations
  async saveLessonPlan(lesson: LessonPlan): Promise<void> {
    await this.save(`lesson_${lesson.id}`, lesson);
    await this.updateLessonList(lesson.creatorId, lesson.id, 'add');
  }

  async loadLessonPlan(lessonId: string): Promise<LessonPlan | null> {
    return await this.load<LessonPlan>(`lesson_${lessonId}`);
  }

  async getLessonsByCreator(creatorId: string): Promise<LessonPlan[]> {
    const lessonIds = await this.load<string[]>(`lessons_${creatorId}`, false) || [];
    const lessons: LessonPlan[] = [];
    
    for (const lessonId of lessonIds) {
      const lesson = await this.loadLessonPlan(lessonId);
      if (lesson) lessons.push(lesson);
    }
    
    return lessons.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  // Helper methods for maintaining lists
  private async updateUserList(userId: string, action: 'add' | 'remove'): Promise<void> {
    const users = await this.load<string[]>('all_users', false) || [];
    if (action === 'add' && !users.includes(userId)) {
      users.push(userId);
    } else if (action === 'remove') {
      const index = users.indexOf(userId);
      if (index > -1) users.splice(index, 1);
    }
    await this.save('all_users', users, false);
  }

  private async updateChildList(parentId: string, childId: string, action: 'add' | 'remove'): Promise<void> {
    const children = await this.load<string[]>(`children_${parentId}`, false) || [];
    if (action === 'add' && !children.includes(childId)) {
      children.push(childId);
    } else if (action === 'remove') {
      const index = children.indexOf(childId);
      if (index > -1) children.splice(index, 1);
    }
    await this.save(`children_${parentId}`, children, false);
  }

  private async updateLessonList(creatorId: string, lessonId: string, action: 'add' | 'remove'): Promise<void> {
    const lessons = await this.load<string[]>(`lessons_${creatorId}`, false) || [];
    if (action === 'add' && !lessons.includes(lessonId)) {
      lessons.push(lessonId);
    } else if (action === 'remove') {
      const index = lessons.indexOf(lessonId);
      if (index > -1) lessons.splice(index, 1);
    }
    await this.save(`lessons_${creatorId}`, lessons, false);
  }

  // Database initialization and maintenance
  async initializeDatabase(): Promise<void> {
    try {
      // Check if database is already initialized
      const isInitialized = await AsyncStorage.getItem('db_initialized');
      if (isInitialized) return;

      // Create default structure
      await this.save('all_users', [], false);
      await AsyncStorage.setItem('db_initialized', 'true');
      await AsyncStorage.setItem('db_version', '1.0.0');
      
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Database initialization failed:', error);
      throw error;
    }
  }

  // Utility methods
  async clearAllData(): Promise<void> {
    await AsyncStorage.clear();
    await this.initializeDatabase();
  }

  async exportData(): Promise<string> {
    const allKeys = await AsyncStorage.getAllKeys();
    const allData: { [key: string]: any } = {};
    
    for (const key of allKeys) {
      const value = await AsyncStorage.getItem(key);
      allData[key] = value;
    }
    
    return JSON.stringify(allData, null, 2);
  }
}