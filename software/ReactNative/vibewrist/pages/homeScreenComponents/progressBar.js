import React, { useRef, useEffect } from "react";
import { View, StyleSheet, Animated, Easing,Text } from "react-native";

export default function Loader() {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(progress, {
        toValue: 1,
        duration: 3500,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: false,
      })
    ).start();
  }, []);

  const goalTime= 5
  const timeStudied=2
  range=((timeStudied / goalTime) * 100)/1.4
  const loaderWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', `${range}%`],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.loader, { width: loaderWidth }]} >
        <Text>{timeStudied} hours completed</Text>
        {/* <Text>30%</Text> */}

      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loader: {
    height: 17,
    backgroundColor: 'white',
    position: 'absolute',
    left: -140,
    borderRadius:5,
  },
});
