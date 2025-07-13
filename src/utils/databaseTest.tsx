/*
 * DATABASE TEST SUITE
 * Path: src/database/testDatabase.ts
 * 
 * Dependencies: Same as schema.ts (auto-installed)
 * Imports from: ./schema.ts
 * 
 * Usage:
 * import { runDatabaseTests, clearDatabaseForTesting } from './testDatabase';
 * await runDatabaseTests(); // Run all tests
 * await clearDatabaseForTesting(); // Clear test data
 */

import { DatabaseManager, UserProfile, ChildProfile, LessonPlan } from './schema';

export class DatabaseTester {
  private db: DatabaseManager;

  constructor() {
    this.db = DatabaseManager.getInstance();
  }

  // Sample data generators
  private generateSampleUser(): UserProfile {
    const id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    return {
      id,
      userType: 'teacher',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@school.edu',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      preferences: {
        theme: 'light',
        language: 'en',
        notifications: true,
        accessibility: {
          fontSize: 'medium',
          highContrast: false,
          screenReader: false
        }
      }
    };
  }

  private generateSampleParent(): UserProfile {
    const id = `parent_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    return {
      id,
      userType: 'parent',
      name: 'Michael Chen',
      email: 'michael.chen@email.com',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      preferences: {
        theme: 'system',
        language: 'en',
        notifications: true,
        accessibility: {
          fontSize: 'large',
          highContrast: true,
          screenReader: false
        }
      }
    };
  }

  private generateSampleChild(parentId: string): ChildProfile {
    const id = `child_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    return {
      id,
      parentId,
      name: 'Emma Chen',
      grade: '3rd Grade',
      subjects: ['Math', 'Reading', 'Science', 'Art'],
      learningStyle: ['Visual', 'Kinesthetic'],
      accommodations: ['Extra time for tests', 'Quiet workspace'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  private generateSampleLesson(creatorId: string): LessonPlan {
    const id = `lesson_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    return {
      id,
      creatorId,
      title: 'Introduction to Fractions',
      subject: 'Mathematics',
      grade: '3rd Grade',
      duration: 45,
      objectives: [
        'Students will understand what a fraction represents',
        'Students will identify numerator and denominator',
        'Students will create simple fractions using manipulatives'
      ],
      materials: ['Fraction circles', 'Whiteboard', 'Student worksheets', 'Colored pencils'],
      activities: [
        {
          id: 'activity_1',
          title: 'Warm-up: Pizza Party',
          description: 'Students discuss sharing pizza equally among friends',
          duration: 10,
          type: 'warmup',
          materials: ['Pizza visual aids'],
          accessibility: ['Visual supports', 'Peer discussion']
        },
        {
          id: 'activity_2',
          title: 'Fraction Introduction',
          description: 'Teacher demonstrates fractions using physical manipulatives',
          duration: 15,
          type: 'instruction',
          materials: ['Fraction circles', 'Whiteboard'],
          accessibility: ['Hands-on manipulatives', 'Visual demonstration']
        },
        {
          id: 'activity_3',
          title: 'Guided Practice',
          description: 'Students work in pairs to create fractions',
          duration: 15,
          type: 'practice',
          materials: ['Fraction circles', 'Worksheets'],
          accessibility: ['Peer support', 'Manipulatives available']
        },
        {
          id: 'activity_4',
          title: 'Quick Check',
          description: 'Students show understanding using hand signals',
          duration: 5,
          type: 'assessment',
          materials: ['Assessment rubric'],
          accessibility: ['Multiple response options']
        }
      ],
      assessment: {
        type: 'formative',
        methods: ['Observation', 'Exit ticket', 'Peer discussion'],
        criteria: ['Identifies fractions correctly', 'Uses proper vocabulary', 'Demonstrates understanding with manipulatives'],
        accommodations: ['Extended time', 'Visual supports', 'Oral responses allowed']
      },
      adaptations: [
        'Simplified fractions for struggling learners',
        'Extended practice for advanced students',
        'Visual supports for ELL students'
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  // Test methods
  async testDatabaseInitialization(): Promise<void> {
    console.log('🔄 Testing database initialization...');
    try {
      await this.db.initializeDatabase();
      console.log('✅ Database initialized successfully');
    } catch (error) {
      console.error('❌ Database initialization failed:', error);
      throw error;
    }
  }

  async testUserOperations(): Promise<UserProfile> {
    console.log('🔄 Testing user operations...');
    
    // Create and save user
    const user = this.generateSampleUser();
    await this.db.saveUserProfile(user);
    console.log('✅ User saved:', user.name);
    
    // Load user
    const loadedUser = await this.db.loadUserProfile(user.id);
    if (!loadedUser) throw new Error('User not found after save');
    console.log('✅ User loaded:', loadedUser.name);
    
    // Set as current user
    await this.db.setCurrentUser(user.id);
    const currentUser = await this.db.getCurrentUser();
    if (!currentUser || currentUser.id !== user.id) {
      throw new Error('Current user not set correctly');
    }
    console.log('✅ Current user set:', currentUser.name);
    
    return user;
  }

  async testChildOperations(parentId: string): Promise<ChildProfile> {
    console.log('🔄 Testing child operations...');
    
    // Create and save child
    const child = this.generateSampleChild(parentId);
    await this.db.saveChildProfile(child);
    console.log('✅ Child saved:', child.name);
    
    // Load child
    const loadedChild = await this.db.loadChildProfile(child.id);
    if (!loadedChild) throw new Error('Child not found after save');
    console.log('✅ Child loaded:', loadedChild.name);
    
    // Get children by parent
    const children = await this.db.getChildrenByParent(parentId);
    if (children.length === 0) throw new Error('No children found for parent');
    console.log('✅ Children retrieved for parent:', children.length);
    
    return child;
  }

  async testLessonOperations(creatorId: string): Promise<LessonPlan> {
    console.log('🔄 Testing lesson operations...');
    
    // Create and save lesson
    const lesson = this.generateSampleLesson(creatorId);
    await this.db.saveLessonPlan(lesson);
    console.log('✅ Lesson saved:', lesson.title);
    
    // Load lesson
    const loadedLesson = await this.db.loadLessonPlan(lesson.id);
    if (!loadedLesson) throw new Error('Lesson not found after save');
    console.log('✅ Lesson loaded:', loadedLesson.title);
    
    // Get lessons by creator
    const lessons = await this.db.getLessonsByCreator(creatorId);
    if (lessons.length === 0) throw new Error('No lessons found for creator');
    console.log('✅ Lessons retrieved for creator:', lessons.length);
    
    return lesson;
  }

  async testEncryption(): Promise<void> {
    console.log('🔄 Testing encryption...');
    
    const sensitiveData = {
      password: 'secret123',
      personalInfo: 'Sensitive user data'
    };
    
    // Save encrypted data
    await this.db.save('test_encryption', sensitiveData, true);
    console.log('✅ Encrypted data saved');
    
    // Load encrypted data
    const decryptedData = await this.db.load<typeof sensitiveData>('test_encryption', true);
    if (!decryptedData || decryptedData.password !== sensitiveData.password) {
      throw new Error('Encryption/decryption failed');
    }
    console.log('✅ Encrypted data loaded and decrypted correctly');
    
    // Clean up
    await this.db.delete('test_encryption');
  }

  async testCompleteWorkflow(): Promise<void> {
    console.log('🔄 Testing complete workflow...');
    
    // Create parent and child
    const parent = this.generateSampleParent();
    await this.db.saveUserProfile(parent);
    
    const child = this.generateSampleChild(parent.id);
    await this.db.saveChildProfile(child);
    
    // Create teacher and lesson
    const teacher = this.generateSampleUser();
    await this.db.saveUserProfile(teacher);
    
    const lesson = this.generateSampleLesson(teacher.id);
    await this.db.saveLessonPlan(lesson);
    
    // Verify all data exists
    const loadedParent = await this.db.loadUserProfile(parent.id);
    const loadedChild = await this.db.loadChildProfile(child.id);
    const loadedTeacher = await this.db.loadUserProfile(teacher.id);
    const loadedLesson = await this.db.loadLessonPlan(lesson.id);
    
    if (!loadedParent || !loadedChild || !loadedTeacher || !loadedLesson) {
      throw new Error('Complete workflow test failed');
    }
    
    console.log('✅ Complete workflow test passed');
    console.log(`   - Parent: ${loadedParent.name}`);
    console.log(`   - Child: ${loadedChild.name}`);
    console.log(`   - Teacher: ${loadedTeacher.name}`);
    console.log(`   - Lesson: ${loadedLesson.title}`);
  }

  // Main test runner
  async runAllTests(): Promise<void> {
    console.log('🚀 Starting database tests...\n');
    
    try {
      await this.testDatabaseInitialization();
      await this.testEncryption();
      
      const user = await this.testUserOperations();
      const child = await this.testChildOperations(user.id);
      const lesson = await this.testLessonOperations(user.id);
      
      await this.testCompleteWorkflow();
      
      console.log('\n🎉 All database tests passed successfully!');
      console.log('\nDatabase is ready for production use.');
      
    } catch (error) {
      console.error('\n💥 Database test failed:', error);
      throw error;
    }
  }

  // Utility method to clear test data
  async clearTestData(): Promise<void> {
    console.log('🧹 Clearing test data...');
    await this.db.clearAllData();
    console.log('✅ Test data cleared');
  }
}

// Usage example for testing
export const runDatabaseTests = async (): Promise<void> => {
  const tester = new DatabaseTester();
  await tester.runAllTests();
};

// For development debugging
export const clearDatabaseForTesting = async (): Promise<void> => {
  const tester = new DatabaseTester();
  await tester.clearTestData();
};