// src/components/ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div 
          className="min-h-screen flex items-center justify-center bg-gray-50"
          role="alert"
          aria-live="assertive"
        >
          <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-semibold text-red-600 mb-4">
              Something went wrong
            </h2>
            <p className="text-gray-600 mb-4">
              We're sorry, but something unexpected happened. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// components/LoadingSpinner.tsx
import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = 'Loading...', 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div 
      className="flex flex-col items-center justify-center p-8"
      role="status"
      aria-live="polite"
    >
      <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 ${sizeClasses[size]}`} />
      <span className="sr-only">{message}</span>
      <p className="mt-4 text-gray-600 text-sm">{message}</p>
    </div>
  );
};

// components/layout/AppLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
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

// components/layout/AuthLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Lesson Plan App
          </h1>
          <p className="text-gray-600">
            Accessible education management for everyone
          </p>
        </div>
        <main 
          id="main-content"
          role="main"
          aria-label="Authentication"
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

// components/layout/Header.tsx
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { AccessibilityButton } from '../AccessibilityButton';

export const Header: React.FC = () => {
  const { userProfile, signOut } = useAuth();

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
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                {userProfile?.role}
              </span>
            </div>
            
            <button
              onClick={signOut}
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

// components/layout/Navigation.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

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

  return (
    <nav 
      className="w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
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

// components/AccessibilityButton.tsx
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export const AccessibilityButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { userProfile, updateAccessibilitySettings } = useAuth();

  const toggleHighContrast = async () => {
    if (userProfile?.accessibilitySettings) {
      await updateAccessibilitySettings({
        highContrast: !userProfile.accessibilitySettings.highContrast
      });
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-label="Accessibility options"
        aria-expanded={isOpen}
        data-accessibility-menu
      >
        <span className="text-lg">♿</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
          <div className="py-1">
            <button
              onClick={toggleHighContrast}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
            >
              {userProfile?.accessibilitySettings?.highContrast ? '🔆' : '🔅'} High Contrast
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
            >
              ⚙️ More Settings
            </button>
          </div>
        </div>
      )}
    </div>
  );
};