import { View, Text, Button, Image } from "react-native";
import cycleLengthSelector from "./homeScreenCycleChooser.js";
import CycleReport from "./homeScreenText.js";

export default function HomeScreen({ navigation }) {
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
          null;
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
