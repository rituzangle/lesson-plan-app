/**
 * storageErrors.ts
 * 
 * Centralized error handling for storage operations
 * Final destination: src/utils/storageErrors.ts
 * 
 * Provides type-safe error handling with recovery strategies
 */

/**
 * Storage error types
 */
export enum StorageErrorType {
  READ_ERROR = 'READ_ERROR',
  WRITE_ERROR = 'WRITE_ERROR',
  DELETE_ERROR = 'DELETE_ERROR',
  BATCH_ERROR = 'BATCH_ERROR',
  ENCRYPTION_ERROR = 'ENCRYPTION_ERROR',
  DECRYPTION_ERROR = 'DECRYPTION_ERROR',
  QUOTA_EXCEEDED = 'QUOTA_EXCEEDED',
  CORRUPTION_ERROR = 'CORRUPTION_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  PERMISSION_ERROR = 'PERMISSION_ERROR',
  MIGRATION_ERROR = 'MIGRATION_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

/**
 * Storage error severity levels
 */
export enum ErrorSeverity {
  LOW = 'LOW',           // Non-critical, app can continue
  MEDIUM = 'MEDIUM',     // Important, may affect functionality
  HIGH = 'HIGH',         // Critical, immediate attention needed
  CRITICAL = 'CRITICAL'  // Fatal, app cannot continue
}

/**
 * Recovery strategies for different error types
 */
export enum RecoveryStrategy {
  RETRY = 'RETRY',
  FALLBACK = 'FALLBACK',
  CLEAR_AND_RETRY = 'CLEAR_AND_RETRY',
  RESTORE_BACKUP = 'RESTORE_BACKUP',
  MANUAL_INTERVENTION = 'MANUAL_INTERVENTION',
  NONE = 'NONE'
}

/**
 * Error context interface
 */
export interface ErrorContext {
  key?: string;
  operation?: string;
  timestamp: Date;
  userAgent?: string;
  storageSize?: number;
  availableSpace?: number;
  retryCount?: number;
  stackTrace?: string;
}

/**
 * Recovery options interface
 */
export interface RecoveryOptions {
  strategy: RecoveryStrategy;
  maxRetries: number;
  retryDelay: number;
  fallbackValue?: any;
  onRecovery?: (error: StorageError) => void;
}

/**
 * Custom storage error class
 */
export class StorageError extends Error {
  public readonly type: StorageErrorType;
  public readonly severity: ErrorSeverity;
  public readonly context: ErrorContext;
  public readonly originalError?: Error;
  public readonly recoveryOptions?: RecoveryOptions;

  constructor(
    type: StorageErrorType,
    message: string,
    originalError?: Error,
    context?: Partial<ErrorContext>,
    recoveryOptions?: RecoveryOptions
  ) {
    super(message);
    this.name = 'StorageError';
    this.type = type;
    this.severity = this.determineSeverity(type);
    this.originalError = originalError;
    this.recoveryOptions = recoveryOptions;
    
    this.context = {
      timestamp: new Date(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
      stackTrace: this.stack,
      ...context
    };

    // Maintain proper stack trace for debugging
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, StorageError);
    }
  }

  /**
   * Determine error severity based on type
   */
  private determineSeverity(type: StorageErrorType): ErrorSeverity {
    switch (type) {
      case StorageErrorType.QUOTA_EXCEEDED:
      case StorageErrorType.CORRUPTION_ERROR:
      case StorageErrorType.PERMISSION_ERROR:
        return ErrorSeverity.CRITICAL;
      
      case StorageErrorType.ENCRYPTION_ERROR:
      case StorageErrorType.DECRYPTION_ERROR:
      case StorageErrorType.MIGRATION_ERROR:
        return ErrorSeverity.HIGH;
      
      case StorageErrorType.WRITE_ERROR:
      case StorageErrorType.DELETE_ERROR:
      case StorageErrorType.BATCH_ERROR:
        return ErrorSeverity.MEDIUM;
      
      case StorageErrorType.READ_ERROR:
      case StorageErrorType.NETWORK_ERROR:
      case StorageErrorType.TIMEOUT_ERROR:
        return ErrorSeverity.LOW;
      
      default:
        return ErrorSeverity.MEDIUM;
    }
  }

