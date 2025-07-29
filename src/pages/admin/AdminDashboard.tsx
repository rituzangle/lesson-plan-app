import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '../../context/AuthContext';

export const AdminDashboard: React.FC = () => {
  const { userProfile } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>
          Admin Dashboard
        </Text>
        <Text style={styles.subtitle}>
          Welcome, {userProfile?.firstName}! You have administrator privileges.
        </Text>
        <View style={styles.grid}>
          <View style={[styles.gridItem, styles.blueBg]}>
            <Text style={styles.gridItemTitle}>User Management</Text>
            <Text style={styles.gridItemText}>Manage teachers and students</Text>
          </View>
          <View style={[styles.gridItem, styles.greenBg]}>
            <Text style={styles.gridItemTitle}>School Settings</Text>
            <Text style={styles.gridItemText}>Configure school-wide settings</Text>
          </View>
          <View style={[styles.gridItem, styles.purpleBg]}>
            <Text style={styles.gridItemTitle}>Reports</Text>
            <Text style={styles.gridItemText}>View system-wide analytics</Text>
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
  purpleBg: {
    backgroundColor: '#f3e5f5',
  },
});