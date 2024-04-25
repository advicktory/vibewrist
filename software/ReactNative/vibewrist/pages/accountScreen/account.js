import React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useUser } from '../UserContext';

export default function AccountScreen() {
  const user = useUser();
  const [userStats, setUserStats] = useState({
    today: '',
    thisWeek: '',
    allTime: '',
    cycleCount: 0,
    violationCount: 0,
    leaderboardRank: 0,
  });

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          const response = await fetch(
            `http://localhost:3000/getUserStats?username=${encodeURIComponent(
              user.getUserName()
            )}`
          );
          const text = await response.text(); // First get the text
          console.log('Server response:', text); // Log the raw text
          const data = JSON.parse(text); // Then attempt to parse it as JSON
          // const data = await response.json();
          if (response.ok) {
            setUserStats((prevStats) => ({
              ...prevStats,
              today: data.todayDuration,
              thisWeek: data.weekDuration,
              allTime: data.timeStudied,
              cycleCount: data.cyclesCompleted,
              violationCount: data.violations,
            }));
          } else {
            throw new Error(data.message || 'Unable to fetch data');
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      fetchData();

      // Optional: Return a cleanup function if necessary
      // return () => setUserStats(null);
    }, [])
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('./../../assets/pfp.jpg')}
          style={styles.profilePicture}
        />
        <Text style={styles.username}>{user.getUserName()}</Text>
      </View>
      <View style={styles.statsContainer}>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Today:</Text>
          <Text style={styles.statValue}>{userStats.today} Hours</Text>
        </View>
        <View style={styles.line}></View>

        <View style={styles.statRow}>
          <Text style={styles.statLabel}>This Week:</Text>
          <Text style={styles.statValue}>{userStats.thisWeek} Hours</Text>
        </View>
        <View style={styles.line}></View>

        <View style={styles.statRow}>
          <Text style={styles.statLabel}>All Time:</Text>
          <Text style={styles.statValue}>{userStats.allTime} Hours</Text>
        </View>
        <View style={styles.line}></View>

        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Cycle Count:</Text>
          <Text style={styles.statValue}>{userStats.cycleCount}</Text>
        </View>
        <View style={styles.line}></View>

        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Violation Count:</Text>
          <Text style={styles.statValue}>{userStats.violationCount}</Text>
        </View>
        <View style={styles.line}></View>

        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Leaderboard Rank:</Text>
          <Text style={styles.statValue}>{userStats.leaderboardRank}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 50,
  },
  header: {
    alignItems: 'center',
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  username: {
    color: '#fff',
    marginTop: 10,
    fontWeight: 'bold',
  },
  statsContainer: {
    marginTop: 30,
    width: '75%',
    borderRadius: 15,
    alignItems: 'flex-start',
    backgroundColor: '#1c1b1d',
  },
  statRow: {
    margin: 20,
    borderTopColor: '#9798a0',
    flexDirection: 'row',
    marginBottom: 10,
    padding: 7,
  },
  statLabel: {
    color: '#fff',
    marginRight: 10,
    fontWeight: 'bold',
  },
  statValue: {
    color: '#fff',
  },
  line: {
    width: '90%',
    height: 1,
    backgroundColor: '#9798a0',
    alignSelf: 'center', // Aligns the line horizontally to the center
  },
});
