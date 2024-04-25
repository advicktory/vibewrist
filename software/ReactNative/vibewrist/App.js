//Imports
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// User Shit
import { UserProvider } from './pages/UserContext';
import User from './pages/User';

//Screens
import HomeScreen from "./pages/homeScreenComponents/home";
import BleDeviceSettingsScreen from "./pages/bleScreenComponents/bleBraceletSettingsScreen";
import Login from "./pages/loginScreen/login.js"
import Account from "./pages/accountScreen/account.js"
import SignUp from "./pages/loginScreen/signup"
import Leader from "./pages/leaderboardScreen/leaderboardScreen"

// These are meant to get the reference to the device to be accessed anywhere
const user = new User();

function App() {
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <UserProvider user={user}>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Home" component={HomeScreen} />
          {/* <Stack.Screen name="cBle" component={BleConnectedScreen}>*/}
          {/*<Stack.Screen name="dBle" component={BleDisconnectedScreen} />*/}
          <Stack.Screen name="Settings" component={BleDeviceSettingsScreen} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Account" component={Account} />
          <Stack.Screen name="Signup" component={SignUp}/>
          <Stack.Screen name="Leader" component={Leader}/>

        </Stack.Navigator>
      </UserProvider>
    </NavigationContainer>
  );
}

export default App;
