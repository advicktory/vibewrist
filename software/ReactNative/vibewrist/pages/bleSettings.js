// import { StatusBar } from 'expo-status-bar';
// import { StyleSheet, Text, View, FlatList, Button } from 'react-native';
// import { BleManager } from 'react-native-ble-plx';
// import { useState, useEffect, useRef } from 'react';
// import { atob, btoa } from 'react-native-quick-base64';

// const bleManager = new BleManager();
// const SERVICE_UUID = '7a0247e7-8e88-409b-a959-ab5092ddb03e';
// const CHAR_UUID = '82258baa-df72-47e8-99bc-b73d7ecd08a5';

// export default function App() {
//   const [deviceID, setDeviceID] = useState(null);
//   const [devices, setDevices] = useState([]);
//   const [connectionStatus, setConnectionStatus] = useState('Searching...');
//   const deviceRef = useRef(null);
//   const [characteristicValue, setCharacteristicValue] = useState('');
//   const [data, setData] = useState(null);
//   const [distance, setDistance] = useState(null);

//   const connectToDevice = async (device) => {
//     try {
//       const connectedDevice = await device.connect();
//       setDeviceID(connectedDevice.id);
//       setConnectionStatus('Connected');
//       deviceRef.current = connectedDevice;

//       await connectedDevice.discoverAllServicesAndCharacteristics();

//       //startDistanceMeasurement(connectedDevice);

//       const services = await connectedDevice.services();

//       const service = services.find((s) => s.uuid === SERVICE_UUID);
//       if (!service) {
//         throw new Error('Service not found');
//       }

//       const characteristics = await service.characteristics();

//       const dataCharacteristic = characteristics.find(
//         (c) => c.uuid === CHAR_UUID
//       );
//       if (!dataCharacteristic) {
//         throw new Error('Characteristic not found');
//       }

//       setData(dataCharacteristic);
//       const charValue = await dataCharacteristic.read();
//       const value = atob(charValue.value);
//       const base64data = btoa('vibrate');
//       await dataCharacteristic.writeWithResponse(base64data);
//       setCharacteristicValue(value);
//       console.log(value);
//       distanceMeasured(device);
//     } catch (error) {
//       console.error('Error in connection or data fetching:', error);
//       setConnectionStatus('Error in Connection');
//     }
//   };

//   useEffect(() => {
//     const subscription = bleManager.onDeviceDisconnected(
//       deviceID,
//       (error, device) => {
//         if (error) {
//           console.log('Disconnected with error:', error);
//         }
//         setConnectionStatus('Disconnected');
//         console.log('Disconnected device');
//         //setStepCount(0); // Reset the step count
//         if (deviceRef.current) {
//           setConnectionStatus('Reconnecting...');
//           connectToDevice(deviceRef.current)
//             .then(() => setConnectionStatus('Connected'))
//             .catch((error) => {
//               console.log('Reconnection failed: ', error);
//               setConnectionStatus('Reconnection failed');
//             });
//         }
//       }
//     );
//     return () => subscription.remove();
//   }, [deviceID]);

//   const searchForDevices = () => {
//     setDevices([]); // Clear the current list
//     bleManager.startDeviceScan(null, null, (error, device) => {
//       if (error) {
//         console.error(error);
//         setConnectionStatus('Error searching for devices');
//         return;
//       }

//       setDevices((prevDevices) => [...prevDevices, device]);
//       if (device.name == 'VibeWrist') {
//         console.log('In loop');
//         bleManager.stopDeviceScan();
//         setConnectionStatus('Connecting...');
//         connectToDevice(device);
//       }
//     });
//   };

//   const distanceMeasured = async (device) => {
//     const readRSSIInterval = setInterval(async () => {
//       try {
//         const rssiResponse = await device.readRSSI();
//         console.log('RSSI: ', rssiResponse.rssi);
//         let distanceVal = estimateDistanceInMeters(rssiResponse.rssi);
//         setDistance(distanceVal);
//       } catch (error) {
//         console.error('Error reading RSSI:', error);
//       }
//     }, 500); // Interval set to 1 second (1000 milliseconds)
//   };

//   const estimateDistanceInMeters = (rssiValue) => {
//     const referenceRSSI1Meter = -60; // TX power in dBm (reference value)
//     const distance1Meter = 1;
//     const logDistanceRatio = (rssiValue - referenceRSSI1Meter) / -10; // Assuming logarithmic relationship

//     const estimatedDistance = distance1Meter * Math.pow(10, logDistanceRatio);

//     return estimatedDistance;
//   };

//   //   setTimeout(() => {
//   //     bleManager.stopDeviceScan();
//   //     setConnectionStatus('Scan complete');
//   //   }, 100000); // stop scanning after 10 seconds

//   useEffect(() => {
//     searchForDevices();
//     return () => bleManager.stopDeviceScan(); // Ensure scanning is stopped when the component unmounts
//   }, []);

//   return (
//     <View style={styles.container}>
//       <Text>App.js to start working on your app!</Text>
//       <Text>{connectionStatus}</Text>

//       <Text>Characteristic Value: {characteristicValue}</Text>
//       <Text>Distance in meters: {distance}</Text>

//       {/* <FlatList
//         data={devices}
//         keyExtractor={(item) => item.id}
//         renderItem={renderDevice}
//       /> */}
//       <Button title="Go to Home" onPress={() => navigation.navigate('Home')} />

//       <StatusBar style="auto" />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });

