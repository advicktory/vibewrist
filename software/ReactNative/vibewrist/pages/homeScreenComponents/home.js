import React, { useEffect, useState } from "react";
import { View, Text, Button, Image, TouchableOpacity, StyleSheet } from "react-native";

import cycleLengthSelector from "./homeScreenCycleChooser.js";
import CycleReport from "./homeScreenText.js";
import StartButton from "./homeScreenStartButton"
import ProgressBar from "./progressBar"
import SavePreset from "./savePreset"
// import _BackgroundTimer from "react-native-background-timer";

// function onStartPress(isTimerOn) {
//   // This is a function that will on completion will do the following
//   // 0) Send the Bracelet: Which LEDs to light up, Break Length in Mins (Deep sleep timer), Vibration Strength (Dependant on RSSI Value), Vibration Selection (If applicable)
//   // 1) Start: Vibration Pattern to the Bracelet
//   // 2) During (Study Length): Send which LEDs, Vibration Strength. Also, violations will need to be recorded.
//   // 3) End: Turn off all LEDs, Send 'End of Cycle' Pulse, Send Break Length (for deep sleep). Also, the study/break times will need to be recorded.
//   if (isTimerOn) {
//     _BackgroundTimer.runBackgroundTimer(() => {
//       console.log("Howdy!");
//     }, 2000);
//   } else {
//     _BackgroundTimer.stopBackgroundTimer();
//   }
// }

function prepLedIllumniation() {
  // To be completed when Anthony finishes the protocal.
  // Study Time remaining will need to used here.
}

function prepBreakTimer() {
  // To be completed when Anthony finishes the protocal.
  //
}

function prepVibStrength() {
  // To be completed when Anthony finishes the protocal.
  // RSSI value will need to accessed here freqently.
}

function prepVibSelection() {
  // To be completed when Anthony finishes the protocal.
}

function onViolation() {
  // However we end up recording violations will need to be recorded here
}

export default function HomeScreen({ navigation }) {
  const [timerOn, setTimerOn] = useState(false);

  const { cycleOptions, cycleOptionResponces } = cycleLengthSelector();
  const cycleLengths = {
    sLength: cycleOptionResponces[0],
    bLength: cycleOptionResponces[1],
    cAmount: cycleOptionResponces[2],
    isMinutes: true,
  }; // Information gathered from Cycle Selector to send to Cycle Report
  
  const handleImagePress = () => {
    // Your logic for handling image button press
    console.log("Image button pressed");
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleImagePress} style={styles.imageButton}>
          <Image
            source={require("./../../assets/blue_bracelet.png")}
            style={styles.image}
          />
        </TouchableOpacity>
        <View style={styles.cycleContainer}>
          {cycleOptions}
          <CycleReport cycleOrder={cycleLengths} />
          {/* <SavePreset/> */}
          <ProgressBar/>
        </View>
        <StartButton/>
        {/* <Button
          title="Start?"
          onPress={() => {
            setTimerOn((timerOn) => !timerOn);
            console.log(timerOn);
            // Commenting out for now as onStartPress is commented out
            // onStartPress(timerOn);
          }}
        /> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    backgroundColor: "black",
  },
  cycleContainer:{
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    bottom: 210,
    position: "absolute",
    

  },

  imageButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  image: {
    width:50,
    height: 50,
  },
});

