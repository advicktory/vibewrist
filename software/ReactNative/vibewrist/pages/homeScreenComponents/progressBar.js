import React, { useRef, useEffect, useCallback, useState } from 'react';
import { View, StyleSheet, Animated, Easing, Text } from 'react-native';
import { useUser } from '../UserContext';

export default function Loader() {
  const [goalTime, setGoalTime] = useState(0);
  const [timeStudied, setTimeStudied] = useState(0);
  const [progressPercent, setProgressPercent] = useState('0%');
  //const progressAnim = useRef(new Animated.Value(0)).current;
  const user = useUser();

  useEffect(() => {
    fetch(
      `http://192.168.1.7:3000/pullUserStats?username=${encodeURIComponent(
        user.getUserName()
      )}`
    )
      .then((response) => response.json())
      .then((data) => {
        //setGoalTime(Number(data.currentGoal) || 1); // Ensure it's numeric and avoid division by zero
        // setTimeStudied(Number(data.currentTimeToGoal) || 1); // Ensure it's numeric\
        user.setUserGoalTime(goalTime);

        console.log(goalTime);
      })
      .catch((error) => console.error('Failed to fetch user goals:', error));
  }, [user.getUserName(), user.getUserGoalTime()]);

  // var progressPercent;
  useEffect(() => {
    const percent = ((timeStudied / goalTime) * 100).toFixed(1) + '%';
    //setProgressPercent(percent);
  }, [user.getUserGoalTime()]);

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
    justifyContent: 'center',
    alignItems: 'center',
  },
  loader: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 5,
  },
  progressBarContainer: {
    height: 17,
    width: 300,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 5,
    overflow: 'hidden',
  },
});
