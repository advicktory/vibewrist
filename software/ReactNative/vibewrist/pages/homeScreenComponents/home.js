import React, { useEffect, useState } from 'react';
import { View, Text, Button, Image } from 'react-native';
import cycleLengthSelector from './homeScreenCycleChooser.js';
import CycleReport from './homeScreenText.js';
import _BackgroundTimer from 'react-native-background-timer';
import User from '../User.js';
import useConnectToDevice from '../bleScreenComponents/bleSettings.js';
import { useUser } from '../UserContext';
import manageStudyTime from '../bleScreenComponents/bleLEDfunct.js';
import getDistance from '../bleScreenComponents/bleDistance.js';

export default function HomeScreen({ navigation, route }) {
  const user = useUser();
  // const { device, connectToDevice } = useConnectToDevice();
  // const [timerOn, setTimerOn] = useState(false);
  const { deviceRef: deviceCurr, data: dataCharacteristic } =
    useConnectToDevice();
  const { cycleOptions, cycleOptionResponces } = cycleLengthSelector();
  const cycleLengths = {
    sLength: cycleOptionResponces[0],
    bLength: cycleOptionResponces[1],
    cAmount: cycleOptionResponces[2],
    isMinutes: true,
  }; // Information gathered from Cycle Selector to send to Cycle Report
  //const user = route.params === undefined ? new User() : route.params?.userObj; // If there is no user object make one, if there already is one use that one. There has got to be a better way to do this.
  //console.log(route.params?.userObj);

  useEffect(() => {
    user.setStudyLength(cycleLengths.sLength);
    user.setBreakLength(cycleLengths.bLength);
    user.setCycleAmount(cycleLengths.cAmount);
  }, [cycleLengths.sLength, cycleLengths.bLength, cycleLengths.cAmount]);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Image
        source={require('./../../assets/blue_bracelet.png')}
        style={{ width: 100, height: 100 }}
      />
      {cycleOptions}
      <CycleReport cycleOrder={cycleLengths} />
      <Button
        title="START"
        onPress={() => {
          {
            console.log('User in statement:', user);
            // Stuff for study cycle
            let studyTime = user.getStudyLength();
            let breakTime = user.getBreakLength();
            //manageStudyTime(dataCharacteristic, studyTime);

            // Stuff for vibration module
            let buzzLength = user.getBuzzDuration();
            let buzzFreq = user.getBuzzFrequency();
            //getDistance(deviceCurr, dataCharacteristic);
          }
        }}
      />

      <Button
        title="Go to Bracelet Settings"
        onPress={() => {
          navigation.navigate('sBle', { userObj: user });
        }}
      />
    </View>
  );
}
