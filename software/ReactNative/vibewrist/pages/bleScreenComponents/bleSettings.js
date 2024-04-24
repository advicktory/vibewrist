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

  const connectToDevice = (device) => {
    return device
      .connect()
      .then((device) => {
        setDeviceID(device.id);
        setConnectionStatus('Connected');
        deviceRef.current = device;
        console.log('Connected to VibeWrist, you can now begin studying!');
        return device.discoverAllServicesAndCharacteristics();
      })
      .then((device) => device.services())
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
        ledOnConnect(dataCharacteristic);
      })
      .catch((error) => {
        console.error('Error in connection or data fetching:', error);
        setConnectionStatus('Error in Connection');
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

  const ledOnConnect = async (dataCharacteristic) => {
    // Commands for each LED, these need to be defined according to your device's specification
    const commandsOn = ['1,1,1', '1,2,1', '1,3,1'];
    const commandsOff = ['1,1,0', '1,2,0', '1,3,0'];

    try {
      // Sequentially send commands to turn on each LED
      for (const commandOn of commandsOn) {
        //console.log(`Sending command: ${commandOn}`);
        await dataCharacteristic.writeWithResponse(btoa(commandOn));
        //console.log(`Command ${commandOn} executed successfully`);
      }
      console.log('Connected LED sequence complete');
      for (const commandOff of commandsOff) {
        //console.log(`Sending command: ${commandOff}`);
        await dataCharacteristic.writeWithResponse(btoa(commandOff));
        //console.log(`Command ${commandOff} executed successfully`);
      }
    } catch (error) {
      console.error('Failed to turn on/off LEDs:', error);
    }
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
