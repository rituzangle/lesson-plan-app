/**
 * Accessibility Constants for Inclusive Learning
 * Supporting all abilities, ages, and learning styles
 */

export const ACCESSIBILITY_FEATURES = {
  // Visual Accessibility
  VISUAL: {
    HIGH_CONTRAST: {
      enabled: true,
      ratios: {
        AAA: 7.1, // WCAG AAA standard
        AA: 4.5,  // WCAG AA standard
      }
    },
    FONT_SCALING: {
      min: 0.8,
      max: 3.0,
      default: 1.0,
      step: 0.1
    },
    COLOR_BLINDNESS: {
      deuteranopia: true,    // Green-blind
      protanopia: true,      // Red-blind
      tritanopia: true,      // Blue-blind
      monochromacy: true     // Complete color blindness
    },
    SCREEN_READER: {
      voiceOver: true,       // iOS
      talkBack: true,        // Android
      nvda: true,           // Windows
      jaws: true            // Windows
    }
  },

  // Motor Accessibility
  MOTOR: {
    TOUCH_TARGETS: {
      minimum: 44,          // Apple recommendation (44x44 points)
      recommended: 48,      // Google recommendation (48x48 dp)
      comfortable: 56       // Enhanced for motor difficulties
    },
    GESTURE_ALTERNATIVES: {
      singleTap: true,      // Alternative to complex gestures
      voiceControl: true,   // Voice commands
      switchControl: true,  // External switch support
      eyeTracking: true     // Eye tracking support
    },
    TIMING: {
      noTimeouts: true,     // No automatic timeouts
      adjustableTiming: true, // User can adjust timing
      pauseControl: true    // Pause/resume functionality
    }
  },

  // Cognitive Accessibility
  COGNITIVE: {
    CONTENT_SIMPLIFICATION: {
      plainLanguage: true,
      visualCues: true,
      progressIndicators: true,
      consistentNavigation: true
    },
    MEMORY_SUPPORT: {
      autosave: true,
      breadcrumbs: true,
      searchHistory: true,
      favorites: true
    },
    ATTENTION_SUPPORT: {
      focusManagement: true,
      distractionReduction: true,
      customBreaks: true,
      progressReminders: true
    }
  },

  // Auditory Accessibility
  AUDITORY: {
    HEARING_SUPPORT: {
      captions: true,
      transcripts: true,
      signLanguage: true,
      visualAlerts: true
    },
    AUDIO_CUSTOMIZATION: {
      volumeControl: true,
      speedControl: true,
      toneAdjustment: true,
      backgroundNoise: false
    }
  },

  // Neurological Accessibility
  NEUROLOGICAL: {
    SEIZURE_PREVENTION: {
      noFlashing: true,
      reducedMotion: true,
      lowContrast: true
    },
    VESTIBULAR_SUPPORT: {
      reducedAnimation: true,
      staticAlternatives: true,
      motionControls: true
    }
  }
};

export const LEARNING_ACCOMMODATIONS = {
  // Autism Spectrum Support
  AUTISM: {
    SENSORY: {
      soundSensitivity: true,
      lightSensitivity: true,
      textureSensitivity: true,
      customSensoryProfile: true
    },
    COMMUNICATION: {
      visualSchedules: true,
      socialStories: true,
      pictureCommunication: true,
      repetitionSupport: true
    },
    BEHAVIORAL: {
      predictableRoutines: true,
      transitionWarnings: true,
      calming strategies: true,
      interestBasedLearning: true
    }
  },

  // ADHD Support
  ADHD: {
    ATTENTION: {
      shortSegments: true,
      interactiveElements: true,
      movementBreaks: true,
      fidgetTools: true
    },
    ORGANIZATION: {
      visualOrganizers: true,
      taskBreakdown: true,
      prioritySystem: true,
      reminderSystem: true
    }
  },

  // Dyslexia Support
  DYSLEXIA: {
    READING: {
      dyslexiaFriendlyFonts: true,
      audioSupport: true,
      wordPrediction: true,
      colorCoding: true
    },
    WRITING: {
      speechToText: true,
      spellCheck: true,
      grammarSupport: true,
      templates: true
    }
  },

  // Physical Disabilities
  PHYSICAL: {
    MOBILITY: {
      wheelchairAccessible: true,
      adaptedInstructions: true,
      alternativeControls: true,
      assistiveTechnology: true
    },
    FINE_MOTOR: {
      largeButtons: true,
      voiceControl: true,
      eyeTracking: true,
      switchControl: true
    }
  }
};

