// In App.js in a new project

// import * as React from "react";
// import { View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "./pages/homeScreenComponents/home";
// import AccountScreen from "./pages/account";
// import BleConnectedScreen from "./pages/bleScreenComponents/bleConnectedScreen";
// import BleDisconnectedScreen from "./pages/bleScreenComponents/bleDisconnectedScreen";
<<<<<<< HEAD
import BleDeviceSettingsScreen from "./pages/bleScreenComponents/bleBraceletSettingsScreen";
=======
>>>>>>> d8fd703c8e7ac8fd3113757d1955e83e246336a5

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
<<<<<<< HEAD
        {/* <Stack.Screen name="cBle" component={BleConnectedScreen}>*/}
        {/*<Stack.Screen name="dBle" component={BleDisconnectedScreen} />*/}
        <Stack.Screen name="sBle" component={BleDeviceSettingsScreen} />
=======
        {/* <Stack.Screen name="cBle" component={BleConnectedScreen} /> */}
        {/* <Stack.Screen name="dBle" component={BleDisconnectedScreen} /> */}
>>>>>>> d8fd703c8e7ac8fd3113757d1955e83e246336a5
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
