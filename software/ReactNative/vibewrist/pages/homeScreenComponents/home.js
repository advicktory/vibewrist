import React, { useState, useEffect, useCallback } from 'react';
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
import { useFocusEffect } from '@react-navigation/native';
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
import GoalTimeModal from './goalTime'; // Import the GoalTimeModal component
import { ScrollView } from 'react-native';
import redLogo from './../../assets/red_bracelet.png';
import blueLogo from './../../assets/blue_bracelet.png';

export default function HomeScreen({ navigation }) {
  const user = useUser();
  const [startDistanceFn, setStartDistanceFn] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State to track if the sidebar/modal is open
  const [connectedBraceletLogo, setConnectedBraceletLogo] = useState(redLogo);
  const {
    connectionStatus: isConnected,
    deviceRef: deviceCurr,
    data: dataCharacteristic,
  } = useConnectToDevice();
  const { cycleOptions, cycleOptionResponces } = cycleLengthSelector(user);
  const cycleLengths = {
    sLength: cycleOptionResponces[0],
    bLength: cycleOptionResponces[1],
    cAmount: cycleOptionResponces[2],
    isMinutes: true,
  }; // Information gathered from Cycle Selector to send to Cycle Report

  const [isPaused, setIsPaused] = useState(false);
  const [goalTime, setGoalTime] = useState(user.getUserGoalTime()); // State to store the selected goal time
  const [timeStudied, setTimeStudied] = useState(user.getUserCurrTime());

  useEffect(() => {
    fetch(
      `http://10.229.10.189:3000/pullUserStats?username=${encodeURIComponent(
        user.getUserName()
      )}`
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setGoalTime(Number(data.currentGoal) || 1); // Ensure it's numeric and avoid division by zero
        setTimeStudied(Number(data.timeStudied) || 1); // Ensure it's numeric\
        user.setUserGoalTime(data.currentGoal);
        user.setUserCurrTime(data.timeStudied);
        user.setViolations(data.violations);
        //console.log('Goal time: ', goalTime);
        console.log('user in progressBar: ', user);
      })
      .catch((error) => console.error('Failed to fetch user goals:', error));
  }, [user]);

  // Gets the users settings beofre settings is launched so that appropriate thinkg loads.
  const fetchUserSettings = async (username) => {
    try {
      const response = await fetch(
        `http://10.229.10.189:3000/getUserSettings?username=${encodeURIComponent(
          username
        )}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch user settings');
      }
      const data = await response.json();

      user.setBuzzRange(data.bRange);
      user.setBuzzDuration(data.bDur);
      user.setBuzzFrequency(data.bFreq);
    } catch (error) {
      console.error('Error fetching user settings:', error);
    }
  };

  // Runs bleSettings pull whenever on home page.
  useFocusEffect(
    useCallback(() => {
      fetchUserSettings(user.getUserName());
    }, [user])
  );

  // Provide ability to run a function after a set amount of time
  const executeAfterDelay = async (delay, callback) => {
    await new Promise((resolve) => setTimeout(resolve, delay));
    callback();
  };

  // For when a cycle has started, start tracking distance
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

  // Set users study, break, and cycle lengths
  useEffect(() => {
    user.setStudyLength(cycleLengths.sLength);
    user.setBreakLength(cycleLengths.bLength);
    user.setCycleAmount(cycleLengths.cAmount);
  }, [cycleLengths.sLength, cycleLengths.bLength, cycleLengths.cAmount]);

  useEffect(() => {
    if (isConnected !== 'Connected') {
      setConnectedBraceletLogo(redLogo);
    } else if (isConnected === 'Connected') {
      setConnectedBraceletLogo(blueLogo);
    }
  }, [isConnected]);

  //will change it from whatever state it is to the other allowing a toggle feature
  const toggleSidebar = () => {
    setIsSidebarOpen((prevState) => !prevState);
  };
  const [isGoalModalVisible, setIsGoalModalVisible] = useState(false); // State to track the visibility of the goal time modal

  const toggleGoalModal = () => {
    setIsGoalModalVisible((prev) => !prev); // Toggle the visibility of the goal time modal
  };

  const handleSaveGoalTime = (selectedTime) => {
    setGoalTime(selectedTime); // Save the selected goal time
  };

  // Function to send session data to db
  const addStudySession = async (sessionData) => {
    try {
      const response = await fetch(
        'http://10.229.10.189:3000/addStudySession',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(sessionData),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to send study session data');
      }

      const responseData = await response.json();
      console.log('Study session added:', responseData);
    } catch (error) {
      console.error('Error adding study session:', error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <TouchableOpacity onPress={toggleSidebar} style={styles.imageButton}>
          <Image source={connectedBraceletLogo} style={styles.image} />
        </TouchableOpacity>

        <View style={styles.cycleContainer}>
          {cycleOptions}
          <CycleReport cycleOrder={cycleLengths} />
          <ProgressBar progress={user} />
          <Text style={styles.goalText}>
            Goal for this week:{' '}
            <Text onPress={toggleGoalModal}>
              {goalTime || user.getUserGoalTime()}
            </Text>
          </Text>
        </View>

        <StartButton
          onPress={() => {
            console.log(user);
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
                  const sessionData = {
                    username: user.getUserName(),
                    duration: user.getStudyLength(),
                    violations: user.getViolations(),
                    date: new Date().toISOString(),
                  };
                  setIsPaused(false);
                  console.log('Session data:', sessionData);
                  addStudySession(sessionData);
                })
                .catch((error) => {
                  console.error('Error in manageStudyTime:', error);
                  setStartDistanceFn(false); // Optionally stop distance tracking on error as well
                });

              return true;
            });
          }}
          isPaused={isPaused}
          setIsPaused={setIsPaused}
        />
        {/* Render the GoalTimeModal component */}
        <GoalTimeModal
          isVisible={isGoalModalVisible}
          onClose={toggleGoalModal}
          onSave={handleSaveGoalTime}
        />
        <Modal
          visible={isSidebarOpen}
          animationType="none"
          transparent={true}
          onRequestClose={toggleSidebar}
        >
          <View style={styles.sidebar}>
            <TouchableOpacity
              onPress={toggleSidebar}
              style={styles.imageButtonSidebar}
            >
              <Image
                // source={require('./../../assets/blue_bracelet.png')}
                source={connectedBraceletLogo}
                style={styles.imageSidebar}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.sidebarButton}>
              <Text
                onPress={() => {
                  navigation.navigate('Account', { userObj: user });
                  setIsSidebarOpen(false);
                }}
                style={styles.sidebarButtonText}
              >
                Account
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sidebarButton}>
              <Text
                onPress={() => {
                  navigation.navigate('Settings', { userObj: user });
                  setIsSidebarOpen(false);
                }}
                style={styles.sidebarButtonText}
              >
                Settings
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sidebarButton}>
              <Text
                onPress={() => {
                  navigation.navigate('Leader', { userObj: user });
                  setIsSidebarOpen(false);
                }}
                style={styles.sidebarButtonText}
              >
                Leaderboard
              </Text>
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
    top: 100,
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
    marginTop: 20,
  },
});
