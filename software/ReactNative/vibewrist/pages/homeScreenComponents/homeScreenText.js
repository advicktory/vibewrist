import { CurrentRenderContext } from "@react-navigation/native";
import { View, Text, StyleSheet } from "react-native";

function calculateTotalTime(sTime, bTime, cAmount) {
  // Convert each value to an integer
  const studyTime = parseInt(sTime);
  const breakTime = parseInt(bTime);
  const cycleAmount = parseInt(cAmount);
  
  // // Check if any of the values are NaN
  // if (isNaN(studyTime) || isNaN(breakTime) || isNaN(cycleAmount)) {
  //   // Handle the case where any value is not a number
  //   return "Invalid input. Please provide valid numbers.";
  // }

  // Perform the calculation
  return (studyTime + breakTime) * cycleAmount;
}


export default function cycleReport(props) {
  const { sLength, bLength, cAmount, isMinutes } = props.cycleOrder;
  return (
    <>
      <View style={styles.container}>
        <Text style={styles.text}>You will be studying for:{' '}
          <Text style={styles.text}>
            {sLength} {isMinutes ? <Text>Minutes</Text> : <Text>Hours</Text>}
          </Text>
        </Text>

        <Text style={styles.text}>Your break will be:{' '}
        <Text style={styles.text}>
          {bLength} {isMinutes ? <Text>Minutes</Text> : <Text>Hours</Text>}
        </Text> 
        </Text>

        <Text style={styles.text}>You have chosen to do this:{" "}
        <Text style={styles.text}>{cAmount} times</Text> 
        </Text>

        <Text style={styles.text}>
          Total time calculation: {calculateTotalTime(sLength, bLength, cAmount)}{" "}
          {isMinutes ? "Minutes" : "Hours"}
        </Text>
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    marginBottom:20,
    // justifyContent:"center",

  },
  text: {
    color: 'white', // Set text color to white
  },
});
