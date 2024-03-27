import React, { useEffect, useState } from "react";
import { View, Text, Button, Image } from "react-native";
import cycleLengthSelector from "./homeScreenCycleChooser.js";
import CycleReport from "./homeScreenText.js";
import _BackgroundTimer from "react-native-background-timer";

function onStartPress(isTimerOn) {
  // This is a function that will on completion will do the following
  // 0) Send the Bracelet: Which LEDs to light up, Break Length in Mins (Deep sleep timer), Vibration Strength (Dependant on RSSI Value), Vibration Selection (If applicable)
  // 1) Start: Vibration Pattern to the Bracelet
  // 2) During (Study Length): Send which LEDs, Vibration Strength. Also, violations will need to be recorded.
  // 3) End: Turn off all LEDs, Send 'End of Cycle' Pulse, Send Break Length (for deep sleep). Also, the study/break times will need to be recorded.
  if (isTimerOn) {
    _BackgroundTimer.runBackgroundTimer(() => {
      console.log("Howdy!");
    }, 2000);
  } else {
    _BackgroundTimer.stopBackgroundTimer();
  }
}

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
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Image
        source={require("./../../assets/blue_bracelet.png")}
        style={{ width: 100, height: 100 }}
      />
      {cycleOptions}
      <CycleReport cycleOrder={cycleLengths} />
      <Button
        title="Start?"
        onPress={() => {
          setTimerOn((timerOn) => !timerOn);
          console.log(timerOn);
          onStartPress(timerOn);
        }}
      />

      <Button
        title="Go to Account"
        onPress={() => {
          navigation.navigate("Account");
        }}
      />

      <Button
        title="Go to Connected BLE Settings"
        onPress={() => {
          navigation.navigate("cBle");
        }}
      />

      <Button
        title="Go to Disconnected BLE Settings"
        onPress={() => {
          navigation.navigate("dBle");
        }}
      />
    </View>
  );
}
