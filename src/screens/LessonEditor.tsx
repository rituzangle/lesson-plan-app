import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Alert } from 'react-native';

const LessonEditor = ({ initialTitle = '', initialSummary = '', onSave }) => {
  const [title, setTitle] = useState(initialTitle);
  const [summary, setSummary] = useState(initialSummary);

  const handleSave = () => {
    if (title.trim() === '') {
      Alert.alert('Oops!', 'Lesson title is required.');
      return;
    }
    onSave({ title, summary });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Lesson Title</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter title..."
        value={title}
        onChangeText={setTitle}
      />
      <Text style={styles.label}>Summary</Text>
      <TextInput
        style={styles.textArea}
        placeholder="Write a brief overview..."
        value={summary}
        onChangeText={setSummary}
        multiline
      />
      <Button title="Save Lesson" onPress={handleSave} color="#4CAF50" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  label: { fontWeight: 'bold', marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 6, marginBottom: 12 },
  textArea: { height: 100, borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 6 },
});

export default LessonEditor;

