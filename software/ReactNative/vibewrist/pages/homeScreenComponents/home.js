import React, { useEffect, useState } from "react";
import { View, Text, Button, Image, TouchableOpacity, StyleSheet } from "react-native";

import cycleLengthSelector from "./homeScreenCycleChooser.js";
import CycleReport from "./homeScreenText.js";
import StartButton from "./homeScreenStartButton"
import ProgressBar from "./progressBar"
import SavePreset from "./savePreset
  
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

