import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SelectList } from 'react-native-dropdown-select-list';
import braceletPng from '../../assets/blue_bracelet.png';
import { useUser } from '../UserContext';
import axios from 'axios'; // Import axios for HTTP requests

export default function BleDeviceSettingsScreen({ navigation }) {
  const user = useUser();
  const { buzzSensitivityDropdown, buzzSensitivityResponse } =
    buzzSensitivitySelection(user.getBuzzRange());
  const { buzzRhythmDropdown, buzzRhythmResponse } = buzzRhythmSelection(
    user.getBuzzDuration()
  );
  const { buzzStrengthDropdown, buzzStrengthResponse } = buzzFrequencySelection(
    user.getBuzzFrequency()
  );

  const fetchUserSettings = async (username) => {
    try {
      const response = await fetch(
        `http://localhost:3000/getUserSettings?username=${encodeURIComponent(
          username
        )}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch user settings');
      }
      const data = await response.json();

      user.setBuzzRange(data.bRange);
      user.setBuzzDuration(data.bDur);
      user.setBuzzFrequency(data.bFreq);
      console.log('User right now: ', user);
    } catch (error) {
      console.error('Error fetching user settings:', error);
    }
  };

  useEffect(() => {
    user.setBuzzRange(buzzSensitivityResponse);
    user.setBuzzDuration(buzzRhythmResponse);
    user.setBuzzFrequency(buzzStrengthResponse);
  }, [buzzSensitivityResponse, buzzRhythmResponse, buzzStrengthResponse]);

  useFocusEffect(
    useCallback(() => {
      fetchUserSettings(user.getUserName()); // Adjust as needed
    }, [user.getUserName()])
  );

  function buzzSensitivitySelection(currentValue) {
    const [buzzSensitivity, setBuzzSensitivity] = useState(currentValue);
    const buzzSensitivityOptions = [
      { key: 1, value: 'Far' },
      { key: 2, value: 'Close' },
      { key: 3, value: 'Very Close' },
    ];

    return {
      buzzSensitivityDropdown: (
        <SelectList
          setSelected={setBuzzSensitivity}
          data={buzzSensitivityOptions}
          search={false}
          placeholder={getValueByKey(
            user.getBuzzRange(),
            buzzSensitivityOptions
          )}
          save="key"
          inputStyles={styles.inputContainer}
          dropdownTextStyles={styles.dropdownContainer}
          boxStyles={styles.boxContainer}
          dropdownStyles={styles.boxContainer}
        />
      ),
      buzzSensitivityResponse: buzzSensitivity,
    };
  }

  function buzzRhythmSelection(currentValue) {
    const [buzzRhythm, setBuzzRhythm] = useState(currentValue);
    const buzzRhythmOptions = [
      { key: '1', value: 'Short Quick Buzz' },
      { key: '2', value: 'Three Quick Buzzes' },
      { key: '3', value: 'Aggie Special' },
      { key: '4', value: 'Five Short Pulses' },
      { key: '5', value: 'Three Long Pulses' },
    ];

    return {
      buzzRhythmDropdown: (
        <SelectList
          setSelected={setBuzzRhythm}
          data={buzzRhythmOptions}
          search={false}
          placeholder={getValueByKey(currentValue, buzzRhythmOptions)}
          save="key"
          inputStyles={styles.inputContainer}
          dropdownTextStyles={styles.dropdownContainer}
          boxStyles={styles.boxContainer}
          dropdownStyles={styles.boxContainer}
        />
      ),
      buzzRhythmResponse: buzzRhythm,
    };
  }

  function buzzFrequencySelection(currentValue) {
    const [buzzStrength, setBuzzStrength] = useState(currentValue);
    const buzzStrengthOptions = [
      { key: '1', value: 'Low' },
      { key: '2', value: 'Medium Low' },
      { key: '3', value: 'Medium High' },
      { key: '4', value: 'High' },
    ];

    return {
      buzzStrengthDropdown: (
        <SelectList
          setSelected={setBuzzStrength}
          data={buzzStrengthOptions}
          search={false}
          placeholder={getValueByKey(currentValue, buzzStrengthOptions)}
          save="key"
          inputStyles={styles.inputContainer}
          dropdownTextStyles={styles.dropdownContainer}
          boxStyles={styles.boxContainer}
          dropdownStyles={styles.boxContainer}
        />
      ),
      buzzStrengthResponse: buzzStrength,
    };
  }

  const handleSave = async () => {
    const userDetails = {
      username: user.getUserName(), // This should be dynamically set
      detectionRange: user.getBuzzRange(),
      vibrationRhythm: user.getBuzzDuration(),
      vibrationStrength: user.getBuzzFrequency(),
    };

    try {
      const response = await fetch('http://localhost:3000/saveBleSetting', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userDetails),
      });

      if (response.ok) {
        navigation.navigate('Home');
      } else if (!response.ok) {
        const errorText = await response.text();
        console.log('Server responded with an error:', errorText);
        throw new Error('Failed to save user settings: ' + errorText);
      }
      console.log('User settings updated successfully:', await response.text());
    } catch (error) {
      console.error('Error saving user settings:', error);
    }
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
            {buzzSensitivityDropdown}
          </View>
        </View>
        <View style={styles.setting}>
          <Text style={styles.settingLabel}>Set vibration rhythm:</Text>
          <View style={styles.selectorContainer}>{buzzRhythmDropdown}</View>
        </View>
        <View style={styles.setting}>
          <Text style={styles.settingLabel}>Set vibration strength:</Text>
          <View style={styles.selectorContainer}>{buzzStrengthDropdown}</View>
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
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
  },
  title: {
    color: 'white',
    fontSize: 24,
    marginVertical: 10,
  },
  subtitle: {
    color: 'white',
    fontSize: 18,
    marginBottom: 20,
  },
  setting: {
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  settings: {
    width: '100%',
  },
  settingLabel: {
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  inputContainer: {
    color: 'white',
    fontWeight: 'bold',
  },
  dropdownContainer: {
    color: 'white',
    fontWeight: 'bold',
  },
  boxContainer: {
    borderColor: 'white',
    margin: 5,
    backgroundColor: '#1c1b1d',
  },
  image: {
    width: 100,
    height: 100,
  },
  selectorContainer: {
    width: '90%',
  },
  saveButton: {
    backgroundColor: '#3d85c6',
    // backgroundColor: "#0066ff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 40,
  },
});

function getValueByKey(key, options) {
  const option = options.find((o) => o.key === key);
  return option ? option.value : null;
}
