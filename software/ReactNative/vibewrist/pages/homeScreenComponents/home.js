import React, { useEffect, useState } from "react";
import { View, Text, Button, Image } from "react-native";
import cycleLengthSelector from "./homeScreenCycleChooser.js";
import CycleReport from "./homeScreenText.js";
import _BackgroundTimer from "react-native-background-timer";
import User from "../User.js";

export default function HomeScreen({ navigation, route }) {
  // const [timerOn, setTimerOn] = useState(false);

  const { cycleOptions, cycleOptionResponces } = cycleLengthSelector();
  const cycleLengths = {
    sLength: cycleOptionResponces[0],
    bLength: cycleOptionResponces[1],
    cAmount: cycleOptionResponces[2],
    isMinutes: true,
  }; // Information gathered from Cycle Selector to send to Cycle Report
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
    </View>
  );
}
