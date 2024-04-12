// import { useState, useEffect, useRef } from 'react';
import { atob, btoa } from "react-native-quick-base64";
import User from "../User";
import { recordViolation } from "./bleViolation";
import { useUser } from "../UserContext";

export default function getDistance({ device, dataCharacteristic }) {
  const [distance, setDistance] = useState(null);
  const [start, setStartState] = useState(null);
  const user = useUser();

  useEffect(() => {
    // Assuming 'device' is available in this context, otherwise, it should be passed as a dependency
    const distanceMeasured = async (device) => {
      const readRSSIInterval = setInterval(async () => {
        try {
          const rssiResponse = await device.readRSSI();
          let distanceVal = rssiResponse.rssi; // Convert RSSI to distance if necessary
          console.log("RSSI: ", rssiResponse.rssi);
          setDistance(distanceVal);
          recordViolation(distance, user.getBuzzRange()); // added need to fix
        } catch (error) {
          console.error("Error reading RSSI:", error);
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
        console.log("Clearing interval for device", device.id);
      }
    };
  }, [device, distance]); // Dependencies array, re-run effect if 'device' or 'distance' changes

  useEffect(() => {
    const onViolation = (hasViolation) => {
      if (hasViolation) {
        // Send command to ESP device to buzz
        try {
          const str = `2,${user.getBuzzDuration()},${user.getBuzzFrequency()},1`;
          const vibrationToSend = btoa(str);
          dataCharacteristic.writeWithResponse(vibrationToSend);
          console.log("Violation detected, sending command to ESP to buzz");
          // Code to send command to ESP
        } catch (e) {
          console.log(e);
        }
      } else {
        dataCharacteristic.writeWithResponse(
          `2,${user.getBuzzDuration()},${user.getBuzzFrequency()},0`,
        );
      }
    };

    const sendDistanceParams = (start) => {
      if (user.getBuzzRange() == 1) {
        recordViolation(start, distance, -47, -60, onViolation);
      } else if (user.getBuzzRange() == 2) {
        recordViolation(start, distance, -31, -46, onViolation);
      } else if (user.getBuzzRange() == 3) {
        recordViolation(start, distance, -15, -30, onViolation);
      }
    };

    // Call sendDistanceParams based on the value of `start`
    sendDistanceParams(start);
  }, [start, distance, user]); // Ensure `distance` and `user` are also in the dependency array
}
