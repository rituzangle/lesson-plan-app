// src/pages/teacher/TeacherDashboard.tsx
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

// Teacher Dashboard Props
interface TeacherDashboardProps {
  navigation?: any;
}

// Quick stats interface
interface DashboardStats {
  totalLessons: number;
  activeClasses: number;
  upcomingDeadlines: number;
  recentActivity: string[];
}

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ navigation }) => {
  const { userProfile, isTeacher, announceToScreenReader } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalLessons: 0,
    activeClasses: 0,
    upcomingDeadlines: 0,
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
      
      // Simulate loading dashboard data
      // In real app, this would fetch from your database
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStats({
        totalLessons: 24,
        activeClasses: 5,
        upcomingDeadlines: 3,
        recentActivity: [
          'Created "Math Fractions" lesson',
          'Updated "Science Experiments" plan',
          'Shared lesson with colleague',
        ],
      });
      
      announceToScreenReader('Teacher dashboard loaded successfully');
    } catch (error) {
      console.error('Error loading dashboard:', error);
      Alert.alert('Error', 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Quick action handlers
  const handleCreateLesson = () => {
    announceToScreenReader('Opening lesson creator');
    navigation?.navigate('LessonEditor', { mode: 'create' });
  };

  const handleViewLessons = () => {
    announceToScreenReader('Opening lesson list');
    navigation?.navigate('LessonList');
  };

  const handleClassManagement = () => {
    announceToScreenReader('Class management feature coming soon');
    Alert.alert('Coming Soon', 'Class management feature is in development');
  };

  const handleReports = () => {
    announceToScreenReader('Reports feature coming soon');
    Alert.alert('Coming Soon', 'Reports feature is in development');
  };

  // Access control
  if (!isTeacher()) {
    return (
      <View style={styles.accessDenied}>
        <Text style={styles.accessDeniedTitle}>Access Denied</Text>
        <Text style={styles.accessDeniedText}>
          This dashboard is only available to teachers.
        </Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Loading your dashboard...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Welcome Header */}
      <View style={styles.header}>
        <Text style={styles.welcomeText}>
          Welcome back, {userProfile?.firstName || 'Teacher'}!
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

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>Quick Overview</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.totalLessons}</Text>
            <Text style={styles.statLabel}>Total Lessons</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.activeClasses}</Text>
            <Text style={styles.statLabel}>Active Classes</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.upcomingDeadlines}</Text>
            <Text style={styles.statLabel}>Upcoming</Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.actionsContainer}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity
            style={[styles.actionCard, styles.primaryAction]}
            onPress={handleCreateLesson}
            accessibilityRole="button"
            accessibilityLabel="Create new lesson plan"
          >
            <Text style={styles.actionIcon}>📝</Text>
            <Text style={styles.actionTitle}>Create Lesson</Text>
            <Text style={styles.actionSubtitle}>Start a new lesson plan</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={handleViewLessons}
            accessibilityRole="button"
            accessibilityLabel="View all lesson plans"
          >
            <Text style={styles.actionIcon}>📚</Text>
            <Text style={styles.actionTitle}>My Lessons</Text>
            <Text style={styles.actionSubtitle}>View & edit lessons</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={handleClassManagement}
            accessibilityRole="button"
            accessibilityLabel="Manage classes"
          >
            <Text style={styles.actionIcon}>👥</Text>
            <Text style={styles.actionTitle}>Classes</Text>
            <Text style={styles.actionSubtitle}>Manage your classes</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={handleReports}
            accessibilityRole="button"
            accessibilityLabel="View reports"
          >
            <Text style={styles.actionIcon}>📊</Text>
            <Text style={styles.actionTitle}>Reports</Text>
            <Text style={styles.actionSubtitle}>Progress & analytics</Text>
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

      {/* Accessibility Features Notice */}
      {userProfile?.accessibilitySettings?.screenReader && (
        <View style={styles.accessibilityNotice}>
          <Text style={styles.accessibilityText}>
            Screen reader support is enabled. Use swipe gestures to navigate between elements.
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
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
    color: '#1e293b',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 16,
    color: '#64748b',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
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
    color: '#2563eb',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#64748b',
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
    backgroundColor: '#2563eb',
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
    textAlign: 'center',
  },
  actionSubtitle: {
    fontSize: 12,
    color: '#64748b',
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
    color: '#2563eb',
    marginRight: 12,
    marginTop: 2,
  },
  activityText: {
    fontSize: 14,
    color: '#1e293b',
    flex: 1,
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
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#64748b',
  },
  accessDenied: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
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
    color: '#64748b',
    textAlign: 'center',
  },
});

export default TeacherDashboard;