/*
 * USER ONBOARDING FLOW
 * Path: src/components/UserOnboarding.tsx
 * 
 * Dependencies (auto-install):
 * npm install @react-native-async-storage/async-storage crypto-js
 * npm install --save-dev @types/crypto-js
 * 
 * Self-healing script: npm run setup:onboarding
 * Add to package.json scripts:
 * "setup:onboarding": "npm install @react-native-async-storage/async-storage crypto-js && npm install --save-dev @types/crypto-js"
 * 
 * Imports from:
 * - ../database/schema (DatabaseManager, UserProfile, ChildProfile)
 * - ../database/testDatabase (runDatabaseTests)
 * 
 * Usage:
 * import UserOnboarding from './components/UserOnboarding';
 * <UserOnboarding />
 */

import React, { useState, useEffect } from 'react';
import { DatabaseManager, UserProfile, ChildProfile } from '../database/schema';
import { runDatabaseTests } from '../database/testDatabase';

const UserOnboarding = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [userType, setUserType] = useState<'teacher' | 'parent' | 'student' | null>(null);
  const [userProfile, setUserProfile] = useState<Partial<UserProfile>>({});
  const [childProfiles, setChildProfiles] = useState<Partial<ChildProfile>[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState<string>('');

  const db = DatabaseManager.getInstance();

  useEffect(() => {
    // Initialize database on component mount
    const initDb = async () => {
      try {
        await db.initializeDatabase();
        console.log('Database initialized');
      } catch (error) {
        console.error('Database initialization failed:', error);
      }
    };
    initDb();
  }, []);

  const steps = [
    'Welcome',
    'User Type Selection',
    'Profile Setup',
    'Child Setup', // Only for parents
    'Preferences',
    'Complete'
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleUserTypeSelect = (type: 'teacher' | 'parent' | 'student') => {
    setUserType(type);
    setUserProfile({ userType: type });
    handleNext();
  };

  const handleProfileSave = async (profile: Partial<UserProfile>) => {
    setIsLoading(true);
    try {
      const fullProfile: UserProfile = {
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        userType: userType!,
        name: profile.name || '',
        email: profile.email || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        preferences: profile.preferences || {
          theme: 'system',
          language: 'en',
          notifications: true,
          accessibility: {
            fontSize: 'medium',
            highContrast: false,
            screenReader: false
          }
        }
      };
      
      await db.saveUserProfile(fullProfile);
      await db.setCurrentUser(fullProfile.id);
      setUserProfile(fullProfile);
      handleNext();
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChildAdd = () => {
    setChildProfiles([...childProfiles, { name: '', grade: '', subjects: [], learningStyle: [], accommodations: [] }]);
  };

  const handleChildSave = async () => {
    if (!userProfile.id) return;
    
    setIsLoading(true);
    try {
      for (const child of childProfiles) {
        if (child.name && child.grade) {
          const fullChild: ChildProfile = {
            id: `child_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            parentId: userProfile.id,
            name: child.name,
            grade: child.grade,
            subjects: child.subjects || [],
            learningStyle: child.learningStyle || [],
            accommodations: child.accommodations || [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          await db.saveChildProfile(fullChild);
        }
      }
      handleNext();
    } catch (error) {
      console.error('Error saving children:', error);
      alert('Failed to save children. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const runTests = async () => {
    setIsLoading(true);
    setTestResults('Running database tests...\n');
    
    try {
      // Capture console output for test results
      const originalLog = console.log;
      let testOutput = '';
      
      console.log = (...args) => {
        testOutput += args.join(' ') + '\n';
        originalLog(...args);
      };
      
      await runDatabaseTests();
      
      console.log = originalLog;
      setTestResults(testOutput);
    } catch (error) {
      setTestResults(`Test failed: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const WelcomeStep = () => (
    <div className="text-center space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Welcome to K12 Lesson Planner</h1>
      <p className="text-lg text-gray-600">Your comprehensive tool for creating inclusive, accessible lesson plans</p>
      <div className="space-y-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-900">✨ Features</h3>
          <ul className="text-sm text-blue-800 mt-2 space-y-1">
            <li>• Accessibility-first design</li>
            <li>• Performing arts curriculum integration</li>
            <li>• Multi-user support (Teachers, Parents, Students)</li>
            <li>• Encrypted data storage</li>
          </ul>
        </div>
        <button
          onClick={runTests}
          disabled={isLoading}
          className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          {isLoading ? 'Testing...' : 'Test Database'}
        </button>
        {testResults && (
          <div className="bg-gray-100 p-4 rounded-lg text-left">
            <h4 className="font-semibold mb-2">Test Results:</h4>
            <pre className="text-xs overflow-auto max-h-40">{testResults}</pre>
          </div>
        )}
      </div>
      <button
        onClick={handleNext}
        className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700"
      >
        Get Started
      </button>
    </div>
  );

  const UserTypeStep = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center">Who are you?</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => handleUserTypeSelect('teacher')}
          className="p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
        >
          <div className="text-4xl mb-2">👩‍🏫</div>
          <h3 className="font-semibold text-lg">Teacher</h3>
          <p className="text-sm text-gray-600">Create lesson plans, track student progress</p>
        </button>
        <button
          onClick={() => handleUserTypeSelect('parent')}
          className="p-6 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
        >
          <div className="text-4xl mb-2">👨‍👩‍👧‍👦</div>
          <h3 className="font-semibold text-lg">Parent</h3>
          <p className="text-sm text-gray-600">Support your child's learning at home</p>
        </button>
        <button
          onClick={() => handleUserTypeSelect('student')}
          className="p-6 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors"
        >
          <div className="text-4xl mb-2">👨‍🎓</div>
          <h3 className="font-semibold text-lg">Student</h3>
          <p className="text-sm text-gray-600">Access lessons and track your progress</p>
        </button>
      </div>
    </div>
  );

  const ProfileSetupStep = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-center">Tell us about yourself</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your full name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your email"
            />
          </div>
          <button
            onClick={() => handleProfileSave({ name, email })}
            disabled={!name || isLoading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Saving...' : 'Continue'}
          </button>
        </div>
      </div>
    );
  };

  const ChildSetupStep = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center">Add Your Children</h2>
      <p className="text-center text-gray-600">Tell us about the children you'd like to create lessons for</p>
      
      {childProfiles.map((child, index) => (
        <div key={index} className="bg-gray-50 p-4 rounded-lg space-y-3">
          <h3 className="font-semibold">Child {index + 1}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Child's name"
              value={child.name || ''}
              onChange={(e) => {
                const updated = [...childProfiles];
                updated[index].name = e.target.value;
                setChildProfiles(updated);
              }}
              className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={child.grade || ''}
              onChange={(e) => {
                const updated = [...childProfiles];
                updated[index].grade = e.target.value;
                setChildProfiles(updated);
              }}
              className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select grade</option>
              <option value="Pre-K">Pre-K</option>
              <option value="Kindergarten">Kindergarten</option>
              <option value="1st Grade">1st Grade</option>
              <option value="2nd Grade">2nd Grade</option>
              <option value="3rd Grade">3rd Grade</option>
              <option value="4th Grade">4th Grade</option>
              <option value="5th Grade">5th Grade</option>
              <option value="6th Grade">6th Grade</option>
              <option value="7th Grade">7th Grade</option>
              <option value="8th Grade">8th Grade</option>
              <option value="9th Grade">9th Grade</option>
              <option value="10th Grade">10th Grade</option>
              <option value="11th Grade">11th Grade</option>
              <option value="12th Grade">12th Grade</option>
            </select>
          </div>
        </div>
      ))}
      
      <div className="flex space-x-4">
        <button
          onClick={handleChildAdd}
          className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
        >
          Add Child
        </button>
        <button
          onClick={handleChildSave}
          disabled={childProfiles.length === 0 || isLoading}
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : 'Continue'}
        </button>
      </div>
    </div>
  );

  const CompleteStep = () => (
    <div className="text-center space-y-6">
      <div className="text-6xl">🎉</div>
      <h2 className="text-2xl font-bold">Welcome aboard!</h2>
      <p className="text-gray-600">Your profile has been created successfully.</p>
      <div className="bg-green-50 p-4 rounded-lg">
        <h3 className="font-semibold text-green-900">What's next?</h3>
        <ul className="text-sm text-green-800 mt-2 space-y-1">
          <li>• Explore the lesson planning tools</li>
          <li>• Browse the performing arts curriculum</li>
          <li>• Customize your accessibility preferences</li>
          <li>• Start creating your first lesson plan</li>
        </ul>
      </div>
      <button
        onClick={() => alert('Navigate to main app!')}
        className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700"
      >
        Enter App
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Step {currentStep + 1} of {steps.length}</span>
            <span>{steps[currentStep]}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {currentStep === 0 && <WelcomeStep />}
          {currentStep === 1 && <UserTypeStep />}
          {currentStep === 2 && <ProfileSetupStep />}
          {currentStep === 3 && userType === 'parent' && <ChildSetupStep />}
          {currentStep === 3 && userType !== 'parent' && handleNext()}
          {currentStep === 4 && <div className="text-center"><p>Preferences setup coming soon...</p><button onClick={handleNext} className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg">Skip for now</button></div>}
          {currentStep === 5 && <CompleteStep />}
        </div>

        {/* Navigation */}
        {currentStep > 0 && currentStep < steps.length - 1 && (
          <div className="mt-6 flex justify-between">
            <button
              onClick={handleBack}
              className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
            >
              Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserOnboarding;