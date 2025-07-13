// File: src/services/api.ts
// HTTP API client with authentication and error handling
// Destination: <MY-APP>/src/services/api.ts

import { storageService } from './storage';

interface ApiResponse<T = any> {
  data: T;
  status: number;
  headers: Record<string, string>;
}

interface ApiError {
  code: string;
  message: string;
  status: number;
  details?: any;
}

class ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;
  private requestInterceptors: ((config: RequestConfig) => RequestConfig)[] = [];
  private responseInterceptors: ((response: ApiResponse) => ApiResponse)[] = [];

  constructor(baseURL: string = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api') {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    // Add auth interceptor
    this.addRequestInterceptor(this.addAuthHeader.bind(this));
    this.addResponseInterceptor(this.handleAuthErrors.bind(this));
  }

  /**
   * Add request interceptor
   */
  addRequestInterceptor(interceptor: (config: RequestConfig) => RequestConfig): void {
    this.requestInterceptors.push(interceptor);
  }

  /**
   * Add response interceptor
   */
  addResponseInterceptor(interceptor: (response: ApiResponse) => ApiResponse): void {
    this.responseInterceptors.push(interceptor);
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'POST', data });
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'PUT', data });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }

  /**
   * PATCH request
   