// Destination: src/components/forms/LessonEditor.tsx
// Modular lesson plan editor component with encryption and user isolation

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Alert } from 'react-native';
import { LessonPlan, Subject } from '../../types/lesson.types';
import { LessonService } from '../../services/lesson.service';
import { Button } from '../ui/Button';
import { SubjectSelector } from '../ui/SubjectSelector';
import { TemplateSelector } from '../ui/TemplateSelector';

interface LessonEditorProps {
  lessonId?: string;
  onSave: (lesson: LessonPlan) => void;
  onCancel: () => void;
}

export const LessonEditor: React.FC<LessonEditorProps> = ({
  lessonId,
  onSave,
  onCancel
}) => {
  const [lesson, setLesson] = useState<LessonPlan>({
    id: lessonId || '',
    title: '',
    subject: '',
    gradeLevel: '',
    duration: 45,
    objectives: [],
    materials: [],
    activities: [],
    assessment: '',
    notes: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadInitialData();
  }, [lessonId]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      
      // Load subjects
      const subjectsData = await LessonService.getSubjects();
      setSubjects(subjectsData);

      // Load existing lesson if editing
      if (lessonId) {
        const existingLesson = await LessonService.getLesson(lessonId);
        if (existingLesson) {
          setLesson(existingLesson);
        }
      }
    } catch (error) {
      console.error('Error loading initial data:', error);
      Alert.alert('Error', 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!validateLesson()) return;

    try {
      setLoading(true);
      const savedLesson = await LessonService.saveLesson(lesson);
      onSave(savedLesson);
    } catch (error) {
      console.error('Error saving lesson:', error);
      Alert.alert('Error', 'Failed to save lesson');
    } finally {
      setLoading(false);
    }
  };

  const validateLesson = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!lesson.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!lesson.subject) {
      newErrors.subject = 'Subject is required';
    }
    if (!lesson.gradeLevel) {
      newErrors.gradeLevel = 'Grade level is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateLesson = (field: keyof LessonPlan, value: any) => {
    setLesson(prev => ({
      ...prev,
      [field]: value,
      updatedAt: new Date().toISOString()
    }));
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>
        {lessonId ? 'Edit Lesson Plan' : 'Create New Lesson Plan'}
      </Text>

      {/* Basic Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Basic Information</Text>
        
        <TextInput
          style={[styles.input, errors.title && styles.inputError]}
          placeholder="Lesson Title"
          value={lesson.title}
          onChangeText={(text) => updateLesson('title', text)}
        />
        {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}

        <SubjectSelector
          subjects={subjects}
          selectedSubject={lesson.subject}
          onSelectSubject={(subject) => updateLesson('subject', subject)}
          error={errors.subject}
        />

        <TextInput
          style={[styles.input, errors.gradeLevel && styles.inputError]}
          placeholder="Grade Level (e.g., 3rd Grade, High School)"
          value={lesson.gradeLevel}
          onChangeText={(text) => updateLesson('gradeLevel', text)}
        />
        {errors.gradeLevel && <Text style={styles.errorText}>{errors.gradeLevel}</Text>}

        <TextInput
          style={styles.input}
          placeholder="Duration (minutes)"
          value={lesson.duration.toString()}
          keyboardType="numeric"
          onChangeText={(text) => updateLesson('duration', parseInt(text) || 45)}
        />
      </View>

      {/* Template Selection */}
      <View style={styles.section}>
        <TemplateSelector
          subject={lesson.subject}
          onSelectTemplate={(template) => {
            // Apply template to lesson
            setLesson(prev => ({
              ...prev,
              activities: template.activities,
              materials: template.materials
            }));
          }}
        />
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <Button
          title="Cancel"
          onPress={onCancel}
          style={styles.cancelButton}
        />
        <Button
          title={lessonId ? 'Update' : 'Create'}
          onPress={handleSave}
          disabled={loading}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  section: {
    marginBottom: 24
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    fontSize: 16
  },
  inputError: {
    borderColor: '#ff4444'
  },
  errorText: {
    color: '#ff4444',
    fontSize: 12,
    marginBottom: 8
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingBottom: 40
  },
  cancelButton: {
    backgroundColor: '#666',
    flex: 0.45
  }
});

export default LessonEditor;