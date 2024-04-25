import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  TextInput,
} from 'react-native';
import * as Font from 'expo-font';
import braceletPng from '../../assets/blue_bracelet.png';

const SERVER_URL = 'http://localhost:3000/signup'; // Update with your server URL

export default function SignUp({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    try {
      if (!username || !password) {
        setError('Please enter both username and password.');
        return;
      }

      const response = await fetch(SERVER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        console.log('User registered!');
        navigation.navigate('Home');
        // Redirect or perform actions after successful registration
      } else {
        setError('Failed to register user');
        // Handle registration failure
      }
    } catch (error) {
      console.error('Error registering user:', error);
      setError('Network error. Please try again later.');
      // Handle network errors or other exceptions
    }
  };

  return (
    <View style={styles.background}>
      <View style={styles.box}>
        <View style={styles.imageContainer}>
          <Image source={braceletPng} style={styles.image} />
        </View>
        <Text style={styles.h1}> Sign up</Text>
        <Text style={styles.smallGreyText}>
          {' '}
          Welcome to Vibewrist. Please Sign up
        </Text>

        <View style={styles.inputField}>
          <TextInput
            style={styles.input}
            placeholder="Username"
            onChangeText={(text) => setUsername(text)}
          />
        </View>
        <View style={styles.inputField}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            onChangeText={(text) => setPassword(text)}
            secureTextEntry={true}
          />
        </View>

        <TouchableOpacity onPress={handleSubmit} style={styles.signin}>
          <Text style={{ color: '#fff' }}>Sign up</Text>
        </TouchableOpacity>
        {error ? <Text style={styles.loginFailedText}>{error}</Text> : null}
      </View>
    </View>
  );
}

const styles = {
  background: {
    backgroundColor: '#3d85c6',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    backgroundColor: '#fff',
    shadowColor: '#959FA5',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    elevation: 8,
    width: '90%',
    padding: 20,
    borderRadius: 10,
  },
  h1: {
    fontFamily: 'Nunito',
    fontWeight: '200',
    fontSize: 50,
    textAlign: 'center',
    color: 'transparent',
    textShadowColor: 'rgba(45, 97, 241, 0.3)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 10,
  },
  smallGreyText: {
    color: '#808080',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
  },
  inputField: {
    position: 'relative',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#eeeeee',
    paddingVertical: 15,
    paddingHorizontal: 10,
    width: '100%',
    borderRadius: 10,
  },
  signin: {
    backgroundColor: '#157AFE',
    paddingVertical: 15,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  loginFailedText: {
    fontSize: 15,
    color: '#FA3D3D',
    textAlign: 'center',
    marginTop: 10,
  },
  image: {
    width: 150,
    height: 150,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
};
