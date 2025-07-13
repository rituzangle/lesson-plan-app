import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const StorageStats = () => {
  const [localKeys, setLocalKeys] = useState([]);
  const [cloudRecords, setCloudRecords] = useState(0);

  useEffect(() => {
    AsyncStorage.getAllKeys().then(setLocalKeys);
    // Replace this with your actual Supabase query
    fetch('https://your-supabase-url.rest/v1/lessons')
      .then(res => res.json())
      .then(data => setCloudRecords(data.length));
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>📦 Storage Dashboard</Text>
      <Text>Local Items (AsyncStorage): {localKeys.length}</Text>
      <Text>Cloud Items (Supabase): {cloudRecords}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  heading: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
});

export default StorageStats;

