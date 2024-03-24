import { View, Text, Button } from "react-native";
import CycleReport from "./homeScreenText.js";

export default function HomeScreen({ navigation }) {
  const cycleLengths = {
    sLength: 13,
    bLength: 15,
    cAmount: 17,
  };

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Home Screen</Text>
      <CycleReport cycleOrder={cycleLengths} isMinutes={true} />
      <Button
        title="Go to Account"
        onPress={() => {
          navigation.navigate("Account");
        }}
      />

      <Button
        title="Go to BLE Settings"
        onPress={() => {
          navigation.navigate("BLE");
        }}
      />
    </View>
  );
}
