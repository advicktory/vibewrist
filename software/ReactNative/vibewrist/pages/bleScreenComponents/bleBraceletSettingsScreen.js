import React, { useState, useEffect } from 'react';
import { View, Text, Button, Image } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';
import braceletPng from '../../assets/blue_bracelet.png';
import User from '../User';
import { useUser } from '../UserContext';

export default function BleDeviceSettingsScreen({ navigation, route }) {
  const user = useUser();

  // gets the RANGE wanting to be set
  const { buzzSensitivityDropdown, buzzSensitivityResponce } =
    buzzSensitivitySelection(user.getBuzzRange());
  const { buzzRhythmDropdown, buzzRhythmResponce } = buzzRhythmSelection(
    user.getBuzzDuration()
  );
  const { buzzStrengthDropdown, buzzStrengthResponce } = buzzFrequencySelection(
    user.getBuzzFrequency()
  );

  useEffect(() => {
    user.setBuzzRange(buzzSensitivityResponce);
    user.setBuzzDuration(buzzRhythmResponce);
    user.setBuzzFrequency(buzzStrengthResponce);
    // console.log(
    //   `Range: ${user.getBuzzRange()} Duration: ${user.getBuzzDuration()} Frequency: ${user.getBuzzFrequency()} `,
    // );
  }, [buzzRhythmResponce, buzzStrengthResponce, buzzSensitivityResponce]); // Saves the responces to the user obj. No need to save. Just need to save the obj on app close.

  // console.log(route);
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Image source={braceletPng} style={{ width: 100, height: 100 }} />
      <Text>Your Device</Text>
      <Text>VibeWrist</Text>
      <Text>Set range of detection: </Text>
      {buzzSensitivityDropdown}
      <Text>Set vibration rhythm:</Text>
      {buzzRhythmDropdown}
      <Text>Set vibration strength:</Text>
      {buzzStrengthDropdown}
      <Button
        title="Save"
        onPress={() => {
          navigation.navigate('Home', { userObj: user });
        }}
      />
    </View>
  );
}

function buzzSensitivitySelection(currentValue) {
  // in user, refers to bRange
  const [buzzSensitivity, setBuzzSensitivity] = useState(currentValue);
  const buzzSensitivityOptions = [
    { key: 1, value: 'Default' },
    { key: 2, value: 'Close' },
    { key: 3, value: 'Very Close' },
  ];

  return {
    buzzSensitivityDropdown: (
      <>
        <SelectList
          setSelected={setBuzzSensitivity}
          data={buzzSensitivityOptions}
          search={false}
          placeholder={getValueByKey(currentValue, buzzSensitivityOptions)}
          save="key"
        />
      </>
    ),
    buzzSensitivityResponce: buzzSensitivity,
  };
}

function buzzRhythmSelection(currentValue) {
  // in user, refers to bDur
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
      <>
        <SelectList
          setSelected={(val) => {
            setBuzzRhythm(val);
          }}
          data={buzzRhythmOptions}
          search={false}
          placeholder={getValueByKey(currentValue, buzzRhythmOptions)}
          save="key"
        />
      </>
    ),
    buzzRhythmResponce: buzzRhythm,
  };
}

function buzzFrequencySelection(currentValue) {
  // in user, refers to bFreq
  const [buzzStrength, setBuzzStrength] = useState(currentValue);
  const buzzStrengthOptions = [
    { key: '1', value: 'Low' },
    { key: '2', value: 'Medium Low' },
    { key: '3', value: 'Medium High' },
    { key: '4', value: 'High' },
  ];

  return {
    buzzStrengthDropdown: (
      <>
        <SelectList
          setSelected={(val) => {
            setBuzzStrength(val);
          }}
          data={buzzStrengthOptions}
          search={false}
          placeholder={getValueByKey(currentValue, buzzStrengthOptions)}
          save="key"
        />
      </>
    ),
    buzzStrengthResponce: buzzStrength,
  };
}

function getValueByKey(key, options) {
  const option = options.find((o) => o.key === key);
  return option ? option.value : null;
}
