import { useState, useEffect, useRef } from 'react';
import { atob, btoa } from 'react-native-quick-base64';
import User from '../User';
import { recordViolation } from './bleViolation';

export default function getDistance({ device, user }) {
  const [distance, setDistance] = useState(null);

  useEffect(() => {
    // Assuming 'device' is available in this context, otherwise, it should be passed as a dependency
    const distanceMeasured = async (device) => {
      const readRSSIInterval = setInterval(async () => {
        try {
          const rssiResponse = await device.readRSSI();
          let distanceVal = rssiResponse.rssi; // Convert RSSI to distance if necessary
          console.log('RSSI: ', rssiResponse.rssi);
          setDistance(distanceVal);
          recordViolation(distance, user.getBuzzRange()); // added need to fix
        } catch (error) {
          console.error('Error reading RSSI:', error);
        }
      }, 500); // Interval set to 500 milliseconds

      return () => clearInterval(readRSSIInterval);
    };

    if (device) {
      distanceMeasured(device);
    }

    // Cleanup function to clear the interval when the component unmounts or distance changes
    return () => {
      if (device) {
        console.log('Clearing interval for device', device.id);
      }
    };
  }, [device, distance]); // Dependencies array, re-run effect if 'device' or 'distance' changes

  const sendDistanceParams = () => {
    if (user.getBuzzRange == 1) {
      recordViolation(true, distance, -47, -60); // true is going have to be the start parameter
    } else if ((user.getBuzzRange = 2)) {
      recordViolation(true, distance, -31, -46); // true is going have to be the start parameter
    } else if ((user.getBuzzRange = 3)) {
      recordViolation(true, distance, -15, -30); // true is going have to be the start parameter
    }
  };
}
