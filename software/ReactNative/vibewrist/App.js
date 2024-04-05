// In App.js in a new project

// import * as React from "react";
// import { View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "./pages/homeScreenComponents/home";
// import AccountScreen from "./pages/account";
// import BleConnectedScreen from "./pages/bleScreenComponents/bleConnectedScreen";
// import BleDisconnectedScreen from "./pages/bleScreenComponents/bleDisconnectedScreen";

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        {/* <Stack.Screen name="cBle" component={BleConnectedScreen} /> */}
        {/* <Stack.Screen name="dBle" component={BleDisconnectedScreen} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
