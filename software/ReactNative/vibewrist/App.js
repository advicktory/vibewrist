//Imports
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// User Shit
// import { UserProvider } from "./pages/UserContext";
// import User from "./pages/User";

//Screens
import HomeScreen from "./pages/homeScreenComponents/home";
import BleDeviceSettingsScreen from "./pages/bleScreenComponents/bleBraceletSettingsScreen";

// These are meant to get the reference to the device to be accessed anywhere
// const user = new User();

function App() {
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} />
          {/* <Stack.Screen name="cBle" component={BleConnectedScreen}>*/}
          {/*<Stack.Screen name="dBle" component={BleDisconnectedScreen} />*/}
          <Stack.Screen name="sBle" component={BleDeviceSettingsScreen} />
        </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
