import React, { useRef, useEffect, useCallback, useState } from "react";
import { View, StyleSheet, Animated, Easing, Text } from "react-native";
import { useUser } from "../UserContext";

/**
 * A component to handle the progression of filling up a progress bar based on the amount of cycles a user has completed.
 * @function ProgressBar
 * @param {None} - No parameters were given for this function.
 * @returns {JSX} Returns the JSX and CSS needed to display the necessary components.
 * */
export default function ProgressBar() {
  //const [goalTime, setGoalTime] = useState(0);
  //const [timeStudied, setTimeStudied] = useState(0);
  const [progressPercent, setProgressPercent] = useState("0%");
  //const progressAnim = useRef(new Animated.Value(0)).current;
  const user = useUser();

  useEffect(() => {
    async function fetchData() {
      const currentTimeToGoal = await user.getUserCurrTime(); // Assume this is an async call
      const currentGoal = await user.getUserGoalTime(); // Assume this is an async call
      if (currentGoal > 0 && currentTimeToGoal >= 0) {
        const percent =
          ((currentTimeToGoal / currentGoal) * 100).toFixed(1) + "%";
        setProgressPercent(percent);
      }
    }

    if (user.getUserName()) {
      // Ensures fetchData runs after user is set
      fetchData();
    }
  }, [user.getUserName(), user.getUserGoalTime(), user.getUserCurrTime()]); // Add dependencies that trigger re-fetch

  if (!user.getUserGoalTime() || !user.getUserCurrTime()) {
    return <Text>Loading...</Text>; // Or any other loading component
  }

  // useEffect(() => {
  //   Animated.loop(
  //     Animated.timing(progress, {
  //       toValue: 1,
  //       duration: 5000,
  //       easing: Easing.inOut(Easing.ease),
  //       useNativeDriver: false,
  //     })
  //   ).start();
  // }, []);

  // range=((timeStudied / goalTime) * 100)
  // const loaderWidth = progress.interpolate({
  //   inputRange: [0, 1],
  //   outputRange: ['0%', `${range}%`],
  // });

  return (
    <View style={styles.container}>
      <View style={styles.progressBarContainer}>
        <View style={[styles.loader, { width: `${progressPercent}%` }]}>
          {/* <Animated.View style={[styles.loader, { width: loaderWidth }]} > */}
          <Text>{progressPercent}%</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  loader: {
    height: "100%",
    backgroundColor: "white",
    borderRadius: 5,
  },
  progressBarContainer: {
    height: 17,
    width: 300,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 5,
    overflow: "hidden",
  },
});
