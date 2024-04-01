import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList, Button } from 'react-native';
import { BleManager } from 'react-native-ble-plx';
import { useState, useEffect, useRef } from 'react';
import { atob, btoa } from 'react-native-quick-base64';

const bleManager = new BleManager();
const SERVICE_UUID = '7a0247e7-8e88-409b-a959-ab5092ddb03e';
const CHAR_UUID = '82258baa-df72-47e8-99bc-b73d7ecd08a5';

export default function useConnectToDevice(
  distanceOpSel,
  colorOpSel,
  strengthOpSel
) {
  const [deviceID, setDeviceID] = useState(null);
  const [devices, setDevices] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('Searching...');
  const deviceRef = useRef(null);
  const [characteristicValue, setCharacteristicValue] = useState('');
  const [data, setData] = useState(null);
  const [distance, setDistance] = useState(null);

  const connectToDevice = async (device) => {
    console.log('distance option selected: ', distanceOpSel);
    console.log('color option selected: ', colorOpSel);
    console.log('strength option selected: ', strengthOpSel);

    try {
      const connectedDevice = await device.connect();
      setDeviceID(connectedDevice.id);
      setConnectionStatus('Connected');
      deviceRef.current = connectedDevice;

      await connectedDevice.discoverAllServicesAndCharacteristics();

      const services = await connectedDevice.services();

      const service = services.find((s) => s.uuid === SERVICE_UUID);
      if (!service) {
        throw new Error('Service not found');
      }

      const characteristics = await service.characteristics();

      const dataCharacteristic = characteristics.find(
        (c) => c.uuid === CHAR_UUID
      );
      if (!dataCharacteristic) {
        throw new Error('Characteristic not found');
      }

      setData(dataCharacteristic);
      const charValue = await dataCharacteristic.read();
      const value = atob(charValue.value);

      setCharacteristicValue(value);
      console.log(value);
      distanceMeasured(device);
    } catch (error) {
      console.error('Error in connection or data fetching:', error);
      setConnectionStatus('Error in Connection');
    }
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
        console.log('In loop');
        bleManager.stopDeviceScan();
        setConnectionStatus('Connecting...');
        connectToDevice(device);
      }
    });
  };

  const distanceMeasured = async (device) => {
    const readRSSIInterval = setInterval(async () => {
      try {
        const rssiResponse = await device.readRSSI();
        let distanceVal = rssiResponse.rssi;
        console.log('RSSI: ', rssiResponse.rssi);
        setDistance(distanceVal);
      } catch (error) {
        console.error('Error reading RSSI:', error);
      }
    }, 500); // Interval set to 1 second (1000 milliseconds)
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
    distance,
    connectToDevice, // Make sure this is defined in your hook
  };
}
