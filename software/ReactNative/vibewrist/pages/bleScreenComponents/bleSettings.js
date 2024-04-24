import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList, Button } from 'react-native';
import { BleManager } from 'react-native-ble-plx';
import { useState, useEffect, useRef } from 'react';
import { atob, btoa } from 'react-native-quick-base64';
import User from '../User';
import { useUser } from '../UserContext';

const bleManager = new BleManager();
const SERVICE_UUID = '7a0247e7-8e88-409b-a959-ab5092ddb03e';
const CHAR_UUID = '82258baa-df72-47e8-99bc-b73d7ecd08a5';

export default function useConnectToDevice() {
  const [deviceID, setDeviceID] = useState(null);
  const [devices, setDevices] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('Searching...');
  const deviceRef = useRef(null);
  const [characteristicValue, setCharacteristicValue] = useState('');
  const [data, setData] = useState(null);
  const [distance, setDistance] = useState(null);

  const user = useUser();

  //console.log('User in settings: ', user);

  const connectToDevice = (device, retryCount = 0) => {
    return device
      .connect()
      .then((connectedDevice) => {
        setDeviceID(connectedDevice.id);
        setConnectionStatus('Connected');
        deviceRef.current = connectedDevice;
        console.log('Connected');
        return connectedDevice.discoverAllServicesAndCharacteristics();
      })
      .then((connectedDevice) => connectedDevice.services())
      .then((services) => {
        let service = services.find((s) => s.uuid === SERVICE_UUID);
        if (!service) {
          throw new Error('Service not found');
        }
        return service.characteristics();
      })
      .then((characteristics) => {
        let dataCharacteristic = characteristics.find(
          (c) => c.uuid === CHAR_UUID
        );
        if (!dataCharacteristic) {
          throw new Error('Characteristic not found');
        }
        setData(dataCharacteristic);
      })
      .catch((error) => {
        console.error('Error in connection or data fetching:', error);
        setConnectionStatus('Error in Connection');
        if (retryCount < 3) {
          console.log(`Attempting to reconnect... Attempt #${retryCount + 1}`);
          return connectToDevice(device, retryCount + 1);
        }
      });
  };

  useEffect(() => {
    const subscription = bleManager.onDeviceDisconnected(
      deviceID,
      (error, device) => {
        if (error) {
          console.log('Disconnected with error:', error);
        }
        setConnectionStatus('Disconnected');
        console.log('Disconnected device');
        //setStepCount(0); // Reset the step count
        if (deviceRef.current) {
          setConnectionStatus('Reconnecting...');
          connectToDevice(deviceRef.current)
            .then(() => setConnectionStatus('Connected'))
            .catch((error) => {
              console.log('Reconnection failed: ', error);
              setConnectionStatus('Reconnection failed');
            });
        }
      }
    );
    return () => subscription.remove();
  }, [deviceID]);

  const searchForDevices = () => {
    setDevices([]); // Clear the current list
    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.error(error);
        setConnectionStatus('Error searching for devices');
        return;
      }

      setDevices((prevDevices) => [...prevDevices, device]);
      if (device.name == 'VibeWrist') {
        bleManager.stopDeviceScan();
        setConnectionStatus('Connecting...');
        connectToDevice(device);
      }
    });
  };

  useEffect(() => {
    searchForDevices();
    return () => bleManager.stopDeviceScan(); // Ensure scanning is stopped when the component unmounts
  }, []);

  return {
    deviceID,
    devices,
    connectionStatus,
    characteristicValue,
    data,
    deviceRef,
    connectToDevice, // Make sure this is defined in your hook
  };
}
