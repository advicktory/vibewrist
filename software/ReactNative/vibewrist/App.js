// In App.js in a new project

// import * as React from "react";
// import { View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "./pages/home";
import AccountScreen from "./pages/account";
import BLEScreen from "./pages/bleSettings";

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Account" component={AccountScreen} />
        <Stack.Screen name="BLE" component={BLEScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