  /**
   * Get human-readable error message
   */
  public getDisplayMessage(): string {
    switch (this.type) {
      case StorageErrorType.QUOTA_EXCEEDED:
        return 'Storage space is full. Please free up space or enable cloud sync.';
      
      case StorageErrorType.CORRUPTION_ERROR:
        return 'Data corruption detected. A backup restore may be required.';
      
      case StorageErrorType.PERMISSION_ERROR:
        return 'Permission denied. Please check app permissions.';
      
      case StorageErrorType.ENCRYPTION_ERROR:
        return 'Failed to encrypt data. Your information may not be secure.';
      
      case StorageErrorType.DECRYPTION_ERROR:
        return 'Failed to decrypt data. This may indicate data corruption.';
      
      case StorageErrorType.NETWORK_ERROR:
        return 'Network error occurred. Please check your connection.';
      
      case StorageErrorType.TIMEOUT_ERROR:
        return 'Operation timed out. Please try again.';
      
      default:
        return 'An error occurred while accessing storage.';
    }
  }

  /**
   * Get recommended recovery strategy
   */
  public getRecoveryStrategy(): RecoveryStrategy {
    if (this.recoveryOptions) {
      return this.recoveryOptions.strategy;
    }

    switch (this.type) {
      case StorageErrorType.NETWORK_ERROR:
      case StorageErrorType.TIMEOUT_ERROR:
        return RecoveryStrategy.RETRY;
      
      case StorageErrorType.QUOTA_EXCEEDED:
        return RecoveryStrategy.CLEAR_AND_RETRY;
      
      case StorageErrorType.CORRUPTION_ERROR:
        return RecoveryStrategy.RESTORE_BACKUP;
      
      case StorageErrorType.READ_ERROR:
        return RecoveryStrategy.FALLBACK;
      
      case StorageErrorType.PERMISSION_ERROR:
        return RecoveryStrategy.MANUAL_INTERVENTION;
      
      default:
        return RecoveryStrategy.RETRY;
    }
  }

  /**
   * Convert error to JSON for logging
   */
  public toJSON(): object {
    return {
      name: this.name,
      type: this.type,
      severity: this.severity,
      message: this.message,
      context: this.context,
      recoveryStrategy: this.getRecoveryStrategy(),
      originalError: this.originalError ? {
        name: this.originalError.name,
        message: this.originalError.message,
        stack: this.originalError.stack
      } : undefined
    };
  }
}

/**
 * Error handler utility class
 */
export class ErrorHandler {
  private static errorLog: StorageError[] = [];
  private static maxLogSize = 100;

  /**
   * Handle storage error with recovery
   */
  public static async handleError(
    error: StorageError,
    onRecovery?: (error: StorageError) => Promise<any>
  ): Promise<any> {
    // Log error
    this.logError(error);

    // Attempt recovery based on strategy
    const strategy = error.getRecoveryStrategy();
    const options = error.recoveryOptions;

    switch (strategy) {
      case RecoveryStrategy.RETRY:
        return this.retryOperation(error, onRecovery);
      
      case RecoveryStrategy.FALLBACK:
        return this.fallbackOperation(error);
      
      case RecoveryStrategy.CLEAR_AND_RETRY:
        return this.clearAndRetry(error, onRecovery);
      
      case RecoveryStrategy.RESTORE_BACKUP:
        return this.restoreBackup(error);
      
      case RecoveryStrategy.MANUAL_INTERVENTION:
        return this.requestManualIntervention(error);
      
      default:
        throw error;
    }
  }

  /**
   * Log error for debugging and analytics
   */
  private static logError(error: StorageError): void {
    // Add to in-memory log
    this.errorLog.push(error);
    
    // Keep log size manageable
    if (this.errorLog.length > this.maxLogSize) {
      this.errorLog.shift();
    }

    // Log to console in development
    if (__DEV__) {
      console.error('StorageError:', error.toJSON());
    }

    // In production, send to analytics service
    this.sendToAnalytics(error);
  }

