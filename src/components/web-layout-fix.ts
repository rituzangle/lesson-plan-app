// Web Layout Fix - Responsive container for web browsers
// Path: components/WebLayoutFix.tsx
// Created: 2025-07-28 for lesson-plan-app

import React from 'react';
import { View, StyleSheet, Dimensions, Platform } from 'react-native';

const { width } = Dimensions.get('window');

interface WebLayoutFixProps {
  children: React.ReactNode;
}

export const WebLayoutFix: React.FC<WebLayoutFixProps> = ({ children }) => {
  const isWeb = Platform.OS === 'web';
  
  // On web, use responsive container. On mobile, use full width
  const containerWidth = isWeb ? Math.min(width, 1200) : width;
  const shouldCenter = isWeb && width > 768;

  return (
    <View style={[
      styles.container,
      {
        width: containerWidth,
        alignSelf: shouldCenter ? 'center' : 'stretch',
        maxWidth: isWeb ? 1200 : '100%',
      }
    ]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: Platform.OS === 'web' ? '100vh' : '100%',
  },
});

// Quick CSS injection for web
if (Platform.OS === 'web') {
  const style = document.createElement('style');
  style.textContent = `
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    }
    #root {
      width: 100vw;
      min-height: 100vh;
      display: flex;
      justify-content: center;
    }
    /* Fix for tiny text inputs */
    input, textarea {
      min-width: 200px !important;
      font-size: 16px !important;
      padding: 12px !important;
    }
  `;
  document.head.appendChild(style);
}