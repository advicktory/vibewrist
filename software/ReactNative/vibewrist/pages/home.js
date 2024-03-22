import { View, Text, Button } from "react-native";

export default function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Home Screen</Text>
      <Text>Test2</Text>
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
