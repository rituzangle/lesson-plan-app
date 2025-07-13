/**
 * StorageService.ts
 * 
 * Centralized storage service using AsyncStorage with encryption
 * Final destination: src/services/StorageService.ts
 * 
 * Features:
 * - Encrypted data storage
 * - Type-safe operations
 * - Error handling
 * - Batch operations
 * - Storage size monitoring
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { encrypt, decrypt } from '../utils/encryption';
import { StorageError, StorageErrorType } from '../utils/storageErrors';
import { 
  StorageKey, 
  StorageValue, 
  StorageOptions, 
  StorageStats 
} from '../types/storage';

export class StorageService {
  private static instance: StorageService;
  private readonly keyPrefix = 'lesson_plan_';
  private readonly encryptionEnabled: boolean;

  private constructor(encryptionEnabled: boolean = true) {
    this.encryptionEnabled = encryptionEnabled;
  }

  /**
   * Singleton pattern for storage service
   */
  public static getInstance(encryptionEnabled: boolean = true): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService(encryptionEnabled);
    }
    return StorageService.instance;
  }

  /**
   * Store data with optional encryption
   */
  public async setItem<T extends StorageValue>(
    key: StorageKey,
    value: T,
    options: StorageOptions = {}
  ): Promise<void> {
    try {
      const prefixedKey = this.getPrefixedKey(key);
      let serializedValue = JSON.stringify(value);

      // Encrypt if enabled and not explicitly disabled
      if (this.encryptionEnabled && !options.skipEncryption) {
        serializedValue = await encrypt(serializedValue);
      }

      await AsyncStorage.setItem(prefixedKey, serializedValue);
    } catch (error) {
      throw new StorageError(
        StorageErrorType.WRITE_ERROR,
        `Failed to store ${key}`,
        error
      );
    }
  }

  /**
   * Retrieve data with automatic decryption
   */
  public async getItem<T extends StorageValue>(
    key: StorageKey,
    options: StorageOptions = {}
  ): Promise<T | null> {
    try {
      const prefixedKey = this.getPrefixedKey(key);
      const rawValue = await AsyncStorage.getItem(prefixedKey);
      
      if (rawValue === null) {
        return null;
      }

      let parsedValue = rawValue;

      // Decrypt if enabled and not explicitly disabled
      if (this.encryptionEnabled && !options.skipEncryption) {
        parsedValue = await decrypt(rawValue);
      }

      return JSON.parse(parsedValue) as T;
    } catch (error) {
      throw new StorageError(
        StorageErrorType.READ_ERROR,
        `Failed to retrieve ${key}`,
        error
      );
    }
  }

  /**
   * Remove item from storage
   */
  public async removeItem(key: StorageKey): Promise<void> {
    try {
      const prefixedKey = this.getPrefixedKey(key);
      await AsyncStorage.removeItem(prefixedKey);
    } catch (error) {
      throw new StorageError(
        StorageErrorType.DELETE_ERROR,
        `Failed to remove ${key}`,
        error
      );
    }
  }

  /**
   * Get all keys with our prefix
   */
  public async getAllKeys(): Promise<string[]> {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      return allKeys
        .filter(key => key.startsWith(this.keyPrefix))
        .map(key => key.replace(this.keyPrefix, ''));
    } catch (error) {
      throw new StorageError(
        StorageErrorType.READ_ERROR,
        'Failed to retrieve all keys',
        error
      );
    }
  }

  /**
   * Batch operations for better performance
   */
  public async batchSet(
    items: Array<[StorageKey, StorageValue]>,
    options: StorageOptions = {}
  ): Promise<void> {
    try {
      const batchData: Array<[string, string]> = [];
      
      for (const [key, value] of items) {
        const prefixedKey = this.getPrefixedKey(key);
        let serializedValue = JSON.stringify(value);

        if (this.encryptionEnabled && !options.skipEncryption) {
          serializedValue = await encrypt(serializedValue);
        }

        batchData.push([prefixedKey, serializedValue]);
      }

      await AsyncStorage.multiSet(batchData);
    } catch (error) {
      throw new StorageError(
        StorageErrorType.BATCH_ERROR,
        'Failed to batch set items',
        error
      );
    }
  }

  /**
   * Batch get operations
   */
  public async batchGet<T extends StorageValue>(
    keys: StorageKey[],
    options: StorageOptions = {}
  ): Promise<Array<[StorageKey, T | null]>> {
    try {
      const prefixedKeys = keys.map(key => this.getPrefixedKey(key));
      const results = await AsyncStorage.multiGet(prefixedKeys);
      
      const processedResults: Array<[StorageKey, T | null]> = [];
      
      for (let i = 0; i < results.length; i++) {
        const [prefixedKey, rawValue] = results[i];
        const originalKey = keys[i];
        
        if (rawValue === null) {
          processedResults.push([originalKey, null]);
          continue;
        }

        let parsedValue = rawValue;
        
        if (this.encryptionEnabled && !options.skipEncryption) {
          parsedValue = await decrypt(rawValue);
        }

        processedResults.push([originalKey, JSON.parse(parsedValue) as T]);
      }

      return processedResults;
    } catch (error) {
      throw new StorageError(
        StorageErrorType.BATCH_ERROR,
        'Failed to batch get items',
        error
      );
    }
  }

  /**
   * Clear all lesson plan data
   */
  public async clearAll(): Promise<void> {
    try {
      const keys = await this.getAllKeys();
      const prefixedKeys = keys.map(key => this.getPrefixedKey(key));
      await AsyncStorage.multiRemove(prefixedKeys);
    } catch (error) {
      throw new StorageError(
        StorageErrorType.DELETE_ERROR,
        'Failed to clear all data',
        error
      );
    }
  }

  /**
   * Get storage statistics
   */
  public async getStorageStats(): Promise<StorageStats> {
    try {
      const keys = await this.getAllKeys();
      const prefixedKeys = keys.map(key => this.getPrefixedKey(key));
      
      let totalSize = 0;
      let itemCount = 0;
      
      for (const key of prefixedKeys) {
        const value = await AsyncStorage.getItem(key);
        if (value !== null) {
          totalSize += value.length;
          itemCount++;
        }
      }

      return {
        totalSize,
        itemCount,
        keys: keys,
        estimatedSizeInMB: totalSize / (1024 * 1024)
      };
    } catch (error) {
      throw new StorageError(
        StorageErrorType.READ_ERROR,
        'Failed to get storage stats',
        error
      );
    }
  }

  /**
   * Check if item exists
   */
  public async hasItem(key: StorageKey): Promise<boolean> {
    try {
      const value = await this.getItem(key);
      return value !== null;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get prefixed key for storage
   */
  private getPrefixedKey(key: StorageKey): string {
    return `${this.keyPrefix}${key}`;
  }
}

// Export singleton instance
export const storageService = StorageService.getInstance();