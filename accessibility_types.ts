// src/types/accessibility.ts
/**
 * Comprehensive accessibility types for inclusive learning
 * Supporting all abilities and learning differences
 */

export interface AccessibilityProfile {
  id: string;
  userId: string;
  
  // Visual accessibility
  visualNeeds: {
    fontSize: 'small' | 'medium' | 'large' | 'extra-large';
    contrast: 'normal' | 'high' | 'extra-high';
    colorblindSupport: boolean;
    screenReader: boolean;
    magnification: number; // 1.0 to 5.0
    dyslexiaSupport: boolean;
    reducedMotion: boolean;
  };
  
  // Auditory accessibility
  auditoryNeeds: {
    hearingLevel: 'normal' | 'mild' | 'moderate' | 'severe' | 'profound';
    captionsEnabled: boolean;
    signLanguagePreference: 'ASL' | 'BSL' | 'none';
    audioDescription: boolean;
    vibrationFeedback: boolean;
    visualAlerts: boolean;
  };
  
  // Motor accessibility
  motorNeeds: {
    inputMethod: 'touch' | 'voice' | 'switch' | 'eye-tracking' | 'head-tracking';
    oneHandedMode: boolean;
    largeTargets: boolean;
    reduceGestures: boolean;
    assistiveTouch: boolean;
    dwellTime: number; // milliseconds
  };
  
  // Cognitive accessibility
  cognitiveNeeds: {
    simplifiedLanguage: boolean;
    extendedTime: boolean;
    breakFrequency: number; // minutes
    memorySupport: boolean;
    focusAssistance: boolean;
    routinePreference: boolean;
    sensoryBreaks: boolean;
  };
  
  // Learning preferences
  learningStyle: {
    primary: 'visual' | 'auditory' | 'kinesthetic' | 'mixed';
    secondary?: 'visual' | 'auditory' | 'kinesthetic';
    pacingPreference: 'slow' | 'medium' | 'fast' | 'adaptive';
    repeatContent: boolean;
    multimodalPreference: boolean;
  };
  
  // Communication preferences
  communication: {
    textToSpeech: boolean;
    speechToText: boolean;
    symbolSupport: boolean;
    pictureSupport: boolean;
    gestureSupport: boolean;
    alternativeKeyboard: boolean;
  };
}

export interface AccessibilityFeature {
  id: string;
  name: string;
  description: string;
  category: 'visual' | 'auditory' | 'motor' | 'cognitive' | 'communication';
  enabled: boolean;
  settings: Record<string, any>;
}

export interface PerformingArtsAccessibility {
  // Music accessibility
  music: {
    tactileFeedback: boolean;
    visualMetronome: boolean;
    colorCodedNotes: boolean;
    largePrintMusic: boolean;
    brailleMusic: boolean;
    audioOnlyMode: boolean;
    vibrationPatterns: boolean;
  };
  
  // Dance accessibility
  dance: {
    wheelchairAdaptations: boolean;
    seatedDance: boolean;
    upperBodyFocus: boolean;
    visualCues: boolean;
    tactileGuidance: boolean;
    audioDescriptions: boolean;
    slowMotionDemo: boolean;
  };
  
  // Voice lessons
  voice: {
    breathingVisuals: boolean;
    pitchVisualizer: boolean;
    resonanceMapping: boolean;
    speechTherapyMode: boolean;
    nonVerbalOptions: boolean;
    signedSinging: boolean;
    tactileThroatWork: boolean;
  };
  
  // Theater accessibility
  theater: {
    scriptReader: boolean;
    movementAdaptations: boolean;
    sensoryFriendly: boolean;
    emotionalSupport: boolean;
    alternativeRoles: boolean;
    inclusiveStaging: boolean;
  };
}

// src/constants/accessibility.ts
export const ACCESSIBILITY_CONSTANTS = {
  // Font sizes (in points)
  FONT_SIZES: {
    small: 12,
    medium: 16,
    large: 20,
    'extra-large': 24,
  },
  
  // Contrast ratios
  CONTRAST_RATIOS: {
    normal: 4.5,
    high: 7.0,
    'extra-high': 10.0,
  },
  
  // Touch target sizes (in pixels)
  TOUCH_TARGETS: {
    small: 44,
    medium: 60,
    large: 80,
    'extra-large': 100,
  },
  
  // Break intervals (in minutes)
  BREAK_INTERVALS: {
    frequent: 5,
    normal: 10,
    extended: 15,
    custom: 0, // user-defined
  },
  
  // Animation durations (in milliseconds)
  ANIMATION_DURATIONS: {
    'no-motion': 0,
    reduced: 200,
    normal: 500,
    extended: 1000,
  },
  
  // Voice synthesis settings
  VOICE_SETTINGS: {
    rate: {
      slow: 0.5,
      normal: 1.0,
      fast: 1.5,
    },
    pitch: {
      low: 0.5,
      normal: 1.0,
      high: 1.5,
    },
    volume: {
      quiet: 0.3,
      normal: 0.7,
      loud: 1.0,
    },
  },
  
  // Color themes for accessibility
  COLOR_THEMES: {
    default: {
      primary: '#4A90E2',
      secondary: '#50C878',
      background: '#FFFFFF',
      text: '#000000',
    },
    highContrast: {
      primary: '#000000',
      secondary: '#FFFFFF',
      background: '#FFFFFF',
      text: '#000000',
    },
    darkMode: {
      primary: '#64B5F6',
      secondary: '#81C784',
      background: '#121212',
      text: '#FFFFFF',
    },
    colorblind: {
      primary: '#1976D2',
      secondary: '#388E3C',
      background: '#FFFFFF',
      text: '#000000',
    },
  },
  
  // Performing arts adaptations
  PERFORMING_ARTS: {
    music: {
      tempoRange: { min: 60, max: 200 }, // BPM
      frequencyRange: { min: 20, max: 20000 }, // Hz
      volumeRange: { min: 0, max: 100 }, // dB
    },
    dance: {
      movementLevels: ['floor', 'seated', 'standing', 'elevated'],
      intensityLevels: ['gentle', 'moderate', 'vigorous'],
      adaptationTypes: ['wheelchair', 'walker', 'cane', 'prosthetic'],
    },
    voice: {
      rangeTypes: ['bass', 'baritone', 'tenor', 'alto', 'soprano'],
      exerciseTypes: ['breathing', 'resonance', 'articulation', 'pitch'],
      supportTypes: ['visual', 'tactile', 'auditory'],
    },
  },
};

// Age-inclusive constants (removing age restrictions)
export const INCLUSIVE_CONSTANTS = {
  // Learning paces for all ages
  LEARNING_PACES: {
    'self-paced': 'Learn at your own speed',
    guided: 'Structured with flexibility',
    intensive: 'Focused and comprehensive',
  },
  
  // Motivation styles
  MOTIVATION_STYLES: {
    achievement: 'Goal-oriented rewards',
    social: 'Community and sharing',
    curiosity: 'Discovery and exploration',
    mastery: 'Skill development focus',
  },
  
  // Support levels
  SUPPORT_LEVELS: {
    independent: 'Minimal guidance',
    assisted: 'Regular check-ins',
    collaborative: 'Partner learning',
    intensive: 'Continuous support',
  },
};

export default {
  ACCESSIBILITY_CONSTANTS,
  INCLUSIVE_CONSTANTS,
};