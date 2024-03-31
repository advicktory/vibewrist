import React, { useState, useEffect } from "react";
import { View, Text, Button, Image } from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import braceletPng from "../../assets/blue_bracelet.png";

export default function BleDeviceSettingsScreen() {
  const { buzzRhythmDropdown, buzzRhythmResponce } = buzzRhythmSelection();
  const { buzzStrengthDropdown, buzzStrengthResponce } =
    buzzFrequencySelection();
  const { buzzSensitivityDropdown, buzzSensitivityRespocnce } =
    buzzSensitivitySelection();

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Image source={braceletPng} style={{ width: 100, height: 100 }} />
      <Text>Your device</Text>
      <Text>"device Name here"</Text>
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
    </View>
  );
}

function buzzSensitivitySelection() {
  const [buzzSensitivity, setBuzzSensitivity] = useState([]);
  const buzzSensitivityOptions = [{ key: 1, value: "Low" }];

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
  const [buzzRhythm, setBuzzRhythm] = useState([]);
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
  const [buzzStrength, setBuzzStrength] = useState([]);
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
