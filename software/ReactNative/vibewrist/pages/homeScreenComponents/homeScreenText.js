import { CurrentRenderContext } from "@react-navigation/native";
import { View, Text, StyleSheet } from "react-native";

function calculateTotalTime(sTime, bTime, cAmount) {
  return (sTime + bTime) * cAmount;
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

        {/* <Text style={styles.text}>Your break will be:</Text>
        <Text style={styles.text}>
          {bLength} {isMinutes ? <Text>Minutes</Text> : <Text>Hours</Text>}
        </Text> */}

        {/* <Text style={styles.text}>You have chosen to do this:</Text>
        <Text style={styles.text}>{cAmount} times</Text> */}

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
    marginBottom:50,
    // justifyContent:"center",

  },
  text: {
    color: 'white', // Set text color to white
  },
});
