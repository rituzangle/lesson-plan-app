import React from 'react';
import { Text, StyleSheet } from 'react-native';

type UserGreetingProps = {
  name: string;
};

const UserGreeting = ({ name }: UserGreetingProps) => (
  <Text style={styles.greeting}>Welcome back, {name}! ✨</Text>
);

const styles = StyleSheet.create({
  greeting: { fontSize: 20, marginVertical: 10, textAlign: 'center' },
});

export default UserGreeting;

