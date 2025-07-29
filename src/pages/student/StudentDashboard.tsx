// src/pages/student/StudentDashboard.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../../components/AuthContext';
import { useNavigation } from '@react-navigation/native';

// Student Dashboard Props
interface StudentDashboardProps {
  navigation?: any;
}

// Student stats interface
interface StudentStats {
  assignedLessons: number;
  completedLessons: number;
  upcomingAssignments: number;
  currentGrade: string;
  recentActivity: string[];
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ navigation }) => {
  const { userProfile, isStudent, announceToScreenReader } = useAuth();
  const [stats, setStats] = useState<StudentStats>({
    assignedLessons: 0,
    completedLessons: 0,
    upcomingAssignments: 0,
    currentGrade: 'A',
    recentActivity: [],
  });
  const [loading, setLoading] = useState(true);

  // Load dashboard data
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Simulate loading student data
      // In real app, this would fetch from your database
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStats({
        assignedLessons: 12,
        completedLessons: 8,
        upcomingAssignments: 3,
        currentGrade: 'A-',
        recentActivity: [
          'Completed "Math Fractions" lesson',
          'Started "Science Experiments" assignment',
          'Submitted homework for review',
        ],
      });
      
      announceToScreenReader('Student dashboard loaded successfully');
    } catch (error) {
      console.error('Error loading dashboard:', error);
      Alert.alert('Error', 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Quick action handlers
  const handleViewAssignments = () => {
    announceToScreenReader('Opening assignments');
    Alert.alert('Coming Soon', 'Assignments view is in development');
  };

  const handleStudyMode = () => {
    announceToScreenReader('Opening study mode');
    navigation?.navigate('LessonList');
  };

  const handleProgress = () => {
    announceToScreenReader('Opening progress tracker');
    Alert.alert('Coming Soon', 'Progress tracking is in development');
  };

  const handleHelp = () => {
    announceToScreenReader('Opening help center');
    Alert.alert('Help', 'Need help? Contact your teacher or check the help section.');
  };

  // Access control
  if (!isStudent()) {
    return (
      <View style={styles.accessDenied}>
        <Text style={styles.accessDeniedTitle}>Access Denied</Text>
        <Text style={styles.accessDeniedText}>
          This dashboard is only available to students.
        </Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#059669" />
        <Text style={styles.loadingText}>Loading your dashboard...</Text>
      </View>
    );
  }

  const completionPercentage = stats.assignedLessons > 0 
    ? Math.round((stats.completedLessons / stats.assignedLessons) * 100)
    : 0;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Welcome Header */}
      <View style={styles.header}>
        <Text style={styles.welcomeText}>
          Hi {userProfile?.firstName || 'Student'}! 👋
        </Text>
        <Text style={styles.dateText}>
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </Text>
      </View>

      {/* Progress Overview */}
      <View style={styles.progressContainer}>
        <Text style={styles.sectionTitle}>Your Progress</Text>
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressPercentage}>{completionPercentage}%</Text>
            <Text style={styles.progressLabel}>Complete</Text>
          </View>
          <View style={styles.progressBar}>
            <View 
              style={[styles.progressFill, { width: `${completionPercentage}%` }]} 
            />
          </View>
          <Text style={styles.progressText}>
            {stats.completedLessons} of {stats.assignedLessons} lessons completed
          </Text>
        </View>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>At a Glance</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.upcomingAssignments}</Text>
            <Text style={styles.statLabel}>Due Soon</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.currentGrade}</Text>
            <Text style={styles.statLabel}>Current Grade</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.assignedLessons - stats.completedLessons}</Text>
            <Text style={styles.statLabel}>To Complete</Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.actionsContainer}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity
            style={[styles.actionCard, styles.primaryAction]}
            onPress={handleStudyMode}
            accessibilityRole="button"
            accessibilityLabel="Start studying lessons"
          >
            <Text style={styles.actionIcon}>📚</Text>
            <Text style={styles.actionTitle}>Study</Text>
            <Text style={styles.actionSubtitle}>Continue learning</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={handleViewAssignments}
            accessibilityRole="button"
            accessibilityLabel="View assignments"
          >
            <Text style={styles.actionIcon}>📝</Text>
            <Text style={styles.actionTitle}>Assignments</Text>
            <Text style={styles.actionSubtitle}>See what's due</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={handleProgress}
            accessibilityRole="button"
            accessibilityLabel="View progress"
          >
            <Text style={styles.actionIcon}>📊</Text>
            <Text style={styles.actionTitle}>Progress</Text>
            <Text style={styles.actionSubtitle}>Track your growth</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={handleHelp}
            accessibilityRole="button"
            accessibilityLabel="Get help"
          >
            <Text style={styles.actionIcon}>🤝</Text>
            <Text style={styles.actionTitle}>Help</Text>
            <Text style={styles.actionSubtitle}>Need assistance?</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent Activity */}
      <View style={styles.activityContainer}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        {stats.recentActivity.map((activity, index) => (
          <View key={index} style={styles.activityItem}>
            <Text style={styles.activityBullet}>•</Text>
            <Text style={styles.activityText}>{activity}</Text>
          </View>
        ))}
      </View>

      {/* Motivation Message */}
      <View style={styles.motivationCard}>
        <Text style={styles.motivationIcon}>🌟</Text>
        <Text style={styles.motivationText}>
          {completionPercentage >= 80 
            ? "Amazing work! You're almost there!" 
            : completionPercentage >= 50 
            ? "Great progress! Keep it up!" 
            : "Every lesson gets you closer to your goals!"}
        </Text>
      </View>

      {/* Accessibility Features Notice */}
      {userProfile?.accessibilitySettings?.screenReader && (
        <View style={styles.accessibilityNotice}>
          <Text style={styles.accessibilityText}>
            Screen reader support is active. Swipe to navigate between elements.
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0fdf4',
  },
  contentContainer: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#14532d',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 16,
    color: '#6b7280',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#14532d',
    marginBottom: 16,
  },
  progressContainer: {
    marginBottom: 32,
  },
  progressCard: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  progressHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  progressPercentage: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#059669',
  },
  progressLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#059669',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  statsContainer: {
    marginBottom: 32,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#059669',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  actionsContainer: {
    marginBottom: 32,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    width: '48%',
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryAction: {
    backgroundColor: '#059669',
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#14532d',
    marginBottom: 4,
    textAlign: 'center',
  },
  actionSubtitle: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  activityContainer: {
    marginBottom: 32,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 8,
  },
  activityBullet: {
    fontSize: 16,
    color: '#059669',
    marginRight: 12,
    marginTop: 2,
  },
  activityText: {
    fontSize: 14,
    color: '#14532d',
    flex: 1,
  },
  motivationCard: {
    backgroundColor: '#fef3c7',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  motivationIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  motivationText: {
    fontSize: 16,
    color: '#92400e',
    textAlign: 'center',
    fontWeight: '500',
  },
  accessibilityNotice: {
    backgroundColor: '#dbeafe',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  accessibilityText: {
    fontSize: 14,
    color: '#1e40af',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
  },
  accessDenied: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    padding: 20,
  },
  accessDeniedTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#dc2626',
    marginBottom: 16,
  },
  accessDeniedText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
});

export default StudentDashboard;