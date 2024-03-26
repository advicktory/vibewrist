import { View, Text } from "react-native";

export default function cycleReport(props) {
  const { sLength, bLength, cAmount, isMinutes } = props.cycleOrder;
  return (
    <>
      <Text>You will be studying for:</Text>
      <Text>
        {sLength} {isMinutes ? <Text>Minutes</Text> : <Text>Hours</Text>}
      </Text>

      <Text>Your break will be:</Text>
      <Text>
        {bLength} {isMinutes ? <Text>Minutes</Text> : <Text>Hours</Text>}
      </Text>

      <Text>You have choosen to do this:</Text>
      <Text>{cAmount} times</Text>
    </>
  );
}
