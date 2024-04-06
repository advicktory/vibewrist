// In App.js in a new project

// import * as React from "react";
// import { View } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { UserProvider } from './pages/UserContext';

import HomeScreen from './pages/homeScreenComponents/home';
// import AccountScreen from "./pages/account";
// import BleConnectedScreen from "./pages/bleScreenComponents/bleConnectedScreen";
// import BleDisconnectedScreen from "./pages/bleScreenComponents/bleDisconnectedScreen";
import BleDeviceSettingsScreen from './pages/bleScreenComponents/bleBraceletSettingsScreen';
import useConnectToDevice from './pages/bleScreenComponents/bleSettings';
import User from './pages/User';
//import getDistance from "./pages/bleScreenComponents/bleDistance"

// These are meant to get the reference to the device to be accessed anywhere
const user = new User();

function App() {
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <UserProvider user={user}>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} />
          {/* <Stack.Screen name="cBle" component={BleConnectedScreen}>*/}
          {/*<Stack.Screen name="dBle" component={BleDisconnectedScreen} />*/}
          <Stack.Screen name="sBle" component={BleDeviceSettingsScreen} />
        </Stack.Navigator>
      </UserProvider>
    </NavigationContainer>
  );
}

export default App;
