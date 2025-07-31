// Example for LessonCard.tsx
// called by src/components/index.ts
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const LessonCard = ({ title, summary }) => (
  <View style={styles.card}>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.summary}>{summary}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: { backgroundColor: '#f4f4f4', padding: 12, marginBottom: 10, borderRadius: 8 },
  title: { fontSize: 18, fontWeight: 'bold' },
  summary: { fontSize: 14, color: '#555' },
});

export default LessonCard;

