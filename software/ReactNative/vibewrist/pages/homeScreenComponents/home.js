import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import _BackgroundTimer from "react-native-background-timer";
import { useUser } from "../UserContext";
import useConnectToDevice from "../bleScreenComponents/bleSettings.js";
import manageStudyTime from "../bleScreenComponents/bleLEDfunct.js";
import getDistance from "../bleScreenComponents/bleDistance.js";
import cycleLengthSelector from "./homeScreenCycleChooser.js";
import CycleReport from "./homeScreenText.js";
import StartButton from "./homeScreenStartButton";
import ProgressBar from "./progressBar";
import SavePreset from "./savePreset";

export default function HomeScreen({ navigation }) {
  const user = useUser();
  const { deviceRef: deviceCurr, data: dataCharacteristic } =
    useConnectToDevice();

  const { cycleOptions, cycleOptionResponces } = cycleLengthSelector();
  const cycleLengths = {
    sLength: cycleOptionResponces[0],
    bLength: cycleOptionResponces[1],
    cAmount: cycleOptionResponces[2],
    isMinutes: true,
  }; // Information gathered from Cycle Selector to send to Cycle Report

  useEffect(() => {
    user.setStudyLength(cycleLengths.sLength);
    user.setBreakLength(cycleLengths.bLength);
    user.setCycleAmount(cycleLengths.cAmount);
  }, [cycleLengths.sLength, cycleLengths.bLength, cycleLengths.cAmount]);

  const handleImagePress = () => {
    // Your logic for handling image button press
    console.log("Image button pressed");
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.imageButton}>
          <Image
            source={require("./../../assets/blue_bracelet.png")}
            style={styles.image}
          />
        </TouchableOpacity>
        <View style={styles.cycleContainer}>
          {cycleOptions}
          <CycleReport cycleOrder={cycleLengths} />
          <SavePreset />
          <ProgressBar />
        </View>
        <StartButton />
        <Button
          title="Go to Bracelet Settings"
          onPress={() => {
            navigation.navigate("sBle", { userObj: user });
          }}
        />
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
  cycleContainer: {
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
    width: 50,
    height: 50,
  },
});
