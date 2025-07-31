// Encryption Service
import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = process.env.EXPO_PUBLIC_ENCRYPTION_KEY || 'default-key-change-in-production';

export class EncryptionService {
  static encrypt(data: string): string {
    try {
      return CryptoJS.AES.encrypt(data, ENCRYPTION_KEY).toString();
    } catch (error) {
      console.error('Encryption failed:', error);
      throw new Error('Failed to encrypt data');
    }
  }

  static decrypt(encryptedData: string): string {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error('Decryption failed:', error);
      throw new Error('Failed to decrypt data');
    }
  }

  static encryptObject(obj: any): string {
    return this.encrypt(JSON.stringify(obj));
  }

  static decryptObject<T>(encryptedData: string): T {
    const decrypted = this.decrypt(encryptedData);
    return JSON.parse(decrypted);
  }
}

export default EncryptionService;
