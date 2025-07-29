// pages/auth/LoginPage.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { VoiceInput } from '../../components/VoiceInput';
import { QRCodeLogin } from '../../components/QRCodeLogin';
import { BiometricLogin } from '../../components/BiometricLogin';

interface LoginForm {
  email: string;
  password: string;
}

export const LoginPage: React.FC = () => {
  const [form, setForm] = useState<LoginForm>({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inputMethod, setInputMethod] = useState<'keyboard' | 'voice' | 'qr' | 'biometric'>('keyboard');
  const [showPassword, setShowPassword] = useState(false);
  const [attempts, setAttempts] = useState(0);
  
  const { signIn, signInWithOAuth, announceToScreenReader } = useAuth();
  const navigate = useNavigate();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  // Focus management for accessibility
  useEffect(() => {
    if (emailRef.current) {
      emailRef.current.focus();
    }
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await signIn(form.email, form.password);
      announceToScreenReader('Login successful, redirecting to dashboard');
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed');
      setAttempts(prev => prev + 1);
      announceToScreenReader(`Login failed: ${err.message}`);
      
      // Focus back to email field on error
      if (emailRef.current) {
        emailRef.current.focus();
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OAuth login
  const handleOAuthLogin = async (provider: 'google' | 'apple') => {
    setError(null);
    setIsLoading(true);

    try {
      await signInWithOAuth(provider);
      announceToScreenReader(`Signing in with ${provider}`);
    } catch (err: any) {
      setError(err.message || `${provider} login failed`);
      announceToScreenReader(`${provider} login failed: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle voice input results
  const handleVoiceInput = (field: 'email' | 'password', value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    announceToScreenReader(`${field} filled using voice input`);
  };

  // Handle QR code login
  const handleQRLogin = async (loginData: { email: string; token: string }) => {
    setError(null);
    setIsLoading(true);

    try {
      // Custom QR login logic would go here
      announceToScreenReader('QR code login successful');
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'QR login failed');
      announceToScreenReader(`QR login failed: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle biometric login
  const handleBiometricLogin = async () => {
    setError(null);
    setIsLoading(true);

    try {
      // Biometric login logic would go here
      announceToScreenReader('Biometric login successful');
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Biometric login failed');
      announceToScreenReader(`Biometric login failed: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt + V for voice input
      if (e.altKey && e.key === 'v') {
        e.preventDefault();
        setInputMethod('voice');
        announceToScreenReader('Voice input mode activated');
      }
      // Alt + Q for QR code
      if (e.altKey && e.key === 'q') {
        e.preventDefault();
        setInputMethod('qr');
        announceToScreenReader('QR code login mode activated');
      }
      // Alt + B for biometric
      if (e.altKey && e.key === 'b') {
        e.preventDefault();
        setInputMethod('biometric');
        announceToScreenReader('Biometric login mode activated');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="bg-white shadow-xl rounded-lg p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Sign In
        </h2>
        <p className="text-gray-600 mt-2">
          Access your lesson plan dashboard
        </p>
      </div>

      {/* Input Method Selector */}
      <div className="border-b border-gray-200 pb-4">
        <p className="text-sm text-gray-600 mb-3">Choose your preferred login method:</p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setInputMethod('keyboard')}
            className={`px-3 py-1 rounded-full text-sm ${
              inputMethod === 'keyboard' 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            aria-pressed={inputMethod === 'keyboard'}
          >
            ⌨️ Keyboard
          </button>
          <button
            onClick={() => setInputMethod('voice')}
            className={`px-3 py-1 rounded-full text-sm ${
              inputMethod === 'voice' 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            aria-pressed={inputMethod === 'voice'}
          >
            🎤 Voice (Alt+V)
          </button>
          <button
            onClick={() => setInputMethod('qr')}
            className={`px-3 py-1 rounded-full text-sm ${
              inputMethod === 'qr' 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            aria-pressed={inputMethod === 'qr'}
          >
            📱 QR Code (Alt+Q)
          </button>
          <button
            onClick={() => setInputMethod('biometric')}
            className={`px-3 py-1 rounded-full text-sm ${
              inputMethod === 'biometric' 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            aria-pressed={inputMethod === 'biometric'}
          >
            👤 Biometric (Alt+B)
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div 
          className="bg-red-50 border border-red-200 rounded-md p-4"
          role="alert"
          aria-live="assertive"
        >
          <p className="text-sm text-red-800">{error}</p>
          {attempts >= 3 && (
            <p className="text-sm text-red-600 mt-2">
              Having trouble? Try <button 
                onClick={() => setInputMethod('voice')}
                className="underline hover:no-underline"
              >
                voice input
              </button> or contact support.
            </p>
          )}
        </div>
      )}

      {/* Login Forms based on input method */}
      {inputMethod === 'keyboard' && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              ref={emailRef}
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
              aria-describedby="email-help"
              autoComplete="email"
            />
            <p id="email-help" className="text-sm text-gray-500 mt-1">
              Enter your registered email address
            </p>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                ref={passwordRef}
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => setForm(prev => ({ ...prev, password: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                aria-describedby="password-help"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                <span className="text-gray-400">
                  {showPassword ? '🙈' : '👁️'}
                </span>
              </button>
            </div>
            <p id="password-help" className="text-sm text-gray-500 mt-1">
              Enter your password
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
      )}

      {inputMethod === 'voice' && (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <h3 className="font-medium text-blue-900 mb-2">Voice Input Mode</h3>
            <p className="text-sm text-blue-800">
              Click the microphone buttons to speak your email and password
            </p>
          </div>
          
          <VoiceInput
            onResult={(value) => handleVoiceInput('email', value)}
            placeholder="Email Address"
            value={form.email}
            fieldType="email"
          />
          
          <VoiceInput
            onResult={(value) => handleVoiceInput('password', value)}
            placeholder="Password"
            value={form.password}
            fieldType="password"
          />
          
          <button
            onClick={handleSubmit}
            disabled={isLoading || !form.email || !form.password}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            {isLoading ? 'Signing In...' : 'Sign In with Voice'}
          </button>
        </div>
      )}

      {inputMethod === 'qr' && (
        <QRCodeLogin 
          onLogin={handleQRLogin}
          isLoading={isLoading}
        />
      )}

      {inputMethod === 'biometric' && (
        <BiometricLogin 
          onLogin={handleBiometricLogin}
          isLoading={isLoading}
        />
      )}

      {/* OAuth Options */}
      <div className="space-y-3">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleOAuthLogin('google')}
            disabled={isLoading}
            className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google
          </button>
          
          <button
            onClick={() => handleOAuthLogin('apple')}
            disabled={isLoading}
            className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="currentColor" d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
            </svg>
            Apple
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{