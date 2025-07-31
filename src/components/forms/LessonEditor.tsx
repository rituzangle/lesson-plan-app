// Modular lesson plan editor component with encryption and user isolation

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Alert } from 'react-native';
import { LessonPlan, Subject } from '../../types/lesson.types';
import { LessonService } from '../../services/lesson.service';
import Button from '../ui/Button';
import SubjectSelector from '../ui/SubjectSelector';
import TemplateSelector from '../ui/TemplateSelector';

interface LessonEditorProps {
  userId: string;
  initialLessonPlan?: LessonPlan;
  onSave?: (lessonPlan: LessonPlan) => void;
}

export default function LessonEditor({ userId, initialLessonPlan, onSave }: LessonEditorProps) {
  const [lessonPlan, setLessonPlan] = useState<Partial<LessonPlan>>(
    initialLessonPlan || {
      title: '',
      subject: '',
      gradeLevel: '',
      duration: 45,
      objectives: [''],
      materials: [''],
      activities: [],
      assessment: { formative: '', summative: '' }
    }
  );
  
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (!lessonPlan.title || !lessonPlan.subject) {
      Alert.alert('Error', 'Please fill in title and subject');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const completeLessonPlan: LessonPlan = {
        id: lessonPlan.id || Date.now().toString(),
        title: lessonPlan.title,
        subject: lessonPlan.subject,
        gradeLevel: lessonPlan.gradeLevel || '',
        duration: lessonPlan.duration || 45,
        objectives: lessonPlan.objectives || [''],
        materials: lessonPlan.materials || [''],
        activities: lessonPlan.activities || [],
        assessment: lessonPlan.assessment || { formative: '', summative: '' },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId
      };

      await LessonService.saveLessonPlan(completeLessonPlan, userId);
      Alert.alert('Success', 'Lesson plan saved successfully!');
      
      if (onSave) {
        onSave(completeLessonPlan);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save lesson plan');
      Alert.alert('Error', 'Failed to save lesson plan');
    } finally {
      setIsLoading(false);
    }
  };

  const updateObjectives = (index: number, value: string) => {
    const newObjectives = [...(lessonPlan.objectives || [''])];
    newObjectives[index] = value;
    setLessonPlan({ ...lessonPlan, objectives: newObjectives });
  };

  const addObjective = () => {
    setLessonPlan({
      ...lessonPlan,
      objectives: [...(lessonPlan.objectives || ['']), '']
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Lesson Plan Editor</Text>
        {error && <Text style={styles.error}>{error}</Text>}
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Title *</Text>
        <TextInput
          style={styles.input}
          value={lessonPlan.title}
          onChangeText={(text) => setLessonPlan({ ...lessonPlan, title: text })}
          placeholder="Enter lesson title"
          testID="lesson-title-input"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Subject *</Text>
        <SubjectSelector
          selectedSubject={selectedSubject}
          onSubjectSelect={(subject) => {
            setSelectedSubject(subject);
            setLessonPlan({ ...lessonPlan, subject: subject.name });
          }}
        />
      </View>

      {selectedSubject && (
        <View style={styles.section}>
          <Text style={styles.label}>Template</Text>
          <TemplateSelector
            subject={selectedSubject}
            onTemplateSelect={(template) => {
              setLessonPlan({
                ...lessonPlan,
                duration: template.duration,
                objectives: template.objectives,
                materials: template.materials,
                activities: template.activities,
                assessment: template.assessment
              });
            }}
          />
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.label}>Grade Level</Text>
        <TextInput
          style={styles.input}
          value={lessonPlan.gradeLevel}
          onChangeText={(text) => setLessonPlan({ ...lessonPlan, gradeLevel: text })}
          placeholder="e.g., K, 1, 2, 3..."
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Duration (minutes)</Text>
        <TextInput
          style={styles.input}
          value={lessonPlan.duration?.toString()}
          onChangeText={(text) => setLessonPlan({ ...lessonPlan, duration: parseInt(text) || 45 })}
          placeholder="45"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Learning Objectives</Text>
        {lessonPlan.objectives?.map((objective, index) => (
          <TextInput
            key={index}
            style={styles.input}
            value={objective}
            onChangeText={(text) => updateObjectives(index, text)}
            placeholder={`Objective ${index + 1}`}
            multiline
          />
        ))}
        <Button
          title="+ Add Objective"
          onPress={addObjective}
          variant="outline"
          size="small"
        />
      </View>

      <View style={styles.footer}>
        <Button
          title={isLoading ? "Saving..." : "Save Lesson Plan"}
          onPress={handleSave}
          disabled={isLoading}
          variant="primary"
          size="large"
          testID="save-lesson-button"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  error: {
    color: '#f44336',
    marginTop: 10,
    fontSize: 14,
  },
  section: {
    backgroundColor: '#fff',
    margin: 10,
    padding: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  footer: {
    padding: 20,
    paddingBottom: 40,
  },
});
