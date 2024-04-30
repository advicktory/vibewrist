import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Button,
  Modal,
  TextInput,
  Image,
  TouchableOpacity,
  Text,
  Dimensions,
} from "react-native";
import { useUser } from "../UserContext";

/**
 * Component for the StartButton on the Home Screen of the application.
 * @function StartButton
 * @param {function} onPress - A function defined in 'home.js' to handle the done the button is pressed.
 * @param {boolean} isPaused - A boolean to determine is the start process should be paused or not.
 * @param {function} setIsPaused - Handler for the 'isPaused Variable'.
 * @returns {JSX} - Returns the JSX and CSS needed to display the screen.
 * */
const StartButton = ({ onPress, isPaused, setIsPaused }) => {
  //const [isPaused, setIsPaused] = useState(false); // State to track if the pop-up is open

  /**
   * Function to handle the press of the start button
   * @function handleStartPress
   * @param {None} - There is not return for this function.
   * @returns {None} - Function to handle on press functionality as well as tell the application that the cycle is paused.
   * */
  const handleStartPress = () => {
    // Your logic for handling start button press

    if (onPress) {
      setIsPaused(true); // Open the pop-up
      onPress(); // Call external onPress passed as a prop
    }
  };

  // Function to handle the press of the pause button in the pop-up
  const handlePausePress = () => {
    // Your logic for handling pause button press
    // ADAM's NOTE: We will need a way to pause the process at hand.
    setIsPaused(false); // Close the pop-up
  };
  return (
    <>
      <TouchableOpacity onPress={handleStartPress} style={styles.button}>
        <Text style={styles.buttonText}>Start</Text>
      </TouchableOpacity>

      {/* Pop-up */}
      <Modal visible={isPaused} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* <Text>Do you want to pause?</Text> */}
            <Text>Ending session will result in progress not saved.</Text>
            <TouchableOpacity
              style={[styles.stopButton, { backgroundColor: "red" }]}
              onPress={handlePausePress}
            >
              <Text style={styles.stopButtonText}>End session</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

// const onStartPress = () => {
//   const user = useUser();
//   let studyTime = user.getStudyLength();
//   let breakTime = user.getBreakLength();
//   // manageStudyTime(dataCharacteristic, studyTime);

//   // Stuff for vibration module
//   let buzzLength = user.getBuzzDuration();
//   let buzzFreq = user.getBuzzFrequency();
//   // getDistance(deviceCurr, dataCharacteristic);
// };

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  stopButton: {
    backgroundColor: "#007AFF", // Default color
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  stopButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  button: {
    position: "absolute",
    left: 122,
    // bottom: 40,
    // top: 390,
    left: windowWidth / 2 - 75, // Centered horizontally
    bottom: windowHeight * 0.02, // Adjusted position based on screen height
    marginTop: 30,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "transparent",
    borderWidth: 3,
    borderColor: "rgba(0, 102, 255, 0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 20,
    color: "#0066ff",
    letterSpacing: 2,
    textTransform: "uppercase",
    // fontFamily: "sans-serif",
  },
});

export default StartButton;
