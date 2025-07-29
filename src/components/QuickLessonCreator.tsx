// QuickLessonCreator.tsx - Quick lesson and quiz creation
// Path: src/components/teacher/QuickLessonCreator.tsx
// Created: 2025-07-28 for lesson-plan-app

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';

interface QuickLessonCreatorProps {
  onQuickAction: (action: string) => void;
}

export const QuickLessonCreator: React.FC<QuickLessonCreatorProps> = ({ onQuickAction }) => {
  const [lessonTitle, setLessonTitle] = useState('');
  const [chapter, setChapter] = useState('');
  const [quizType, setQuizType] = useState<'multiple' | 'truefalse' | 'fill' | 'adaptive'>('multiple');

  const createQuickLesson = () => {
    if (!lessonTitle.trim()) {
      Alert.alert('Error', 'Please enter a lesson title');
      return;
    }
    
    // Create lesson logic here
    Alert.alert('Success', `Created lesson: ${lessonTitle}${chapter ? ` (Chapter ${chapter})` : ''}`);
    setLessonTitle('');
    setChapter('');
  };

  const createQuiz = () => {
    if (!lessonTitle.trim()) {
      Alert.alert('Error', 'Please enter a lesson/topic for the quiz');
      return;
    }

    const quizTypes = {
      multiple: 'Multiple Choice Quiz',
      truefalse: 'True/False Quiz',
      fill: 'Fill in the Blanks',
      adaptive: 'Adaptive Test (AI-powered)'
    };

    Alert.alert(
      'Quiz Created',
      `${quizTypes[quizType]} created for: ${lessonTitle}`,
      [
        { text: 'Edit Quiz', onPress: () => onQuickAction('create-quiz') },
        { text: 'OK' }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Quick Lesson Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📚 Quick Lesson Creation</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Lesson title or topic..."
          value={lessonTitle}
          onChangeText={setLessonTitle}
          accessibilityLabel="Lesson title input"
        />
        
        <TextInput
          style={styles.input}
          placeholder="Chapter number (optional)"
          value={chapter}
          onChangeText={setChapter}
          keyboardType="numeric"
          accessibilityLabel="Chapter number input"
        />

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={createQuickLesson}
          accessibilityLabel="Create quick lesson"
        >
          <Text style={styles.buttonText}>Create Lesson</Text>
        </TouchableOpacity>
      </View>

      {/* Quiz Creation Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>❓ Quiz Creator</Text>
        <Text style={styles.subtitle}>Top teacher choice: Online assessments</Text>

        {/* Quiz Type Selection */}
        <View style={styles.quizTypeContainer}>
          {[
            { key: 'multiple', label: 'Multiple Choice', icon: '🔘' },
            { key: 'truefalse', label: 'True/False', icon: '✅' },
            { key: 'fill', label: 'Fill Blanks', icon: '✏️' },
            { key: 'adaptive', label: 'Adaptive AI', icon: '🤖' },
          ].map((type: any) => (
            <TouchableOpacity
              key={type.key}
              style={[
                styles.quizTypeButton,
                quizType === type.key && styles.selectedQuizType
              ]}
              onPress={() => setQuizType(type.key)}
              accessibilityLabel={`${type.label} quiz type`}
            >
              <Text style={styles.quizTypeIcon}>{type.icon}</Text>
              <Text style={[
                styles.quizTypeText,
                quizType === type.key && styles.selectedQuizTypeText
              ]}>
                {type.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={createQuiz}
          accessibilityLabel="Create quiz"
        >
          <Text style={styles.secondaryButtonText}>Create Quiz</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⚡ Quick Actions</Text>
        
        <View style={styles.actionGrid}>
          {[
            { label: 'Chapter Summary', action: 'chapter-summary', icon: '📄' },
            { label: 'Student Notes', action: 'student-notes', icon: '📝' },
            { label: 'Accessibility', action: 'accessibility', icon: '♿' },
            { label: 'Gradebook', action: 'gradebook', icon: '📊' },
          ].map((item) => (
            <TouchableOpacity
              key={item.action}
              style={styles.actionButton}
              onPress={() => onQuickAction(item.action)}
              accessibilityLabel={item.label}
            >
              <Text style={styles.actionIcon}>{item.icon}</Text>
              <Text style={styles.actionText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    fontStyle: 'italic',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  primaryButton: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: '#FF4081',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  quizTypeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  quizTypeButton: {
    flex: 1,
    minWidth: '48%',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    margin: 2,
    alignItems: 'center',
  },
  selectedQuizType: {
    backgroundColor: '#E3F2FD',
    borderWidth: 2,
    borderColor: '#2196F3',
  },
  quizTypeIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  quizTypeText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  selectedQuizTypeText: {
    color: '#2196F3',
    fontWeight: 'bold',
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  actionButton: {
    flex: 1,
    minWidth: '48%',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    margin: 2,
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  actionText: {
    fontSize: 12,
    color: '#555',
    textAlign: 'center',
  },
});