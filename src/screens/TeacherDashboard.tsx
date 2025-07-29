// TeacherDashboard.tsx - Main teacher interface
// Path: src/screens/TeacherDashboard.tsx
// Created: 2025-07-28 for lesson-plan-app

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
} from 'react-native';
import { useAuth } from '../auth/AuthContext';
import { QuickLessonCreator } from '../components/teacher/QuickLessonCreator';
import { ClassOverview } from '../components/teacher/ClassOverview';
import { RecentLessons } from '../components/teacher/RecentLessons';
import { StudentProgress } from '../components/teacher/StudentProgress';

const { width } = Dimensions.get('window');

interface TeacherDashboardProps {
  navigation?: any;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ navigation }) => {
  const { user, userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'lessons' | 'quiz' | 'progress'>('overview');
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'new-lesson':
        navigation?.navigate('LessonEditor', { mode: 'create' });
        break;
      case 'create-quiz':
        navigation?.navigate('QuizCreator');
        break;
      case 'gradebook':
        navigation?.navigate('Gradebook');
        break;
      case 'accessibility':
        Alert.alert('Accessibility Tools', 'Screen reader, large text, and contrast options available');
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <ClassOverview onQuickAction={handleQuickAction} />;
      case 'lessons':
        return <RecentLessons onQuickAction={handleQuickAction} />;
      case 'quiz':
        return <QuickLessonCreator onQuickAction={handleQuickAction} />;
      case 'progress':
        return <StudentProgress onQuickAction={handleQuickAction} />;
      default:
        return <ClassOverview onQuickAction={handleQuickAction} />;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>
          {greeting}, {userProfile?.full_name || 'Teacher'}!
        </Text>
        <Text style={styles.subtitle}>Ready to inspire minds today?</Text>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        {[
          { key: 'overview', label: '📊 Overview', icon: '📊' },
          { key: 'lessons', label: '📚 Lessons', icon: '📚' },
          { key: 'quiz', label: '❓ Quiz', icon: '❓' },
          { key: 'progress', label: '📈 Progress', icon: '📈' },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.activeTab]}
            onPress={() => setActiveTab(tab.key as any)}
            accessibilityLabel={`${tab.label} tab`}
            accessibilityRole="tab"
          >
            <Text style={styles.tabIcon}>{tab.icon}</Text>
            <Text style={[styles.tabText, activeTab === tab.key && styles.activeTabText]}>
              {tab.label.replace(/^.\s/, '')}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Main Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderTabContent()}
      </ScrollView>

      {/* Quick Actions FAB */}
      <View style={styles.fabContainer}>
        <TouchableOpacity
          style={styles.fab}
          onPress={() => handleQuickAction('new-lesson')}
          accessibilityLabel="Create new lesson"
          accessibilityRole="button"
        >
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#2196F3',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginHorizontal: 10,
    marginTop: -10,
    borderRadius: 15,
    padding: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 10,
  },
  activeTab: {
    backgroundColor: '#2196F3',
  },
  tabIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  tabText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: 'white',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingTop: 20,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 30,
    right: 30,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FF4081',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  fabText: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
});