import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Button,
  Image,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Dimensions,
} from 'react-native';
import _BackgroundTimer from 'react-native-background-timer';
import { useUser } from '../UserContext';
import useConnectToDevice from '../bleScreenComponents/bleSettings.js';
import manageStudyTime from '../bleScreenComponents/bleLEDfunct.js';
import getDistance from '../bleScreenComponents/bleDistance.js';
import cycleLengthSelector from './homeScreenCycleChooser.js';
import CycleReport from './homeScreenText.js';
import StartButton from './homeScreenStartButton';
import ProgressBar from './progressBar';
import SavePreset from './savePreset';
import { atob, btoa } from 'react-native-quick-base64';

export default function HomeScreen({ navigation }) {
  const user = useUser();
  const [startDistanceFn, setStartDistanceFn] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State to track if the sidebar/modal is open
  const { deviceRef: deviceCurr, data: dataCharacteristic } =
    useConnectToDevice();
  const { cycleOptions, cycleOptionResponces } = cycleLengthSelector(user);
  const cycleLengths = {
    sLength: cycleOptionResponces[0],
    bLength: cycleOptionResponces[1],
    cAmount: cycleOptionResponces[2],
    isMinutes: true,
  }; // Information gathered from Cycle Selector to send to Cycle Report

  // Provide ability to run a function after a set amount of time
  const executeAfterDelay = async (delay, callback) => {
    await new Promise((resolve) => setTimeout(resolve, delay));
    callback();
  };

  useEffect(() => {
    if (startDistanceFn && deviceCurr.current) {
      getDistance(true, deviceCurr.current, dataCharacteristic, user);
    } else if (deviceCurr.current) {
      getDistance(false, deviceCurr.current, dataCharacteristic, user); // Stop tracking
      executeAfterDelay(10000, () => {
        dataCharacteristic.writeWithResponse(
          btoa(`3,${user.getBreakLength()}`)
        );
      });
    }
  }, [startDistanceFn]);

  useEffect(() => {
    user.setStudyLength(cycleLengths.sLength);
    user.setBreakLength(cycleLengths.bLength);
    user.setCycleAmount(cycleLengths.cAmount);
  }, [cycleLengths.sLength, cycleLengths.bLength, cycleLengths.cAmount]);

  //will change it from whatever state it is to the other allowing a toggle feature
  const toggleSidebar = () => {
    setIsSidebarOpen((prevState) => !prevState);
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <TouchableOpacity onPress={toggleSidebar} style={styles.imageButton}>
          <Image
            source={require('./../../assets/blue_bracelet.png')}
            style={styles.image}
          />
        </TouchableOpacity>
        <View style={styles.cycleContainer}>
          {cycleOptions}
          <CycleReport cycleOrder={cycleLengths} />
          <ProgressBar />
            <Text style={styles.goalText}>Goal for this week: [Your goal here]</Text>
        </View>
        <StartButton
          onPress={() => {
            setStartDistanceFn((currentStartDistanceFn) => {
              // Check if already true, if so, return the same value without changing it
              if (currentStartDistanceFn) {
                return currentStartDistanceFn;
              }
              // Only if it is not already true, set it to true and start the manageStudyTime process
              manageStudyTime(
                dataCharacteristic,
                user.getStudyLength(),
                user.getBreakLength() /*this parameter not used, leaving in case */
              )
                .then(() => {
                  //console.log('manageStudyTime completed');
                  setStartDistanceFn(false); // Stop distance tracking once manageStudyTime is finished
                })
                .catch((error) => {
                  console.error('Error in manageStudyTime:', error);
                  setStartDistanceFn(false); // Optionally stop distance tracking on error as well
                });

              return true;
            });
          }}
        />
        <Modal
          visible={isSidebarOpen}
          animationType="none"
          transparent={true}
          onRequestClose={toggleSidebar}
        >
          <View style={styles.sidebar}>
            <TouchableOpacity onPress={toggleSidebar} style={styles.imageButtonSidebar}>
              <Image
                source={require('./../../assets/blue_bracelet.png')}
                style={styles.imageSidebar}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.sidebarButton}>
              <Text  onPress={() => {navigation.navigate('account', { userObj: user })}} style={styles.sidebarButtonText}>Account</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sidebarButton}>
              <Text onPress={() => {navigation.navigate('sBle', { userObj: user })}} style={styles.sidebarButtonText}>Settings</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    backgroundColor: 'black',
  },
  cycleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    bottom: Dimensions.get('window').height * 0.25, // Adjusted position based on screen height
    position: 'absolute',
  },
  imageButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  image: {
    width: 50,
    height: 50,
  },
  sidebar: {
    backgroundColor: '#1c1b1d',
    width: 80,
    height: '100%',
    position: 'absolute',
    right: 0,
    top: 0,
    paddingTop: 50,
    paddingRight: 10,
    alignItems: 'center',
    // top:40, //this one alligns it on the white part up top
    top:100,
    shadowColor: '#000', //color of shadow
    shadowOffset: {
      width: -3, // horizontal offset
      height: 0, // vertical offset
    },
    shadowOpacity: 0.5, // Opacity of the shadow
    shadowRadius: 5, // Radius of the shadow
    elevation: 5, 
    top: Dimensions.get('window').height * 0.1,

  },
  sidebarButton: {
    marginTop: 10, 
    paddingVertical: 10,
    width: '100%',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#fff', 
    borderTopWidth: 1,
    borderTopColor: '#fff', 
  },
  sidebarButtonText: {
    color: '#fff', 
    fontWeight: 'bold', 
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    color: '#fff',
  },
  imageButtonSidebar: {
    position: 'absolute',
    top: 10,
    left: 10, 
  },
  imageSidebar: {
    width: 50,
    height: 50,
  },
progressContainer: {
  flexDirection: 'row',
  alignItems: 'center',
},
goalText: {
  marginLeft: 10,
  color: '#fff',
  fontSize: 16,
  marginTop:20,
},

});