export const INCLUSIVE_DESIGN_PRINCIPLES = {
  UNIVERSAL: {
    description: "Usable by all people, to the greatest extent possible",
    implementation: [
      "Multiple ways to access content",
      "Flexible interaction methods",
      "Customizable interfaces",
      "Alternative formats available"
    ]
  },
  EQUITABLE: {
    description: "Useful and marketable to people with diverse abilities",
    implementation: [
      "No segregated features",
      "Equal access to functionality",
      "Dignity in design",
      "Equivalent experiences"
    ]
  },
  FLEXIBLE: {
    description: "Accommodates preferences and abilities",
    implementation: [
      "Customizable settings",
      "Multiple input methods",
      "Adaptable content",
      "Personal preferences"
    ]
  },
  SIMPLE: {
    description: "Easy to understand and use",
    implementation: [
      "Clear instructions",
      "Consistent navigation",
      "Intuitive design",
      "Minimal cognitive load"
    ]
  },
  PERCEPTIBLE: {
    description: "Information communicated effectively",
    implementation: [
      "Multiple sensory channels",
      "Clear visual hierarchy",
      "Adequate contrast",
      "Alternative formats"
    ]
  },
  TOLERANCE: {
    description: "Minimizes hazards of accidental actions",
    implementation: [
      "Undo functionality",
      "Confirmation dialogs",
      "Error recovery",
      "Fail-safe design"
    ]
  },
  EFFORT: {
    description: "Efficient and comfortable use",
    implementation: [
      "Minimize repetitive actions",
      "Comfortable positioning",
      "Reasonable operating forces",
      "Efficient workflows"
    ]
  }
};

export const ASSISTIVE_TECHNOLOGY = {
  SCREEN_READERS: [
    'NVDA', 'JAWS', 'VoiceOver', 'TalkBack', 'Orca', 'Narrator'
  ],
  VOICE_RECOGNITION: [
    'Dragon', 'Windows Speech Recognition', 'Voice Control', 'Voice Access'
  ],
  SWITCH_CONTROL: [
    'Single Switch', 'Dual Switch', 'Sip and Puff', 'Head Switch'
  ],
  EYE_TRACKING: [
    'Tobii', 'EyeGaze', 'PCEye', 'Eye Tribe'
  ],
  ALTERNATIVE_KEYBOARDS: [
    'On-Screen Keyboard', 'BigKeys', 'IntelliKeys', 'Adaptive Keyboards'
  ],
  MAGNIFICATION: [
    'ZoomText', 'MAGic', 'Zoom', 'Magnifier'
  ]
};

export const ACCESSIBILITY_TESTS = {
  AUTOMATED: [
    'Color contrast ratios',
    'Focus management',
    'Keyboard navigation',
    'Screen reader compatibility',
    'Touch target sizes',
    'Text scaling',
    'Motion sensitivity'
  ],
  MANUAL: [
    'User testing with disabilities',
    'Assistive technology testing',
    'Cognitive load assessment',
    'Usability evaluation',
    'Accessibility audit',
    'WCAG compliance check'
  ]
};

// Age-agnostic approach - focus on ability and interest, not age
export const LEARNER_PROFILES = {
  BEGINNER: {
    description: "New to the subject, eager to learn",
    adaptations: ["Simple concepts", "Visual aids", "Encouragement", "Patience"]
  },
  INTERMEDIATE: {
    description: "Some experience, building skills",
    adaptations: ["Progressive challenges", "Skill building", "Practice", "Confidence"]
  },
  ADVANCED: {
    description: "Experienced, seeking mastery",
    adaptations: ["Complex concepts", "Creative projects", "Innovation", "Leadership"]
  },
  EXPLORER: {
    description: "Curious about multiple subjects",
    adaptations: ["Cross-subject connections", "Variety", "Discovery", "Wonder"]
  },
  FOCUSED: {
    description: "Deep interest in specific areas",
    adaptations: ["Specialized content", "Depth", "Expertise", "Mastery"]
  }
};

export default {
  ACCESSIBILITY_FEATURES,
  LEARNING_ACCOMMODATIONS,
  INCLUSIVE_DESIGN_PRINCIPLES,
  ASSISTIVE_TECHNOLOGY,
  ACCESSIBILITY_TESTS,
  LEARNER_PROFILES
};