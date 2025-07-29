import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const AdminDashboard: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Admin Dashboard (Placeholder)</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
});
