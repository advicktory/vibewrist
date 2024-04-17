import React, { useRef, useEffect } from "react";
import { View, StyleSheet, Animated, Easing,Text } from "react-native";

export default function Loader() {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(progress, {
        toValue: 1,
        duration: 5000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: false,
      })
    ).start();
  }, []);

  const goalTime= 5
  const timeStudied=5
  range=((timeStudied / goalTime) * 100)
  const loaderWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', `${range}%`],
  });

  return (
    <View style={styles.container}>
      <View style={styles.progressBarContainer}>
        <Animated.View style={[styles.loader, { width: loaderWidth }]} >
          <Text>{((timeStudied / goalTime) * 100)}%</Text>
        </Animated.View>
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
