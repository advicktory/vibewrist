// import React, { useState, useEffect } from "react";
// import { View, Text, Button, FlatList } from "react-native";
// import { BleManager } from "react-native-ble-plx";

// const ScanScreen = () => {
//   const [devices, setDevices] = useState([]);
//   const manager = new BleManager();

//   useEffect(() => {
//     scanForDevices();

//     // Clean up function
//     return () => {
//       manager.stopDeviceScan();
//       // manager.destroy();
//     };
//   }, []);

//   const scanForDevices = () => {
//     manager.startDeviceScan(null, null, (error, scannedDevice) => {
//       if (error) {
//         console.error("Error scanning for devices:", error);
//         return;
//       }
//       console.log(scannedDevice.id, scannedDevice.name);

//       const foundDevice = devices.find(
//         (device) => device.id === scannedDevice.id,
//       ); // Determines whether or not a device was seen before.
//       if (!foundDevice) {
//         setDevices((prevDevices) => [...prevDevices, scannedDevice]);
//       } // If it hasn't add it to the devices list
//     });
//   };

//   const renderItem = ({ item }) => (
//     <View style={{ marginVertical: 10 }}>
//       <Text>{item.name || "Unknown"}</Text>
//       <Text>UUID: {item.id}</Text>
//       <Button title="Connect" onPress={() => connectToDevice(item.id)} />
//     </View>
//   );

//   const connectToDevice = (deviceId) => {
//     // Implement your logic to connect to the device
//     console.log("Connecting to device with ID:", deviceId);
//   };

//   return (
//     <View style={{ flex: 1, padding: 20 }}>
//       <FlatList
//         data={devices}
//         renderItem={renderItem}
//         keyExtractor={(item) => item.id}
//         ListEmptyComponent={<Text>No BLE devices found</Text>}
//       />
//     </View>
//   );
// };

// export default ScanScreen;
