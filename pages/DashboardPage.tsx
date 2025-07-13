// pages/DashboardPage.tsx
// placeholder page components to test routing:

import React from 'react';
import { useAuth } from '../contexts/AuthContext';

export const DashboardPage: React.FC = () => {
  const { userProfile } = useAuth();

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Welcome, {userProfile?.firstName}!
        </h1>
        <p className="text-gray-600">
          This is your main dashboard. Role-specific content will be implemented based on your role: {userProfile?.role}
        </p>
      </div>
    </div>
  );
};

// pages/admin/AdminDashboard.tsx
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

export const AdminDashboard: React.FC = () => {
  const { userProfile } = useAuth();

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 mb-4">
          Welcome, {userProfile?.firstName}! You have administrator privileges.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-900">User Management</h3>
            <p className="text-sm text-blue-700">Manage teachers and students</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-900">School Settings</h3>
            <p className="text-sm text-green-700">Configure school-wide settings</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-semibold text-purple-900">Reports</h3>
            <p className="text-sm text-purple-700">View system-wide analytics</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// pages/teacher/TeacherDashboard.tsx
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

export const TeacherDashboard: React.FC = () => {
  const { userProfile } = useAuth();

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Teacher Dashboard
        </h1>
        <p className="text-gray-600 mb-4">
          Welcome back, {userProfile?.firstName}! Ready to create some amazing lessons?
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-900">My Classes</h3>
            <p className="text-sm text-blue-700">View and manage your classes</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-900">Lesson Plans</h3>
            <p className="text-sm text-green-700">Create and edit lesson plans</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="font-semibold text-yellow-900">Assignments</h3>
            <p className="text-sm text-yellow-700">Track student progress</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-semibold text-purple-900">Resources</h3>
            <p className="text-sm text-purple-700">Access teaching materials</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// pages/student/StudentDashboard.tsx
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

export const StudentDashboard: React.FC = () => {
  const { userProfile } = useAuth();

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Student Dashboard
        </h1>
        <p className="text-gray-600 mb-4">
          Hi {userProfile?.firstName}! Here's what's happening in your classes.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-900">My Classes</h3>
            <p className="text-sm text-blue-700">View your enrolled classes</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-900">Assignments</h3>
            <p className="text-sm text-green-700">Complete your assignments</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="font-semibold text-yellow-900">Grades</h3>
            <p className="text-sm text-yellow-700">Check your progress</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-semibold text-purple-900">Resources</h3>
            <p className="text-sm text-purple-700">Access study materials</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// pages/ProfilePage.tsx
import React from 'react';
import { useAuth } from '../contexts/AuthContext';

export const ProfilePage: React.FC = () => {
  const { userProfile } = useAuth();

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Profile Settings
        </h1>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <p className="mt-1 text-sm text-gray-600">
              {userProfile?.firstName} {userProfile?.lastName}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <p className="mt-1 text-sm text-gray-600">{userProfile?.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <p className="mt-1 text-sm text-gray-600 capitalize">{userProfile?.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// pages/AccessibilityPage.tsx
import React from 'react';
import { useAuth } from '../contexts/AuthContext';

export const AccessibilityPage: React.FC = () => {
  const { userProfile, updateAccessibilitySettings } = useAuth();

  const handleSettingChange = async (setting: string, value: any) => {
    await updateAccessibilitySettings({ [setting]: value });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Accessibility Settings
        </h1>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">High Contrast</label>
              <p className="text-sm text-gray-500">Increase color contrast for better visibility</p>
            </div>
            <button
              onClick={() => handleSettingChange('highContrast', !userProfile?.accessibilitySettings?.highContrast)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                userProfile?.accessibilitySettings?.highContrast ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                userProfile?.accessibilitySettings?.highContrast ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Voice Input</label>
              <p className="text-sm text-gray-500">Enable voice input for forms</p>
            </div>
            <button
              onClick={() => handleSettingChange('voiceEnabled', !userProfile?.accessibilitySettings?.voiceEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                userProfile?.accessibilitySettings?.voiceEnabled ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                userProfile?.accessibilitySettings?.voiceEnabled ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Font Size</label>
            <select
              value={userProfile?.accessibilitySettings?.fontSize || 'medium'}
              onChange={(e) => handleSettingChange('fontSize', e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
              <option value="xl">Extra Large</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

// pages/auth/SignUpPage.tsx
import React from 'react';

export const SignUpPage: React.FC = () => {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        Sign Up
      </h2>
      <p className="text-gray-600">
        Sign up form will be implemented next. This is a placeholder.
      </p>
    </div>
  );
};

// pages/NotFoundPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-6">
          The page you're looking for doesn't exist.
        </p>
        <Link
          to="/"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
};
