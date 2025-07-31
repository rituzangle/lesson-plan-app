import AsyncStorage from '@react-native-async-storage/async-storage';
import { LessonPlan } from '../types/lesson.types';

export class LessonService {
  static async saveLessonPlan(lessonPlan: LessonPlan, userId: string): Promise<void> {
    const key = `lesson_${userId}_${lessonPlan.id}`;
    await AsyncStorage.setItem(key, JSON.stringify(lessonPlan));
  }

  static async getLessonPlan(id: string, userId: string): Promise<LessonPlan | null> {
    const key = `lesson_${userId}_${id}`;
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }

  static async getAllLessonPlans(userId: string): Promise<LessonPlan[]> {
    const keys = await AsyncStorage.getAllKeys();
    const userKeys = keys.filter(key => key.startsWith(`lesson_${userId}_`));
    const lessons = await AsyncStorage.multiGet(userKeys);
    return lessons.map(([, value]) => JSON.parse(value || '{}')).filter(Boolean);
  }
}
