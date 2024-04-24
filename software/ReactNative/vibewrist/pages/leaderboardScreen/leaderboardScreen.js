import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import { SelectList } from 'react-native-dropdown-select-list';

export default function LeaderboardScreen() {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [filterSelected, setFilterSelected] = useState('totalTime');

  useEffect(() => {
    fetchLeaderboardData();
  }, [filterSelected]);

  const fetchLeaderboardData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/leaderboard');
      let sortedData = response.data;
      
      // Sort the data based on the selected filter
      if (filterSelected === 'totalTime') {
        sortedData.sort((a, b) => b.timeStudied - a.timeStudied);
      } else if (filterSelected === 'totalViolations') {
        sortedData.sort((a, b) => b.violations - a.violations);
      }
      
      setLeaderboardData(sortedData);
    } catch (error) {
      console.error('Error fetching leaderboard data:', error);
    }
  };

  const Filter = [
    { key: 'totalTime', value: 'Filter: Total Time Studied' },
    { key: 'totalViolations', value: 'Filter: Total Violations' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Leaderboard</Text>
      <View style={styles.containerDrop}>
        <SelectList
          setSelected={(val) => setFilterSelected(val)}
          data={Filter}
          search={false}
          placeholder="Default Filter: Total Time Studied"
          save="key"
          inputStyles={styles.inputContainer}
          dropdownTextStyles={styles.dropdownContainer}
          boxStyles={styles.boxContainer}
          dropdownStyles={styles.boxContainer}
        />
      </View>
      <View style={styles.leaderboardContainer}>
        {leaderboardData.map((item, index) => (
          <View
            style={[styles.leaderboardItem,index % 2 === 0 ? styles.evenRow : styles.oddRow,]}
            key={index}
          >
            <Text style={styles.rank}>{index + 1}</Text>
            <Text style={styles.username}>{item.username}</Text>
            <Text style={styles.score}>
              {filterSelected === 'totalTime'
                ? `${item.timeStudied} hours`
                : `${item.violations} violations`}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 20,
  },
  leaderboardContainer: {
    width: '80%',
    alignItems: 'center',
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
    backgroundColor: '#1c1b1d',
    padding: 10,
    borderRadius: 10,
  },
  evenRow: {
    backgroundColor: '#333',
  },
  oddRow: {
    backgroundColor: '#1c1b1d',
  },
  rank: {
    color: '#fff',
    fontWeight: 'bold',
  },
  username: {
    color: '#fff',
    flex: 1,
    marginLeft: 10,
  },
  score: {
    color: '#fff',
  },
  inputContainer: {
    color: 'white',
    fontWeight: 'bold',
  },
  dropdownContainer: {
    color: 'white',
    fontWeight: 'bold',
  },
  boxContainer: {
    borderColor: 'white',
    margin: 5,
    height: 45,
    maxHeight: 50,
  },
  containerDrop: {
    backgroundColor: '#1c1b1d',
    borderRadius: 20,
    margin: 20,
  },
});
