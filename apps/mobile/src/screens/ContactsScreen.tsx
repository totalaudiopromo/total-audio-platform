import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const ContactsScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Contacts</Text>
        <Text style={styles.subtitle}>Manage your industry contacts</Text>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.comingSoon}>Contacts feature coming soon!</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2538c7',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 4,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  comingSoon: {
    fontSize: 18,
    color: '#6b7280',
    textAlign: 'center',
  },
});

export default ContactsScreen; 