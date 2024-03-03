import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { Autocomplete, TextInput } from 'react-native-paper'; // Import necessary components from react-native-paper
import CycleSelector from "./Components/CycleSelector"
import icon1 from './Components/icon1.png';


const SettingsButton = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Image source={icon1} style={styles.icon} />
    </TouchableOpacity>
  );
};




const HomePage = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Start Your Study Cycle</Text>
      <CycleSelector  /> 
      <SettingsButton  />

      <TouchableOpacity style={styles.startButton} onPress={() => {
        // Handle navigation to study cycle screen
      }}>
        <Text style={styles.startButtonText}>Start Now</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ECEFF1', // Light blue background color
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  startButton: {
    backgroundColor: '#4CAF50', // Green button color
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 20, // Add margin top to separate from CycleSelector
  },
  startButtonText: {
    color: '#FFFFFF', // White button text color
    fontSize: 18,
    fontWeight: 'bold',
  },
  button: {
    position: 'absolute',
    top: 40,
    right: 10,
    padding: 10,
  },
  icon: {
    width: 40,
    height: 40,
  },
});

export default HomePage;
