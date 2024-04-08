import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { SelectList } from 'react-native-dropdown-select-list';
import braceletPng from '../../assets/blue_bracelet.png';

export default function BleDeviceSettingsScreen({ navigation, route }) {
  const [buzzSensitivity, setBuzzSensitivity] = useState('Default');
  const [buzzRhythm, setBuzzRhythm] = useState('Short Quick Buzz');
  const [buzzStrength, setBuzzStrength] = useState('Low');

  const buzzSensitivityOptions = [
    { key: 1, value: 'Default' },
    { key: 2, value: 'Close' },
    { key: 3, value: 'Very Close' },
  ];

  const buzzRhythmOptions = [
    { key: '1', value: 'Short Quick Buzz' },
    { key: '2', value: 'Three Quick Buzzes' },
    { key: '3', value: 'Aggie Special' },
    { key: '4', value: 'Five Short Pulses' },
    { key: '5', value: 'Three Long Pulses' },
  ];

  const buzzStrengthOptions = [
    { key: '1', value: 'Low' },
    { key: '2', value: 'Medium Low' },
    { key: '3', value: 'Medium High' },
    { key: '4', value: 'High' },
  ];

  const handleSave = () => {
    // Handle saving here
    navigation.navigate('Home', { /* pass necessary data */ });
  };

  return (
    <View style={styles.container}>
      <Image source={braceletPng} style={styles.image} />
      <Text style={styles.title}>Your Device</Text>
      <Text style={styles.subtitle}>VibeWrist</Text>
      <View style={styles.settings}>
        <View style={styles.setting}>
          <Text style={styles.settingLabel}>Set range of detection:</Text>
          <View style={styles.selectorContainer}>
            <SelectList
              setSelected={setBuzzSensitivity}
              data={buzzSensitivityOptions}
              search={false}
              placeholder={buzzSensitivity}
              save="value"
              inputStyles={styles.inputContainer}
              dropdownTextStyles={styles.dropdownContainer}
              boxStyles={styles.boxContainer}
              dropdownStyles={styles.boxContainer}
            />
          </View>
        </View>
        <View style={styles.setting}>
          <Text style={styles.settingLabel}>Set vibration rhythm:</Text>
          <View style={styles.selectorContainer}>
            <SelectList
              setSelected={setBuzzRhythm}
              data={buzzRhythmOptions}
              search={false}
              placeholder={buzzRhythm}
              save="value"
              inputStyles={styles.inputContainer}
              dropdownTextStyles={styles.dropdownContainer}
              boxStyles={styles.boxContainer}
              dropdownStyles={styles.boxContainer}
            />
          </View>
        </View>
        <View style={styles.setting}>
          <Text style={styles.settingLabel}>Set vibration strength:</Text>
          <View style={styles.selectorContainer}>
            <SelectList
              setSelected={setBuzzStrength}
              data={buzzStrengthOptions}
              search={false}
              placeholder={buzzStrength}
              save="value"
              inputStyles={styles.inputContainer}
              dropdownTextStyles={styles.dropdownContainer}
              boxStyles={styles.boxContainer}
              dropdownStyles={styles.boxContainer}
            />
          </View>
        </View>
      </View>
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000000",
  },
  title: {
    color: "white",
    fontSize: 24,
    marginVertical: 10,
  },
  subtitle: {
    color: "white",
    fontSize: 18,
    marginBottom: 20,
  },
  setting: {
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  settings: {
    width: "100%",
  },
  settingLabel: {
    color: "white",
    fontWeight: "bold",
    marginBottom: 5,
  },
  inputContainer: {
    color: "white",
    fontWeight: "bold",
  },
  dropdownContainer: {
    color: "white",
    fontWeight: "bold",
  },
  boxContainer: {
    borderColor: "white",
    margin: 5,
    backgroundColor:"#1c1b1d",
  },
  image: {
    width: 100,
    height: 100,
  },
  selectorContainer: {
    width: "90%",
  },
  saveButton: {
    backgroundColor: "#3d85c6",
    // backgroundColor: "#0066ff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
  },
  saveButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginHorizontal:40,
  },
});
