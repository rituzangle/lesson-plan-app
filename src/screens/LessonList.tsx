import React from 'react';
import { ScrollView } from 'react-native';
import LessonCard from './LessonCard';

const LessonList = ({ lessons }) => (
  <ScrollView>
    {lessons.map((lesson, idx) => (
      <LessonCard key={idx} title={lesson.title} summary={lesson.summary} />
    ))}
  </ScrollView>
);

export default LessonList;

