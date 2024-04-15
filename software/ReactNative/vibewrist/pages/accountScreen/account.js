import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export default function AccountScreen({route}) {


    const { userObj } = route.params;

  // Mock data for stats
  const stats = {
    today: '3 hours',
    thisWeek: '12 hours',
    allTime: '150 hours',
    cycleCount: 25,
    violationCount: 3,
    leaderboardRank: 10,
  };
//   const stats = {
//     today: userObj.today,
//     thisWeek: userObj.thisWeek,
//     allTime: userObj.allTime,
//     cycleCount: userObj.cycleCount,
//     violationCount: userObj.violationCount,
//     leaderboardRank: userObj.leaderboardRank,
//   };


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('./../../assets/pfp.jpg')}
          style={styles.profilePicture}
        />
        <Text style={styles.username}>{userObj.getUserName()}</Text>
      </View>
      <View style={styles.statsContainer}>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Today:</Text>
          <Text style={styles.statValue}>{stats.today}</Text>
        </View>
        <View style={styles.line}></View>

        <View style={styles.statRow}>
          <Text style={styles.statLabel}>This Week:</Text>
          <Text style={styles.statValue}>{stats.thisWeek}</Text>
        </View>
        <View style={styles.line}></View>

        <View style={styles.statRow}>
          <Text style={styles.statLabel}>All Time:</Text>
          <Text style={styles.statValue}>{stats.allTime}</Text>
        </View>
        <View style={styles.line}></View>

        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Cycle Count:</Text>
          <Text style={styles.statValue}>{stats.cycleCount}</Text>
        </View>
        <View style={styles.line}></View>

        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Violation Count:</Text>
          <Text style={styles.statValue}>{stats.violationCount}</Text>
        </View>
        <View style={styles.line}></View>

        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Leaderboard Rank:</Text>
          <Text style={styles.statValue}>{stats.leaderboardRank}</Text>
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
    width:"75%",
    borderRadius:15,
    alignItems: 'flex-start',
    backgroundColor:"#1c1b1d",
  },
  statRow: {
    margin:20,
    borderTopColor:"#9798a0",
    flexDirection: 'row',
    marginBottom: 10,
    padding:7,
  },
  statLabel: {
    color: '#fff',
    marginRight: 10,
    fontWeight: 'bold',
  },
  statValue: {
    color: '#fff',
  },
  line:{
    width: '90%',
    height: 1,
    backgroundColor:"#9798a0",
    alignSelf: 'center', // Aligns the line horizontally to the center
  }
});
