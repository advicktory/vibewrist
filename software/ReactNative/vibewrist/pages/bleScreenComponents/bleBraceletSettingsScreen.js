import React, { useState, useEffect } from "react";
import { View, Text, Button, Image } from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import braceletPng from "../../assets/blue_bracelet.png";
import User from "../User";

export default function BleDeviceSettingsScreen({ navigation, route }) {
  const { buzzSensitivityDropdown, buzzSensitivityResponce } =
    buzzSensitivitySelection();
  const { buzzRhythmDropdown, buzzRhythmResponce } = buzzRhythmSelection();
  const { buzzStrengthDropdown, buzzStrengthResponce } =
    buzzFrequencySelection();

  const user = route.params.userObj;

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
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Image source={braceletPng} style={{ width: 100, height: 100 }} />
      <Text>Your device</Text>
      <Text>{user.getDeviceName()}</Text>
      <Text>Distance: </Text>
      {buzzSensitivityDropdown}
      <Text>Buzz Settings:</Text>
      {buzzRhythmDropdown}
      {buzzStrengthDropdown}
      <Button
        title="Save?"
        onPress={() => {
          null;
        }}
      />
      <Button
        title="Go back to HomeScreen"
        onPress={() => {
          navigation.navigate("Home", { userObj: user });
        }}
      />
    </View>
  );
}

function buzzSensitivitySelection() {
  const [buzzSensitivity, setBuzzSensitivity] = useState(0);
  const buzzSensitivityOptions = [
    { key: 1, value: "Low" },
    { key: 2, value: "Something" },
  ];

  return {
    buzzSensitivityDropdown: (
      <>
        <SelectList
          setSelected={(val) => {
            setBuzzSensitivity(val);
          }}
          data={buzzSensitivityOptions}
          search={false}
          placeholder="When do you want your bracelet to buzz?"
          save="key"
        />
      </>
    ),
    buzzSensitivityResponce: buzzSensitivity,
  };
}

function buzzRhythmSelection() {
  const [buzzRhythm, setBuzzRhythm] = useState(0);
  const buzzRhythmOptions = [
    { key: 1, value: "Short Quick Buzz" },
    { key: 2, value: "Three Quick Buzzes" },
    { key: 3, value: "Aggie Special" },
    { key: 4, value: "Five Short Pulses" },
    { key: 5, value: "Three Long Pulses" },
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
          placeholder="How sensitive do you want your bracelet to be?"
          save="key"
        />
      </>
    ),
    buzzRhythmResponce: buzzRhythm,
  };
}

function buzzFrequencySelection() {
  const [buzzStrength, setBuzzStrength] = useState(0);
  const buzzStrengthOptions = [
    { key: 1, value: "Low" },
    { key: 2, value: "Medium Low" },
    { key: 3, value: "Medium High" },
    { key: 4, value: "High" },
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
          placeholder="How hard do you want the bracelet to buzz?"
          save="key"
        />
      </>
    ),
    buzzStrengthResponce: buzzStrength,
  };
}
