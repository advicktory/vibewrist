import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, TextInput } from "react-native";
import axios from 'axios'; // Import axios for HTTP requests
import braceletPng from '../../assets/blue_bracelet.png';

export default function Login({ navigation }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loginFailed, setLoginFailed] = useState(false);

    const handleSubmit = async () => {
        try {
            // Send a POST request to the server to check if the user exists
            const response = await axios.post('http://localhost:3000/login', {
                username,
                password,
            });

            if (response.status === 200) {
                console.log('Login successful!');
                navigation.navigate('Home');
                // Additional logic after successful login (e.g., redirect)
            }
        } catch (error) {
            console.error('Error logging in:', error);
            // Handle login error (display message, reset form, etc.)
            setLoginFailed(true);
        }
    };

    return (
        <View style={styles.background}>
            <View style={styles.box}>
                <View style={styles.imageContainer}>
                    <Image source={braceletPng} style={styles.image} />
                </View>
                <Text style={styles.h1}> Log In</Text>
                <Text style={styles.smallGreyText}> Welcome to Vibewrist. Please Sign in.</Text>

                <View style={styles.inputField}>
                    <TextInput
                        style={styles.input}
                        placeholder="Username"
                        onChangeText={text => setUsername(text)}
                    />
                </View>
                <View style={styles.inputField}>
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        onChangeText={text => setPassword(text)}
                        secureTextEntry={true}
                    />
                </View>

                {loginFailed && <Text style={styles.loginFailedText}>Invalid username or password. Please try again.</Text>}

                <TouchableOpacity onPress={handleSubmit} style={styles.signin}>
                    <Text style={{ color: '#fff' }}>Sign in</Text>
                </TouchableOpacity>

                <Text style={styles.smallGreyText}>Don't have an account? <Text style={{ color:"#157AFE" }} onPress={() => navigation.navigate('signup')}> Sign up here</Text></Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
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
    h1:{
        fontFamily: 'Nunito',
        fontWeight: '200',
        fontSize: 50,
        textAlign: 'center',
        color: 'transparent',
        textShadowColor: 'rgba(45, 97, 241, 0.3)',
        textShadowOffset: { width: 0, height: 4 },
        textShadowRadius: 10,
    },
    smallGreyText:{
        color: '#808080',
        fontSize: 14,
        textAlign: 'center',
        marginTop: 10,
    },
    inputField:{
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
    image:{
        width:150,
        height: 150,
    },
    imageContainer:{
        justifyContent: 'center',
        alignItems: 'center',
    }
});
