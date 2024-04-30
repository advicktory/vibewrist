import { useState, useEffect, useRef } from "react";
import { atob, btoa } from "react-native-quick-base64";
import { BleManager } from "react-native-ble-plx";
import User from "../User";
import { getViolations, recordViolation } from "./bleViolation"; // Ensure this is correctly imported
import { useUser } from "../UserContext";

let readRSSIInterval = null;
/**
 * Determines the distance between the Bracelet and the Mobile Device.
 * @function getDistance
 * @param {boolean} isStarted Used to start the recording of violations.
 * @param {*} device
 * @param {*} dataCharacteristic
 * @param {User} user
 * @returns {stopReading} - A function to manually stop reading of RSSI Values.
 * */
function getDistance(isStarted, device, dataCharacteristic, user) {
  const startReading = () => {
    if (!device) {
      console.log("No device provided");
      return;
    }

    /**
     * Determines the range allowed and whether or not a violation has occured.
     * @function setInterval
     * @param {function} - takes in an async function and determines the RSSI value from the device.
     * @returns {None} - Updates the users records
     * @inner
     * */
    readRSSIInterval = setInterval(async () => {
      try {
        const rssiResponse = await device.readRSSI();
        let distanceVal = rssiResponse.rssi;
        console.log("RSSI: ", rssiResponse.rssi);

        // Determine the thresholds based on user settings
        let startThreshold, endThreshold;
        switch (user.getBuzzRange()) {
          case 1:
            startThreshold = -60;
            endThreshold = -47;
            break;
          case 2:
            startThreshold = -46;
            endThreshold = -31;
            break;
          case 3:
            startThreshold = -30;
            endThreshold = -15;
            break;
          default:
            console.log("Buzz range not set correctly");
            return;
        }

        // Assuming recordViolation manages its own state or intervals
        recordViolation(
          isStarted,
          distanceVal,
          startThreshold,
          endThreshold,
          (hasViolation) => {
            if (hasViolation) {
              //console.log('Violation detected');
              // add user.setViolation();
              // Handle the violation, e.g., send a signal to buzz
              dataCharacteristic.writeWithResponse(
                btoa(
                  `2,${user.getBuzzDuration()},${user.getBuzzFrequency()},1`,
                ),
              );
            } else if (!hasViolation) {
              console.log("Outside of range");
              dataCharacteristic.writeWithResponse(
                btoa(
                  `2,${user.getBuzzDuration()},${user.getBuzzFrequency()},0`,
                ),
              );
            }
          },
        );
      } catch (error) {
        console.error("Error reading RSSI:", error);
      }
    }, 1000);
  };

  const stopReading = () => {
    if (readRSSIInterval) {
      clearInterval(readRSSIInterval);
    }
  };

  if (isStarted) {
    startReading();
  } else if (!isStarted) {
    stopReading();
    user.setViolations(getViolations());
    console.log(getViolations());
  }

  // Return a function to allow manual stopping of the distance reading
  return stopReading;
}

export default getDistance;
