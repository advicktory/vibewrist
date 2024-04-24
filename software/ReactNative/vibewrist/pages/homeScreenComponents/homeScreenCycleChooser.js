import { useState, useEffect } from 'react';
import { ScrollView } from 'react-native';
// import { View, Text, Button } from "react-native";
import {
  View,
  Text,
  Button,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useUser } from '../UserContext'; // Import the UserContext hook

import SavePreset from './savePreset';
import { SelectList } from 'react-native-dropdown-select-list';

export default function cycleLengthSelector(user) {
  const [studyLengthSelected, setStudyLengthSelected] = useState([]);
  const [breakLengthSelected, setBreakLengthSelected] = useState([]);
  const [cycleAmountSelected, setCycleAmountSelected] = useState([]);

  const [presetSelected, setPreset] = useState([]);
  const [currPresetKey, setCurrPresetKey] = useState([]);
  const studyOptions = [
    { key: 5, value: 5 },
    { key: 10, value: 10 },
    { key: 15, value: 15 },
    { key: 20, value: 20 },
    { key: 25, value: 25 },
    { key: 30, value: 30 },
    { key: 35, value: 35 },
    { key: 40, value: 40 },
    { key: 45, value: 45 },
    { key: 50, value: 50 },
    { key: 55, value: 55 },
    { key: 60, value: 60 },
  ];
  const breakOptions = [
    { key: 5, value: 5 },
    { key: 10, value: 10 },
    { key: 15, value: 15 },
    { key: 20, value: 20 },
    { key: 25, value: 25 },
    { key: 30, value: 30 },
    { key: 35, value: 35 },
    { key: 40, value: 40 },
    { key: 45, value: 45 },
    { key: 50, value: 50 },
    { key: 55, value: 55 },
    { key: 60, value: 60 },
  ];
  const cycleOptions = [
    { key: 1, value: 1 },
    { key: 2, value: 2 },
    { key: 3, value: 3 },
    { key: 4, value: 4 },
    { key: 5, value: 5 },
    { key: 6, value: 6 },
    { key: 7, value: 7 },
  ];
  const preset = [
    // { key: 0, value: "None" },
    {
      key: 1,
      value: 'Pomodoro Method',
      studyLength: 25,
      breakLength: 5,
      cycleCount: 2,
    },
    // { key: 2, value: 2 },
    // { key: 3, value: 3 },
    // { key: 4, value: 4 },
  ];

  const handleSelectPreset = (key) => {
    setCurrPresetKey(key);
    console.log('Received new preset:', presetSelected[key].studyLength);
    // console.log("Received new presetTTTT:", newPreset[0].studyLength);
    setStudyLengthSelected(presetSelected[key].studyLength.toString());
    setBreakLengthSelected(presetSelected[key].breakLength.toString());
    setCycleAmountSelected(presetSelected[key].cycleAmount.toString());
  };

  // console.log("current KEY: " + currPresetKey);
  // console.log("current Study time: " + studyLengthSelected);
  // console.log("current break time: " + breakLengthSelected);
  // console.log("current cycle time: " + cycleAmountSelected);

  // Function to update preset state
  const handleUpdatePreset = (newPreset) => {
    // console.log("Received new preset:", newPreset);
    setPreset([...presetSelected, newPreset]);
    setStudyLengthSelected(newPreset.studyLength.toString());
    setBreakLengthSelected(newPreset.breakLength.toString());
    setCycleAmountSelected(newPreset.cycleAmount.toString());

    // console.log(newPreset.studyLength.toString())
  };
  // console.log("AHH",studyLengthSelectedPRE)

  return {
    cycleOptions: (
      <>
        <View style={styles.container}>
          <View style={styles.topPortion}>
            <SelectList
              setSelected={(val) => setStudyLengthSelected(val)}
              data={studyOptions}
              search={false}
              placeholder="Study Length"
              save="key"
              inputStyles={styles.inputContainer}
              dropdownTextStyles={styles.dropdownContainer}
              boxStyles={styles.boxContainer}
              dropdownStyles={styles.boxContainer}
            />

            <SelectList
              setSelected={(val) => setBreakLengthSelected(val)}
              data={breakOptions}
              search={false}
              placeholder="Break Length"
              save="key"
              inputStyles={styles.inputContainer}
              dropdownTextStyles={styles.dropdownContainer}
              boxStyles={styles.boxContainer}
              dropdownStyles={styles.boxContainer}
            />
          </View>

          <SelectList
            setSelected={(val) => setCycleAmountSelected(val)}
            data={cycleOptions}
            search={false}
            placeholder="How many Cycles?"
            save="key"
            inputStyles={styles.inputContainer}
            dropdownTextStyles={styles.dropdownContainer}
            boxStyles={styles.boxContainer}
            dropdownStyles={styles.boxContainer}
          />

          <SelectList
            setSelected={(val) => handleSelectPreset(val)}
            data={presetSelected}
            search={false}
            placeholder="Custom"
            save="key"
            inputStyles={styles.inputContainer}
            dropdownTextStyles={styles.dropdownContainer}
            boxStyles={styles.boxContainer}
            dropdownStyles={styles.boxContainer}
          />
        </View>
        <SavePreset
          studyLengthSelected={studyLengthSelected}
          breakLengthSelected={breakLengthSelected}
          cycleAmountSelected={cycleAmountSelected}
          onUpdatePreset={handleUpdatePreset} // Pass the function as prop
          user={user}
        />
      </>
    ),
    cycleOptionResponces: [
      studyLengthSelected,
      breakLengthSelected,
      cycleAmountSelected,
    ],
  };
}
const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // alignItems: "center",
    // justifyContent: "center",
    // position: "relative",
    // backgroundColor: "#0066ff",
    backgroundColor: '#1c1b1d',
    borderRadius: 20,
    padding: 10,
    margin: 20,
    // position: "relative",
    // bottom:90
  },

  topPortion: {
    // flex:1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    // marginBottom: 10,
    // position: "absolute",
  },
  inputContainer: {
    color: 'white',
    fontWeight: 'bold',
    // fontSize: 10,
  },
  dropdownContainer: {
    color: 'white',
    fontWeight: 'bold',
    // fontSize: 10,
  },
  boxContainer: {
    borderColor: 'white',
    margin: 5,
    height: 45,
    maxHeight: 50,
  },
});
