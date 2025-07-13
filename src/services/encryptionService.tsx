// Destination: src/services/encryption.service.ts
// AES-256 encryption service for user data protection

import CryptoJS from 'crypto-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

export class EncryptionService {
  private static readonly ENCRYPTION_KEY = 'lesson-plan-app-key';
  private static readonly SALT_KEY = 'user-salt-key';

  /**
   * Generate or retrieve user-specific salt
   */
  private static async getUserSalt(userId: string): Promise<string> {
    const saltKey = `${this.SALT_KEY}-${userId}`;
    let salt = await AsyncStorage.getItem(saltKey);
    
    if (!salt) {
      salt = CryptoJS.lib.WordArray.random(256/8).toString();
      await AsyncStorage.setItem(saltKey, salt);
    }
    
    return salt;
  }

  /**
   * Generate user-specific encryption key
   */
  private static async getUserEncryptionKey(userId: string): Promise<string> {
    const salt = await this.getUserSalt(userId);
    return CryptoJS.PBKDF2(this.ENCRYPTION_KEY, salt, {
      keySize: 256/32,
      iterations: 1000
    }).toString();
  }

  /**
   * Encrypt data for specific user
   */
  public static async encrypt(data: string, userId: string): Promise<string> {
    try {
      const key = await this.getUserEncryptionKey(userId);
      const encrypted = CryptoJS.AES.encrypt(data, key).toString();
      return encrypted;
    } catch (error) {
      console.error('Encryption failed:', error);
      throw new Error('Failed to encrypt data');
    }
  }

  /**
   * Decrypt data for specific user
   */
  public static async decrypt(encryptedData: string, userId: string): Promise<string> {
    try {
      const key = await this.getUserEncryptionKey(userId);
      const decrypted = CryptoJS.AES.decrypt(encryptedData, key);
      return decrypted.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error('Decryption failed:', error);
      throw new Error('Failed to decrypt data');
    }
  }

  /**
   * Encrypt and store sensitive data
   */
  public static async encryptAndStore(key: string, data: any, userId: string): Promise<void> {
    try {
      const jsonData = JSON.stringify(data);
      const encryptedData = await this.encrypt(jsonData, userId);
      await AsyncStorage.setItem(key, encryptedData);
    } catch (error) {
      console.error('Encrypt and store failed:', error);
      throw new Error('Failed to encrypt and store data');
    }
  }

  /**
   * Retrieve and decrypt sensitive data
   */
  public static async retrieveAndDecrypt<T>(key: string, userId: string): Promise<T | null> {
    try {
      const encryptedData = await AsyncStorage.getItem(key);
      if (!encryptedData) return null;

      const decryptedData = await this.decrypt(encryptedData, userId);
      return JSON.parse(decryptedData) as T;
    } catch (error) {
      console.error('Retrieve and decrypt failed:', error);
      return null;
    }
  }

  /**
   * Clear user-specific encrypted data
   */
  public static async clearUserData(userId: string): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const userKeys = keys.filter(key => key.includes(userId));
      await AsyncStorage.multiRemove(userKeys);
    } catch (error) {
      console.error('Clear user data failed:', error);
      throw new Error('Failed to clear user data');
    }
  }
}