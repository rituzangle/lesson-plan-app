import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '../../context/AuthContext';

export const StudentDashboard: React.FC = () => {
  const { userProfile } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>
          Student Dashboard
        </Text>
        <Text style={styles.subtitle}>
          Hi {userProfile?.firstName}! Here's what's happening in your classes.
        </Text>
        <View style={styles.grid}>
          <View style={[styles.gridItem, styles.blueBg]}>
            <Text style={styles.gridItemTitle}>My Classes</Text>
            <Text style={styles.gridItemText}>View your enrolled classes</Text>
          </View>
          <View style={[styles.gridItem, styles.greenBg]}>
            <Text style={styles.gridItemTitle}>Assignments</Text>
            <Text style={styles.gridItemText}>Complete your assignments</Text>
          </View>
          <View style={[styles.gridItem, styles.yellowBg]}>
            <Text style={styles.gridItemTitle}>Grades</Text>
            <Text style={styles.gridItemText}>Check your progress</Text>
          </View>
          <View style={[styles.gridItem, styles.purpleBg]}>
            <Text style={styles.gridItemTitle}>Resources</Text>
            <Text style={styles.gridItemText}>Access study materials</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  gridItem: {
    width: '48%', // Adjust as needed for spacing
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  gridItemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  gridItemText: {
    fontSize: 13,
  },
  blueBg: {
    backgroundColor: '#e0f7fa',
  },
  greenBg: {
    backgroundColor: '#e8f5e9',
  },
  yellowBg: {
    backgroundColor: '#fffde7',
  },
  purpleBg: {
    backgroundColor: '#f3e5f5',
  },
});
