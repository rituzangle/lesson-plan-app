/**
 * encryption.ts
 * 
 * AES-256 encryption utilities for sensitive data
 * Final destination: src/utils/encryption.ts
 * 
 * Encrypts: user profiles, grades, personal notes, settings
 * Plain text: lesson plan templates, public curriculum data
 */

import CryptoJS from 'crypto-js';
import { Platform } from 'react-native';

// Encryption configuration
const ENCRYPTION_CONFIG = {
  algorithm: 'AES',
  mode: CryptoJS.mode.GCM,
  padding: CryptoJS.pad.Pkcs7,
  keySize: 256 / 32, // 256 bits
  ivSize: 128 / 32,  // 128 bits
  saltSize: 128 / 32, // 128 bits
  iterations: 10000,
};

// Master key derivation
class KeyManager {
  private static masterKey: string | null = null;
  private static deviceId: string | null = null;

  /**
   * Initialize encryption with device-specific key
   */
  static async initialize(): Promise<void> {
    if (!this.masterKey) {
      this.deviceId = await this.getDeviceId();
      this.masterKey = await this.deriveMasterKey();
    }
  }

  /**
   * Get device-specific identifier
   */
  private static async getDeviceId(): Promise<string> {
    // In a real app, use a proper device ID library
    // For now, use a combination of platform info
    const platformInfo = `${Platform.OS}-${Platform.Version}`;
    const timestamp = Date.now().toString();
    
    // Create a pseudo-unique device ID
    // In production, use: react-native-device-info
    return CryptoJS.SHA256(platformInfo + timestamp).toString();
  }

  /**
   * Derive master key from device ID
   */
  private static async deriveMasterKey(): Promise<string> {
    const salt = CryptoJS.lib.WordArray.random(ENCRYPTION_CONFIG.saltSize);
    const key = CryptoJS.PBKDF2(
      this.deviceId!,
      salt,
      {
        keySize: ENCRYPTION_CONFIG.keySize,
        iterations: ENCRYPTION_CONFIG.iterations,
        hasher: CryptoJS.algo.SHA256
      }
    );
    
    return key.toString() + ':' + salt.toString();
  }

  /**
   * Get the current master key
   */
  static async getMasterKey(): Promise<string> {
    await this.initialize();
    return this.masterKey!.split(':')[0];
  }

  /**
   * Get the current salt
   */
  static async getSalt(): Promise<string> {
    await this.initialize();
    return this.masterKey!.split(':')[1];
  }
}

/**
 * Encrypt data using AES-256-GCM
 */
export async function encrypt(data: string): Promise<string> {
  try {
    const masterKey = await KeyManager.getMasterKey();
    const iv = CryptoJS.lib.WordArray.random(ENCRYPTION_CONFIG.ivSize);
    
    const encrypted = CryptoJS.AES.encrypt(data, masterKey, {
      iv: iv,
      mode: ENCRYPTION_CONFIG.mode,
      padding: ENCRYPTION_CONFIG.padding,
    });

    // Combine IV and encrypted data
    const combined = iv.toString() + ':' + encrypted.toString();
    
    // Base64 encode the result
    return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(combined));
  } catch (error) {
    throw new Error(`Encryption failed: ${error}`);
  }
}

/**
 * Decrypt data using AES-256-GCM
 */
export async function decrypt(encryptedData: string): Promise<string> {
  try {
    const masterKey = await KeyManager.getMasterKey();
    
    // Base64 decode
    const decodedData = CryptoJS.enc.Base64.parse(encryptedData).toString(CryptoJS.enc.Utf8);
    
    // Split IV and encrypted data
    const parts = decodedData.split(':');
    if (parts.length !== 2) {
      throw new Error('Invalid encrypted data format');
    }

    const iv = CryptoJS.enc.Hex.parse(parts[0]);
    const encrypted = parts[1];

    const decrypted = CryptoJS.AES.decrypt(encrypted, masterKey, {
      iv: iv,
      mode: ENCRYPTION_CONFIG.mode,
      padding: ENCRYPTION_CONFIG.padding,
    });

    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    throw new Error(`Decryption failed: ${error}`);
  }
}

/**
 * Hash data using SHA-256 (for checksums, non-reversible)
 */
export function hash(data: string): string {
  return CryptoJS.SHA256(data).toString();
}

/**
 * Generate secure random string
 */
export function generateSecureRandom(length: number = 32): string {
  const wordArray = CryptoJS.lib.WordArray.random(length / 2);
  return wordArray.toString();
}

/**
 * Verify data integrity using HMAC
 */
export async function createHMAC(data: string): Promise<string> {
  const key = await KeyManager.getMasterKey();
  return CryptoJS.HmacSHA256(data, key).toString();
}

/**
 * Verify HMAC
 */
export async function verifyHMAC(data: string, hmac: string): Promise<boolean> {
  const expectedHMAC = await createHMAC(data);
  return expectedHMAC === hmac;
}

/**
 * Determine if data should be encrypted based on data type
 */
export function shouldEncrypt(key: string, data: any): boolean {
  // Sensitive data that should always be encrypted
  const sensitiveKeys = [
    'user_profile',
    'user_preferences',
    'app_settings',
    'performance_data',
    'grades',
    'personal_notes',
    'student_data',
    'parent_contact',
    'email',
    'phone',
    'address'
  ];

  // Check if key contains sensitive information
  const isSensitive = sensitiveKeys.some(sensitiveKey => 
    key.toLowerCase().includes(sensitiveKey.toLowerCase())
  );

  // Check if data contains sensitive fields
  if (typeof data === 'object' && data !== null) {
    const dataString = JSON.stringify(data).toLowerCase();
    const hasSensitiveData = sensitiveKeys.some(sensitiveKey =>
      dataString.includes(sensitiveKey.toLowerCase())
    );
    
    return isSensitive || hasSensitiveData;
  }

  return isSensitive;
}

/**
 * Encrypt object fields selectively
 */
export async function encryptObject(obj: Record<string, any>): Promise<Record<string, any>> {
  const result: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (shouldEncrypt(key, value)) {
      result[key] = await encrypt(JSON.stringify(value));
      result[`${key}_encrypted`] = true;
    } else {
      result[key] = value;
    }
  }
  
  return result;
}

/**
 * Decrypt object fields selectively
 */
export async function decryptObject(obj: Record<string, any>): Promise<Record<string, any>> {
  const result: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (key.endsWith('_encrypted')) {
      continue; // Skip encryption flags
    }
    
    if (obj[`${key}_encrypted`]) {
      result[key] = JSON.parse(await decrypt(value as string));
    } else {
      result[key] = value;
    }
  }
  
  return result;
}

/**
 * Create backup with encryption
 */
export async function createEncryptedBackup(data: any): Promise<string> {
  const jsonData = JSON.stringify(data);
  const compressed = CryptoJS.enc.Base64.stringify(
    CryptoJS.enc.Utf8.parse(jsonData)
  );
  
  return await encrypt(compressed);
}

/**
 * Restore from encrypted backup
 */
export async function restoreFromEncryptedBackup(encryptedBackup: string): Promise<any> {
  const decryptedData = await decrypt(encryptedBackup);
  const decompressed = CryptoJS.enc.Base64.parse(decryptedData).toString(CryptoJS.enc.Utf8);
  
  return JSON.parse(decompressed);
}

// Initialize encryption when module loads
KeyManager.initialize().catch(console.error);