  /**
   * Retry operation with exponential backoff
   */
  private static async retryOperation(
    error: StorageError,
    onRecovery?: (error: StorageError) => Promise<any>
  ): Promise<any> {
    const options = error.recoveryOptions || {
      strategy: RecoveryStrategy.RETRY,
      maxRetries: 3,
      retryDelay: 1000
    };

    const retryCount = error.context.retryCount || 0;
    
    if (retryCount >= options.maxRetries) {
      throw new StorageError(
        StorageErrorType.UNKNOWN_ERROR,
        'Max retry attempts exceeded',
        error
      );
    }

    // Exponential backoff
    const delay = options.retryDelay * Math.pow(2, retryCount);
    await new Promise(resolve => setTimeout(resolve, delay));

    if (onRecovery) {
      return onRecovery(error);
    }

    throw error;
  }

  /**
   * Fallback operation
   */
  private static async fallbackOperation(error: StorageError): Promise<any> {
    const options = error.recoveryOptions;
    
    if (options?.fallbackValue !== undefined) {
      return options.fallbackValue;
    }

    // Return default values based on error context
    if (error.context.key) {
      return this.getDefaultValue(error.context.key);
    }

    return null;
  }

  /**
   * Clear storage and retry
   */
  private static async clearAndRetry(
    error: StorageError,
    onRecovery?: (error: StorageError) => Promise<any>
  ): Promise<any> {
    try {
      // Clear specific key or all storage
      if (error.context.key) {
        await this.clearKey(error.context.key);
      } else {
        await this.clearAllStorage();
      }

      if (onRecovery) {
        return onRecovery(error);
      }
    } catch (clearError) {
      throw new StorageError(
        StorageErrorType.DELETE_ERROR,
        'Failed to clear storage for retry',
        clearError as Error
      );
    }
  }

  /**
   * Restore from backup
   */
  private static async restoreBackup(error: StorageError): Promise<any> {
    // Implementation depends on backup service
    throw new StorageError(
      StorageErrorType.UNKNOWN_ERROR,
      'Backup restore not implemented',
      error
    );
  }

  /**
   * Request manual intervention
   */
  private static async requestManualIntervention(error: StorageError): Promise<any> {
    // Show user notification or modal
    throw new StorageError(
      StorageErrorType.UNKNOWN_ERROR,
      'Manual intervention required: ' + error.getDisplayMessage(),
      error
    );
  }

  /**
   * Get default value for key
   */
  private static getDefaultValue(key: string): any {
    const defaults: Record<string, any> = {
      'lesson_plans': [],
      'user_preferences': {},
      'app_settings': {},
      'user_profile': null,
      'curriculum_data': [],
      'performance_arts': [],
      'accessibility_settings': {},
      'offline_data': [],
      'temp_drafts': [],
      'backup_data': null
    };

    return defaults[key] || null;
  }

  /**
   * Clear specific key (placeholder)
   */
  private static async clearKey(key: string): Promise<void> {
    // Implementation depends on storage service
    console.warn('clearKey not implemented:', key);
  }

  /**
   * Clear all storage (placeholder)
   */
  private static async clearAllStorage(): Promise<void> {
    // Implementation depends on storage service
    console.warn('clearAllStorage not implemented');
  }

  /**
   * Send error to analytics service
   */
  private static sendToAnalytics(error: StorageError): void {
    // Implementation depends on analytics service
    if (!__DEV__) {
      // Send to production analytics
      console.log('Analytics:', error.toJSON());
    }
  }

  /**
   * Get error log for debugging
   */
  public static getErrorLog(): StorageError[] {
    return [...this.errorLog];
  }

  /**
   * Clear error log
   */
  public static clearErrorLog(): void {
    this.errorLog = [];
  }
}

/**
 * Helper function to create storage errors
 */
export function createStorageError(
  type: StorageErrorType,
  message: string,
  originalError?: Error,
  context?: Partial<ErrorContext>
): StorageError {
  return new StorageError(type, message, originalError, context);
}

/**
 * Helper function to handle async storage operations with error handling
 */
export async function withErrorHandling<T>(
  operation: () => Promise<T>,
  errorType: StorageErrorType,
  context?: Partial<ErrorContext>
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    throw new StorageError(
      errorType,
      `Operation failed: ${error}`,
      error as Error,
      context
    );
  }
}