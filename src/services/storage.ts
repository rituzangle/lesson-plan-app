// File: src/services/storage.ts
// Secure storage service with AsyncStorage wrapper
// Destination: <MY-APP>/src/services/storage.ts

import AsyncStorage from '@react-native-async-storage/async-storage';
import { encryptionService } from './encryption';

class StorageService {
  private readonly PREFIX = 'LessonPlanApp_';
  private readonly SECURE_PREFIX = 'SECURE_';

  /**
   * Store data with optional encryption
   */
  async set(key: string, value: string): Promise<void> {
    try {
      const prefixedKey = this.PREFIX + key;
      await AsyncStorage.setItem(prefixedKey, value);
    } catch (error) {
      console.error(`Error storing data for key ${key}:`, error);
      throw new Error(`Failed to store data for key: ${key}`);
    }
  }

  /**
   * Get data from storage
   */
  async get(key: string): Promise<string | null> {
    try {
      const prefixedKey = this.PREFIX + key;
      return await AsyncStorage.getItem(prefixedKey);
    } catch (error) {
      console.error(`Error retrieving data for key ${key}:`, error);
      return null;
    }
  }

  /**
   * Store sensitive data with encryption
   */
  async setSecure(key: string, value: string): Promise<void> {
    try {
      const encryptedValue = await encryptionService.encrypt(value);
      const secureKey = this.SECURE_PREFIX + key;
      await this.set(secureKey, encryptedValue);
    } catch (error) {
      console.error(`Error storing secure data for key ${key}:`, error);
      throw new Error(`Failed to store secure data for key: ${key}`);
    }
  }

  /**
   * Get sensitive data with decryption
   */
  async getSecure(key: string): Promise<string | null> {
    try {
      const secureKey = this.SECURE_PREFIX + key;
      const encryptedValue = await this.get(secureKey);
      
      if (!encryptedValue) {
        return null;
      }

      return await encryptionService.decrypt(encryptedValue);
    } catch (error) {
      console.error(`Error retrieving secure data for key ${key}:`, error);
      return null;
    }
  }

  /**
   * Store object data as JSON
   */
  async setObject(key: string, value: any): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await this.set(key, jsonValue);
    } catch (error) {
      console.error(`Error storing object for key ${key}:`, error);
      throw new Error(`Failed to store object for key: ${key}`);
    }
  }

  /**
   * Get object data from JSON
   */
  async getObject<T>(key: string): Promise<T | null> {
    try {
      const jsonValue = await this.get(key);
      
      if (!jsonValue) {
        return null;
      }

      return JSON.parse(jsonValue) as T;
    } catch (error) {
      console.error(`Error retrieving object for key ${key}:`, error);
      return null;
    }
  }

  /**
   * Store object data with encryption
   */
  async setSecureObject(key: string, value: any): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await this.setSecure(key, jsonValue);
    } catch (error) {
      console.error(`Error storing secure object for key ${key}:`, error);
      throw new Error(`Failed to store secure object for key: ${key}`);
    }
  }

  /**
   * Get object data with decryption
   */
  async getSecureObject<T>(key: string): Promise<T | null> {
    try {
      const jsonValue = await this.getSecure(key);
      
      if (!jsonValue) {
        return null;
      }

      return JSON.parse(jsonValue) as T;
    } catch (error) {
      console.error(`Error retrieving secure object for key ${key}:`, error);
      return null;
    }
  }

  /**
   * Remove data from storage
   */
  async remove(key: string): Promise<void> {
    try {
      const prefixedKey = this.PREFIX + key;
      await AsyncStorage.removeItem(prefixedKey);
    } catch (error) {
      console.error(`Error removing data for key ${key}:`, error);
      throw new Error(`Failed to remove data for key: ${key}`);
    }
  }

  /**
   * Remove secure data from storage
   */
  async removeSecure(key: string): Promise<void> {
    try {
      const secureKey = this.SECURE_PREFIX + key;
      await this.remove(secureKey);
    } catch (error) {
      console.error(`Error removing secure data for key ${key}:`, error);
      throw new Error(`Failed to remove secure data for key: ${key}`);
    }
  }

  /**
   * Check if key exists in storage
   */
  async exists(key: string): Promise<boolean> {
    try {
      const value = await this.get(key);
      return value !== null;
    } catch (error) {
      console.error(`Error checking existence for key ${key}:`, error);
      return false;
    }
  }

  /**
   * Clear all app data from storage
   */
  async clearAll(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const appKeys = keys.filter(key => key.startsWith(this.PREFIX));
      
      if (appKeys.length > 0) {
        await AsyncStorage.multiRemove(appKeys);
      }
    } catch (error) {
      console.error('Error clearing all app data:', error);
      throw new Error('Failed to clear all app data');
    }
  }

  /**
   * Get all keys for debugging/maintenance
   */
  async getAllKeys(): Promise<string[]> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      return keys.filter(key => key.startsWith(this.PREFIX))
                 .map(key => key.substring(this.PREFIX.length));
    } catch (error) {
      console.error('Error getting all keys:', error);
      return [];
    }
  }

  /**
   * Get storage usage statistics
   */
  async getStorageInfo(): Promise<{
    totalKeys: number;
    secureKeys: number;
    estimatedSize: number;
  }> {
    try {
      const keys = await this.getAllKeys();
      const secureKeys = keys.filter(key => key.startsWith(this.SECURE_PREFIX));
      
      // Estimate size by checking a sample of values
      let estimatedSize = 0;
      const sampleKeys = keys.slice(0, Math.min(10, keys.length));
      
      for (const key of sampleKeys) {
        const value = await this.get(key);
        if (value) {
          estimatedSize += value.length;
        }
      }

      // Extrapolate size for all keys
      const avgSize = sampleKeys.length > 0 ? estimatedSize / sampleKeys.length : 0;
      const totalEstimatedSize = avgSize * keys.length;

      return {
        totalKeys: keys.length,
        secureKeys: secureKeys.length,
        estimatedSize: Math.round(totalEstimatedSize)
      };
    } catch (error) {
      console.error('Error getting storage info:', error);
      return {
        totalKeys: 0,
        secureKeys: 0,
        estimatedSize: 0
      };
    }
  }
}

export const storageService = new StorageService();