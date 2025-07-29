// ClassOverview.tsx - Main class overview dashboard
// Path: src/components/teacher/ClassOverview.tsx  
// Created: 2025-07-28 for lesson-plan-app

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

interface ClassOverviewProps {
  onQuickAction: (action: string) => void;
}

interface ClassStats {
  totalStudents: number;
  activeClasses: number;
  completedLessons: number;
  pendingGrades: number;
}

interface RecentActivity {
  id: string;
  type: 'lesson' | 'quiz' | 'grade';
  title: string;
  timestamp: string;
  status: 'completed' | 'pending' | 'draft';
}

export const ClassOverview: React.FC<ClassOverviewProps> = ({ onQuickAction }) => {
  const [stats, setStats] = useState<ClassStats>({
    totalStudents: 28,
    activeClasses: 3,
    completedLessons: 15,
    pendingGrades: 7,
  });

  const [recentActivity] = useState<RecentActivity[]>([
    {
      id: '1',
      type: 'quiz',
      title: 'Chapter 5: Photosynthesis Quiz',
      timestamp: '2 hours ago',
      status: 'completed',
    },
    {
      id: '2',
      type: 'lesson',
      title: 'Plant Cell Structure',
      timestamp: 'Yesterday',
      status: 'completed',
    },
    {
      id: '3',
      type: 'grade',
      title: 'Midterm Exam - Biology 101',
      timestamp: '2 days ago',
      status: 'pending',
    },
    {
      id: '4',
      type: 'lesson',
      title: 'Chapter 6: Cellular Respiration',
      timestamp: '3 days ago',
      status: 'draft',
    },
  ]);

  const getStatColor = (type: string) => {
    switch (type) {
      case 'students': return '#4CAF50';
      case 'classes': return '#2196F3';
      case 'lessons': return '#FF9800';
      case 'grades': return '#F44336';
      default: return '#666';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'lesson': return '📚';
      case 'quiz': return '❓';
      case 'grade': return '📊';
      default: return '📝';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#4CAF50';
      case 'pending': return '#FF9800';
      case 'draft': return '#9E9E9E';
      default: return '#666';
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Welcome Message */}
      <View style={styles.welcomeCard}>
        <Text style={styles.welcomeTitle}>Welcome back! 👋</Text>
        <Text style={styles.welcomeSubtitle}>
          Your students are excited to learn today. Let's make it amazing!
        </Text>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statsRow}>
          <TouchableOpacity 
            style={[styles.statCard, { borderLeftColor: getStatColor('students') }]}
            onPress={() => onQuickAction('student-list')}
            accessibilityLabel="View student list"
          >
            <Text style={styles.statNumber}>{stats.totalStudents}</Text>
            <Text style={styles.statLabel}>Students</Text>
            <Text style={styles.statIcon}>👥</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.statCard, { borderLeftColor: getStatColor('classes') }]}
            onPress={() => onQuickAction('active-classes')}
            accessibilityLabel="View active classes"
          >
            <Text style={styles.statNumber}>{stats.activeClasses}</Text>
            <Text style={styles.statLabel}>Classes</Text>
            <Text style={styles.statIcon}>🏫</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsRow}>
          <TouchableOpacity 
            style={[styles.statCard, { borderLeftColor: getStatColor('lessons') }]}
            onPress={() => onQuickAction('completed-lessons')}
            accessibilityLabel="View completed lessons"
          >
            <Text style={styles.statNumber}>{stats.completedLessons}</Text>
            <Text style={styles.statLabel}>Lessons Done</Text>
            <Text style={styles.statIcon}>✅</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.statCard, { borderLeftColor: getStatColor('grades') }]}
            onPress={() => onQuickAction('pending-grades')}
            accessibilityLabel="View pending grades"
          >
            <Text style={styles.statNumber}>{stats.pendingGrades}</Text>
            <Text style={styles.statLabel}>To Grade</Text>
            <Text style={styles.statIcon}>📝</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⚡ Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          {[
            { label: 'New Lesson', action: 'new-lesson', icon: '📚', color: '#2196F3' },
            { label: 'Create Quiz', action: 'create-quiz', icon: '❓', color: '#FF4081' },
            { label: 'Gradebook', action: 'gradebook', icon: '📊', color: '#4CAF50' },
            { label: 'Class Notes', action: 'class-notes', icon: '📄', color: '#FF9800' },
          ].map((item) => (
            <TouchableOpacity
              key={item.action}
              style={[styles.quickActionButton, { backgroundColor: item.color }]}
              onPress={() => onQuickAction(item.action)}
              accessibilityLabel={item.label}
            >
              <Text style={styles.quickActionIcon}>{item.icon}</Text>
              <Text style={styles.quickActionText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Recent Activity */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🕒 Recent Activity</Text>
        {recentActivity.map((activity) => (
          <TouchableOpacity
            key={activity.id}
            style={styles.activityItem}
            onPress={() => onQuickAction(`activity-${activity.id}`)}
            accessibilityLabel={`${activity.title}, ${activity.timestamp}`}
          >
            <View style={styles.activityLeft}>
              <Text style={styles.activityIcon}>{getActivityIcon(activity.type)}</Text>
              <View style={styles.activityInfo}>
                <Text style={styles.activityTitle}>{activity.title}</Text>
                <Text style={styles.activityTime}>{activity.timestamp}</Text>
              </View>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(activity.status) }]}>
              <Text style={styles.statusText}>
                {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Today's Schedule Teaser */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📅 Today's Classes</Text>
        <View style={styles.schedulePreview}>
          <Text style={styles.scheduleItem}>🕘 9:00 AM - Biology 101 (Room 204)</Text>
          <Text style={styles.scheduleItem}>🕚 11:00 AM - Advanced Biology (Lab)</Text>
          <Text style={styles.scheduleItem}>🕐 2:00 PM - Study Hall Supervision</Text>
        </View>
        <TouchableOpacity 
          style={styles.viewFullSchedule}
          onPress={() => onQuickAction('full-schedule')}
        >
          <Text style={styles.viewFullScheduleText}>View Full Schedule →</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  welcomeCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
  statsContainer: {
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  statIcon: {
    fontSize: 16,
    alignSelf: 'flex-end',
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
    marginBottom: 16,
    color: '#333',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  quickActionButton: {
    flex: 1,
    minWidth: '48%',
    borderRadius: 12,
    padding: 16,
    margin: 2,
    alignItems: 'center',
  },
  quickActionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  quickActionText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  activityLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  activityIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    color: 'white',
    fontWeight: 'bold',
  },
  schedulePreview: {
    marginBottom: 12,
  },
  scheduleItem: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    paddingLeft: 8,
  },
  viewFullSchedule: {
    alignSelf: 'flex-end',
  },
  viewFullScheduleText: {
    fontSize: 14,
    color: '#2196F3',
    fontWeight: '500',
  },
});