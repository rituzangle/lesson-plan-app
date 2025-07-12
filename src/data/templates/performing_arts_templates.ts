// src/constants/performingArtsTemplates.ts
/**
 * Comprehensive performing arts lesson templates
 * Designed for maximum inclusivity and accessibility
 */

export interface PerformingArtsLesson {
  id: string;
  title: string;
  category: 'music' | 'dance' | 'voice' | 'theater' | 'mixed';
  description: string;
  objectives: string[];
  materials: Material[];
  activities: Activity[];
  adaptations: Adaptation[];
  assessment: Assessment;
  extensions: Extension[];
  duration: number; // minutes
  ageRange: 'all' | string; // removed age restrictions
  skillLevel: 'beginner' | 'intermediate' | 'advanced' | 'mixed';
  accessibilityFeatures: AccessibilityFeature[];
}

export interface Material {
  item: string;
  purpose: string;
  alternatives: string[];
  accessibilityNotes: string;
}

export interface Activity {
  id: string;
  name: string;
  description: string;
  duration: number;
  instructions: string[];
  adaptations: string[];
  materials: string[];
  safetyNotes: string[];
}

export interface Adaptation {
  type: 'visual' | 'auditory' | 'motor' | 'cognitive' | 'sensory';
  description: string;
  implementation: string;
  materials?: string[];
}

export interface Assessment {
  type: 'formative' | 'summative' | 'peer' | 'self';
  criteria: string[];
  adaptations: string[];
  alternatives: string[];
}

export interface Extension {
  title: string;
  description: string;
  activities: string[];
  connections: string[];
}

export const MUSIC_LESSONS: PerformingArtsLesson[] = [
  {
    id: 'music-rhythm-inclusive',
    title: 'Rhythm and Beat - For Every Body',
    category: 'music',
    description: 'Explore rhythm and beat through multiple sensory experiences, adapted for all physical abilities',
    objectives: [
      'Feel and express steady beat through various methods',
      'Identify rhythm patterns using preferred sensory input',
      'Create personal rhythm expressions',
      'Collaborate in inclusive rhythm activities'
    ],
    materials: [
      {
        item: 'Vibrating metronome',
        purpose: 'Tactile beat reference',
        alternatives: ['Visual metronome app', 'Drum with felt vibrations', 'Floor vibration pad'],
        accessibilityNotes: 'Essential for deaf/hard of hearing learners'
      },
      {
        item: 'Adaptive percussion instruments',
        purpose: 'Rhythm creation for all abilities',
        alternatives: ['Velcro-attached shakers', 'Mouth-controlled instruments', 'Eye-gaze activated drums'],
        accessibilityNotes: 'Mountable for wheelchair users, lightweight for limited mobility'
      },
      {
        item: 'Colored rhythm cards',
        purpose: 'Visual rhythm representation',
        alternatives: ['Braille rhythm cards', 'Textured rhythm blocks', 'Audio rhythm descriptions'],
        accessibilityNotes: 'High contrast colors, large print, tactile options'
      }
    ],
    activities: [
      {
        id: 'beat-exploration',
        name: 'Finding Your Beat',
        description: 'Discover how to feel and express beat using your preferred method',
        duration: 10,
        instructions: [
          'Choose your preferred way to feel beat: hearing, touch, sight, or movement',
          'Start with a slow, steady beat using vibration, visual cues, or sound',
          'Find a comfortable way to respond: tapping, nodding, breathing, or thinking',
          'Practice keeping the beat for 30 seconds, then gradually increase'
        ],
        adaptations: [
          'Wheelchair users: Use upper body movements, attach instruments to chair',
          'Visually impaired: Focus on tactile and auditory cues',
          'Hearing impaired: Use visual metronome and vibration',
          'Cognitive differences: Start with very slow tempos, use familiar songs',
          'Motor differences: Use whatever movement is comfortable and possible'
        ],
        materials: ['Adaptive metronome', 'Instruments of choice', 'Comfortable seating'],
        safetyNotes: ['Ensure all instruments are safely attached', 'Respect sensory sensitivities']
      },
      {
        id: 'inclusive-rhythm-circle',
        name: 'Everyone\'s Rhythm Circle',
        description: 'Create rhythms together where everyone can participate equally',
        duration: 15,
        instructions: [
          'Form a circle (or connected space for wheelchair users)',
          'Each person chooses their preferred rhythm-making method',
          'Start with simple patterns everyone can follow',
          'Take turns leading with different abilities showcased',
          'Create a group rhythm composition'
        ],
        adaptations: [
          'Virtual participation for remote learners',
          'Silent participation for those who prefer quiet',
          'Movement-based for those who can\'t use instruments',
          'Breath-based rhythms for minimal movement needs'
        ],
        materials: ['Variety of adaptive instruments', 'Recording device', 'Comfortable space'],
        safetyNotes: ['Ensure equal participation', 'Respect different comfort levels']
      }
    ],
    adaptations: [
      {
        type: 'motor',
        description: 'Full adaptation for wheelchair users and limited mobility',
        implementation: 'Mount instruments on wheelchair trays, use mouth-controlled instruments, focus on upper body movements',
        materials: ['Wheelchair-mounted instruments', 'Mouth-controlled devices', 'Adaptive grips']
      },
      {
        type: 'auditory',
        description: 'Complete visual and tactile rhythm learning',
        implementation: 'Use vibrating surfaces, visual rhythm displays, and tactile beat indicators',
        materials: ['Vibrating platforms', 'Visual rhythm software', 'Tactile metronomes']
      },
      {
        type: 'visual',
        description: 'Audio and tactile rhythm exploration',
        implementation: 'Focus on sound textures, vibrations, and spatial audio experiences',
        materials: ['Spatial audio equipment', 'Textured instruments', 'Audio description tools']
      },
      {
        type: 'cognitive',
        description: 'Simplified, repetitive, and memory-supported rhythm learning',
        implementation: 'Use familiar songs, repetitive patterns, and visual/audio cues for memory support',
        materials: ['Familiar music', 'Memory aid cards', 'Repetitive pattern tools']
      }
    ],
    assessment: {
      type: 'formative',
      criteria: [
        'Maintains steady beat using preferred method',
        'Recognizes rhythm patterns through chosen sensory input',
        'Participates actively in group activities',
        'Shows creative expression in rhythm creation'
      ],
      adaptations: [
        'Portfolio documentation instead of live performance',
        'Peer assessment and support',
        'Self-reflection through preferred communication method',
        'Progress tracking over time rather than single assessment'
      ],
      alternatives: [
        'Video documentation of progress',
        'Audio recordings of rhythm work',
        'Written or drawn rhythm representations',
        'Collaborative assessment with support team'
      ]
    },
    extensions: [
      {
        title: 'Rhythm and Technology',
        description: 'Explore how technology can enhance rhythm learning for all abilities',
        activities: [
          'Create digital rhythm compositions using adaptive software',
          'Explore rhythm apps designed for accessibility',
          'Record and share rhythm creations with others'
        ],
        connections: ['Technology education', 'Digital arts', 'Communication skills']
      },
      {
        title: 'Cultural Rhythms Around the World',
        description: 'Discover how different cultures express rhythm inclusively',
        activities: [
          'Research adaptive music traditions from various cultures',
          'Connect with musicians with disabilities globally',
          'Create fusion rhythms combining different cultural approaches'
        ],
        connections: ['Social studies', 'Geography', 'Cultural awareness']
      }