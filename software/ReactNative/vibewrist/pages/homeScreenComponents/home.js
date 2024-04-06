import React, { useEffect, useState } from "react";
import { View, Text, Button, Image, TouchableOpacity, StyleSheet } from "react-native";

import cycleLengthSelector from "./homeScreenCycleChooser.js";
import CycleReport from "./homeScreenText.js";
<<<<<<< HEAD
import _BackgroundTimer from "react-native-background-timer";
import User from "../User.js";

export default function HomeScreen({ navigation, route }) {
  // const [timerOn, setTimerOn] = useState(false);
=======
import StartButton from "./homeScreenStartButton"
import ProgressBar from "./progressBar"
import SavePreset from "./savePreset
  
export default function HomeScreen({ navigation }) {
  const [timerOn, setTimerOn] = useState(false);
>>>>>>> d8fd703c8e7ac8fd3113757d1955e83e246336a5

  const { cycleOptions, cycleOptionResponces } = cycleLengthSelector();
  const cycleLengths = {
    sLength: cycleOptionResponces[0],
    bLength: cycleOptionResponces[1],
    cAmount: cycleOptionResponces[2],
    isMinutes: true,
  }; // Information gathered from Cycle Selector to send to Cycle Report
<<<<<<< HEAD
  const user = route.params === undefined ? new User() : route.params?.userObj; // If there is no user object make one, if there already is one use that one. There has got to be a better way to do this.
  console.log(route.params?.userObj);

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
          null;
        }}
      />

      <Button
        title="Go to Bracelet Settings"
        onPress={() => {
          navigation.navigate("sBle", { userObj: user });
        }}
      />
=======
  
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
>>>>>>> d8fd703c8e7ac8fd3113757d1955e83e246336a5
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

