// File: src/services/auth.ts
// Authentication service for lesson plan app
// Destination: <MY-APP>/src/services/auth.ts

import { 
  LoginCredentials, 
  RegisterCredentials, 
  AuthResponse, 
  TokenPayload, 
  User,
  AuthError 
} from "../types/auth";
import { encryptionService } from './encryption';
import { storageService } from './storage';
import { apiClient } from './api';

class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly USER_KEY = 'user_data';

  /**
   * Authenticate user with email and password
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', {
        email: credentials.email.toLowerCase().trim(),
        password: credentials.password,
        rememberMe: credentials.rememberMe || false
      });

      const { user, token, refreshToken, expiresIn } = response.data;

      // Store tokens securely
      await this.storeTokens(token, refreshToken);
      
      // Store user data with encryption
      await this.storeUserData(user);

      return response.data;
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Register new user account
   */
  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/register', {
        email: credentials.email.toLowerCase().trim(),
        password: credentials.password,
        name: credentials.name.trim(),
        role: credentials.role
      });

      const { user, token, refreshToken } = response.data;

      // Store tokens and user data
      await this.storeTokens(token, refreshToken);
      await this.storeUserData(user);

      return response.data;
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Logout user and clear stored data
   */
  async logout(): Promise<void> {
    try {
      const refreshToken = await this.getRefreshToken();
      
      if (refreshToken) {
        // Notify server about logout
        await apiClient.post('/auth/logout', { refreshToken });
      }
    } catch (error) {
      // Continue with local logout even if server request fails
      console.warn('Server logout failed:', error);
    } finally {
      // Clear all stored auth data
      await this.clearAuthData();
    }
  }

  /**
   * Refresh authentication token
   */
  async refreshToken(): Promise<string> {
    try {
      const refreshToken = await this.getRefreshToken();
      
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await apiClient.post<{ token: string; expiresIn: number }>('/auth/refresh', {
        refreshToken
      });

      const { token } = response.data;
      await storageService.setSecure(this.TOKEN_KEY, token);

      return token;
    } catch (error) {
      // Clear auth data if refresh fails
      await this.clearAuthData();
      throw this.handleAuthError(error);
    }
  }

  /**
   * Get current authentication token
   */
  async getToken(): Promise<string | null> {
    try {
      return await storageService.getSecure(this.TOKEN_KEY);
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  }

  /**
   * Get current user data
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const encryptedUserData = await storageService.getSecure(this.USER_KEY);
      
      if (!encryptedUserData) {
        return null;
      }

      const userData = await encryptionService.decrypt(encryptedUserData);
      return JSON.parse(userData) as User;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      const token = await this.getToken();
      
      if (!token) {
        return false;
      }

      // Check if token is expired
      const payload = this.decodeToken(token);
      const now = Date.now() / 1000;
      
      return payload.exp > now;
    } catch (error) {
      return false;
    }
  }

  /**
   * Request password reset
   */
  async forgotPassword(email: string): Promise<void> {
    try {
      await apiClient.post('/auth/forgot-password', {
        email: email.toLowerCase().trim()
      });
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Reset password with token
   */
  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      await apiClient.post('/auth/reset-password', {
        token,
        newPassword
      });
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Change user password
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      await apiClient.post('/auth/change-password', {
        currentPassword,
        newPassword
      });
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(updates: Partial<User>): Promise<User> {
    try {
      const response = await apiClient.put<User>('/auth/profile', updates);
      
      // Update stored user data
      await this.storeUserData(response.data);
      
      return response.data;
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  // Private helper methods

  private async storeTokens(token: string, refreshToken: string): Promise<void> {
    await Promise.all([
      storageService.setSecure(this.TOKEN_KEY, token),
      storageService.setSecure(this.REFRESH_TOKEN_KEY, refreshToken)
    ]);
  }

  private async storeUserData(user: User): Promise<void> {
    const encryptedUserData = await encryptionService.encrypt(JSON.stringify(user));
    await storageService.setSecure(this.USER_KEY, encryptedUserData);
  }

  private async getRefreshToken(): Promise<string | null> {
    return await storageService.getSecure(this.REFRESH_TOKEN_KEY);
  }

  private async clearAuthData(): Promise<void> {
    await Promise.all([
      storageService.remove(this.TOKEN_KEY),
      storageService.remove(this.REFRESH_TOKEN_KEY),
      storageService.remove(this.USER_KEY)
    ]);
  }

  private decodeToken(token: string): TokenPayload {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload);
  }

  private handleAuthError(error: any): AuthError {
    if (error.response?.data) {
      return {
        code: error.response.data.code || 'AUTH_ERROR',
        message: error.response.data.message || 'Authentication failed',
        details: error.response.data.details
      };
    }

    return {
      code: 'NETWORK_ERROR',
      message: 'Network error occurred during authentication',
      details: { originalError: error.message }
    };
  }
}

export const authService = new AuthService();