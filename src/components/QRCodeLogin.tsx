// src/components/QRCodeLogin.tsx
import React, { useState, useEffect } from 'react';

interface QRCodeLoginProps {
  onLogin: (data: { email: string; token: string }) => void;
  isLoading: boolean;
}

export const QRCodeLogin: React.FC<QRCodeLoginProps> = ({ onLogin, isLoading }) => {
  const [qrCode, setQrCode] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Generate QR code for login
  const generateQRCode = async () => {
    setIsGenerating(true);
    
    try {
      // In a real implementation, this would call your backend API
      const mockQRData = {
        loginUrl: `${window.location.origin}/auth/qr-callback`,
        token: 'mock-token-' + Date.now(),
        expiresAt: Date.now() + 5 * 60 * 1000 // 5 minutes
      };
      
      // Generate QR code SVG (simplified version)
      const qrSvg = `
        <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="200" fill="white"/>
          <rect x="20" y="20" width="20" height="20" fill="black"/>
          <rect x="60" y="20" width="20" height="20" fill="black"/>
          <rect x="100" y="20" width="20" height="20" fill="black"/>
          <rect x="140" y="20" width="20" height="20" fill="black"/>
          <rect x="20" y="60" width="20" height="20" fill="black"/>
          <rect x="100" y="60" width="20" height="20" fill="black"/>
          <rect x="160" y="60" width="20" height="20" fill="black"/>
          <rect x="20" y="100" width="20" height="20" fill="black"/>
          <rect x="80" y="100" width="20" height="20" fill="black"/>
          <rect x="140" y="100" width="20" height="20" fill="black"/>
          <rect x="60" y="140" width="20" height="20" fill="black"/>
          <rect x="120" y="140" width="20" height="20" fill="black"/>
          <rect x="160" y="140" width="20" height="20" fill="black"/>
          <rect x="40" y="180" width="20" height="20" fill="black"/>
          <rect x="100" y="180" width="20" height="20" fill="black"/>
          <rect x="160" y="180" width="20" height="20" fill="black"/>
          <text x="100" y="195" text-anchor="middle" font-size="8" fill="gray">Login QR</text>
        </svg>
      `;
      
      setQrCode(`data:image/svg+xml;base64,${btoa(qrSvg)}`);
      
      // Simulate QR code scanning after 3 seconds for demo
      setTimeout(() => {
        onLogin({
          email: 'demo@example.com',
          token: mockQRData.token
        });
      }, 3000);
      
    } catch (error) {
      console.error('Failed to generate QR code:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    generateQRCode();
  }, []);

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <h3 className="font-medium text-blue-900 mb-2">QR Code Login</h3>
        <p className="text-sm text-blue-800">
          Scan this QR code with your mobile device to sign in
        </p>
      </div>

      <div className="flex flex-col items-center space-y-4">
        {isGenerating ? (
          <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : qrCode ? (
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <img 
              src={qrCode} 
              alt="QR Code for login" 
              className="w-40 h-40"
            />
          </div>
        ) : (
          <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Failed to generate QR code</p>
          </div>
        )}

        <div className="text-center space-y-2">
          <p className="text-sm text-gray-600">
            Open your phone's camera or QR scanner app
          </p>
          <button
            onClick={generateQRCode}
            disabled={isGenerating || isLoading}
            className="text-sm text-blue-600 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md"
          >
            Generate new QR code
          </button>
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
        <h4 className="font-medium text-gray-900 mb-2">How to use QR login:</h4>
        <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
          <li>Open your phone's camera or QR scanner</li>
          <li>Point it at the QR code above</li>
          <li>Tap the notification to open the login link</li>
          <li>You'll be automatically signed in</li>
        </ol>
      </div>
    </div>
  );
};

// src/components/BiometricLogin.tsx
import React, { useState, useEffect } from 'react';

interface BiometricLoginProps {
  onLogin: () => void;
  isLoading: boolean;
}

export const BiometricLogin: React.FC<BiometricLoginProps> = ({ onLogin, isLoading }) => {
  const [isSupported, setIsSupported] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if WebAuthn is supported
    if (window.PublicKeyCredential) {
      setIsSupported(true);
    }
  }, []);

  const authenticateWithBiometric = async () => {
    if (!isSupported) return;

    setIsAuthenticating(true);
    setError(null);

    try {
      // Check if biometric authentication is available
      const available = await (window as any).PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      
      if (!available) {
        throw new Error('Biometric authentication not available on this device');
      }

      // Create assertion options (simplified for demo)
      const assertionOptions = {
        challenge: new Uint8Array(32),
        timeout: 60000,
        userVerification: 'required',
        rpId: window.location.hostname,
      };

      // Request authentication
      const credential = await navigator.credentials.get({
        publicKey: assertionOptions
      });

      if (credential) {
        // Simulate successful authentication
        setTimeout(() => {
          onLogin();
          setIsAuthenticating(false);
        }, 1000);
      } else {
        throw new Error('Authentication failed');
      }

    } catch (err: any) {
      setError(err.message || 'Biometric authentication failed');
      setIsAuthenticating(false);
    }
  };

  if (!isSupported) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
        <h3 className="font-medium text-yellow-900 mb-2">Biometric Login Not Available</h3>
        <p className="text-sm text-yellow-800">
          Your browser or device doesn't support biometric authentication.
          Please use keyboard or voice input instead.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-green-50 border border-green-200 rounded-md p-4">
        <h3 className="font-medium text-green-900 mb-2">Biometric Login</h3>
        <p className="text-sm text-green-800">
          Use your fingerprint, face, or other biometric authentication
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div className="flex flex-col items-center space-y-4">
        <div className="w-32 h-32 bg-gradient-to-br from-green-100 to-blue-100 rounded-full flex items-center justify-center">
          {isAuthenticating ? (
            <div className="animate-pulse text-4xl">🔐</div>
          ) : (
            <div className="text-4xl">👤</div>
          )}
        </div>

        <button
          onClick={authenticateWithBiometric}
          disabled={isAuthenticating || isLoading}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white font-medium py-3 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
        >
          {isAuthenticating ? 'Authenticating...' : 'Authenticate with Biometric'}
        </button>

        <div className="text-center space-y-2">
          <p className="text-sm text-gray-600">
            {isAuthenticating 
              ? 'Please complete biometric authentication on your device'
              : 'Touch the sensor or look at the camera when prompted'
            }
          </p>
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
        <h4 className="font-medium text-gray-900 mb-2">Supported methods:</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Fingerprint recognition</li>
          <li>• Face ID / Face recognition</li>
          <li>• Windows Hello</li>
          <li>• Touch ID</li>
        </ul>
      </div>
    </div>
  );
};