import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

const StartButton = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <Text style={styles.buttonText}>Start</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    left:122,
    bottom:40,
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
