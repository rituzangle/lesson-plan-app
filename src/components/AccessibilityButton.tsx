// src/components/AccessibilityButton.tsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext'; // Update path if using src/context/

interface AccessibilityButtonProps {
  className?: string;
}

export const AccessibilityButton: React.FC<AccessibilityButtonProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { userProfile, updateAccessibilitySettings } = useAuth();

  const toggleHighContrast = async () => {
    if (userProfile?.accessibilitySettings) {
      await updateAccessibilitySettings({
        highContrast: !userProfile.accessibilitySettings.highContrast
      });
    }
  };

  const toggleVoiceEnabled = async () => {
    if (userProfile?.accessibilitySettings) {
      await updateAccessibilitySettings({
        voiceEnabled: !userProfile.accessibilitySettings.voiceEnabled
      });
    }
  };

  const toggleReducedMotion = async () => {
    if (userProfile?.accessibilitySettings) {
      await updateAccessibilitySettings({
        reducedMotion: !userProfile.accessibilitySettings.reducedMotion
      });
    }
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-label="Accessibility options"
        aria-expanded={isOpen}
        data-accessibility-menu
      >
        <span className="text-lg" role="img" aria-label="Accessibility">♿</span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          
          {/* Menu */}
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg border border-gray-200 z-20">
            <div className="py-2">
              <div className="px-4 py-2 border-b border-gray-200">
                <h3 className="text-sm font-medium text-gray-900">Quick Settings</h3>
              </div>
              
              <button
                onClick={toggleHighContrast}
                className="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
              >
                <span className="flex items-center">
                  <span className="mr-2">
                    {userProfile?.accessibilitySettings?.highContrast ? '🔆' : '🔅'}
                  </span>
                  High Contrast
                </span>
                <span className={`w-4 h-4 rounded-full ${
                  userProfile?.accessibilitySettings?.highContrast ? 'bg-blue-600' : 'bg-gray-300'
                }`} />
              </button>
              
              <button
                onClick={toggleVoiceEnabled}
                className="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
              >
                <span className="flex items-center">
                  <span className="mr-2">🎤</span>
                  Voice Input
                </span>
                <span className={`w-4 h-4 rounded-full ${
                  userProfile?.accessibilitySettings?.voiceEnabled ? 'bg-blue-600' : 'bg-gray-300'
                }`} />
              </button>
              
              <button
                onClick={toggleReducedMotion}
                className="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
              >
                <span className="flex items-center">
                  <span className="mr-2">🎭</span>
                  Reduce Motion
                </span>
                <span className={`w-4 h-4 rounded-full ${
                  userProfile?.accessibilitySettings?.reducedMotion ? 'bg-blue-600' : 'bg-gray-300'
                }`} />
              </button>
              
              <div className="border-t border-gray-200 mt-2 pt-2">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    // Navigate to accessibility page - you'll need to implement this
                    window.location.href = '/accessibility';
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                >
                  <span className="mr-2">⚙️</span>
                  More Settings
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// src/components/layout/AppLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Update path if using src/context/
import { Navigation } from './Navigation';
import { Header } from './Header';

export const AppLayout: React.FC = () => {
  const { userProfile } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Navigation />
        <main 
          id="main-content"
          className="flex-1 p-6"
          role="main"
          aria-label="Main content"
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

// src/components/layout/Header.tsx
import React from 'react';
import { useAuth } from '../context/AuthContext'; // Update path if using src/context/
import { AccessibilityButton } from '../AccessibilityButton';

export const Header: React.FC = () => {
  const { userProfile, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900">
              Lesson Plan App
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <AccessibilityButton />
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                {userProfile?.firstName} {userProfile?.lastName}
              </span>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full capitalize">
                {userProfile?.role}
              </span>
            </div>
            
            <button
              onClick={handleSignOut}
              className="text-sm text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md px-2 py-1"
              aria-label="Sign out"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

// src/components/layout/Navigation.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Update path if using src/context/

export const Navigation: React.FC = () => {
  const { userProfile } = useAuth();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/lessons', label: 'Lessons', icon: '📚' },
    { path: '/classes', label: 'Classes', icon: '🎓' },
    { path: '/reports', label: 'Reports', icon: '📈' },
    { path: '/profile', label: 'Profile', icon: '👤' },
    { path: '/accessibility', label: 'Accessibility', icon: '♿' },
  ];

  // Filter nav items based on user role if needed
  const filteredNavItems = navItems.filter(item => {
    // Add role-based filtering logic here if needed
    // For now, show all items to all roles
    return true;
  });

  return (
    <nav 
      className="w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="p-4">
        <ul className="space-y-2">
          {filteredNavItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-900'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
                aria-current={({ isActive }) => isActive ? 'page' : undefined}
              >
                <span className="text-lg" aria-hidden="true">
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};