import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, Pressable } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { devices, updateDeviceConfig, subscribeToDeviceUpdates } from '../utils/DeviceStore';
import { RootParamList } from '../navigation/types';
import ConfigCard from '../components/ConfigCard';

const ConfigureScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootParamList>>();
  const route = useRoute<RouteProp<RootParamList, 'Configure'>>();
  const deviceId = route.params?.deviceId;

  const [selectedDeviceId, setSelectedDeviceId] = useState<string | undefined>(deviceId);
  const [addr1, setAddr1] = useState('');
  const [baud1, setBaud1] = useState('');
  const [check1, setCheck1] = useState('');
  const [stopBit1, setStopBit1] = useState('');
  const [baud2, setBaud2] = useState('');
  const [check2, setCheck2] = useState('');
  const [stopBit2, setStopBit2] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Update form with selected device data from DeviceStore
  const updateFormWithDevice = (deviceIdToUse: string | undefined) => {
    const selectedDevice = devices.find((d) => d.id === deviceIdToUse);
    if (selectedDevice) {
      console.log(`Updating form for device: ${selectedDevice.name}`);
      setAddr1(selectedDevice.config.addr1.toString());
      setBaud1(selectedDevice.config.baud1.toString());
      setCheck1(selectedDevice.config.check1.toString());
      setStopBit1(selectedDevice.config.stopBit1.toString());
      setBaud2(selectedDevice.config.baud2.toString());
      setCheck2(selectedDevice.config.check2.toString());
      setStopBit2(selectedDevice.config.stopBit2.toString());
    } else {
      console.log('No device selected, clearing form');
      setAddr1('');
      setBaud1('');
      setCheck1('');
      setStopBit1('');
      setBaud2('');
      setCheck2('');
      setStopBit2('');
    }
  };

  // Subscribe to DeviceStore updates
  useEffect(() => {
    console.log('Subscribing to device updates in ConfigureScreen');
    const unsubscribe = subscribeToDeviceUpdates((updatedDevices) => {
      console.log('Received device update in ConfigureScreen:', updatedDevices.map(d => ({ id: d.id, name: d.name })));
      setIsLoading(false);
      if (updatedDevices.length > 0 && !selectedDeviceId) {
        const initialDevice = deviceId && updatedDevices.some(d => d.id === deviceId) ? deviceId : updatedDevices[0].id;
        console.log(`Setting initial device: ${initialDevice}`);
        setSelectedDeviceId(initialDevice);
        updateFormWithDevice(initialDevice);
      } else if (updatedDevices.length === 0) {
        console.log('No devices available, clearing selection');
        setSelectedDeviceId(undefined);
        updateFormWithDevice(undefined);
      }
      // Update form if the selected device's config changed
      if (selectedDeviceId) {
        updateFormWithDevice(selectedDeviceId);
      }
    });

    return () => {
      console.log('Unsubscribing from device updates in ConfigureScreen');
      unsubscribe();
    };
  }, []);

  // Update form when selected device changes
  useEffect(() => {
    console.log(`Selected device changed to: ${selectedDeviceId}`);
    updateFormWithDevice(selectedDeviceId);
  }, [selectedDeviceId]);

  const handleApply = () => {
    if (!selectedDeviceId) {
      Alert.alert('Error', 'Please select a device to configure.');
      return;
    }

    const newConfig = {
      addr1: parseInt(addr1, 10),
      baud1: parseInt(baud1, 10),
      check1: parseInt(check1, 10),
      stopBit1: parseInt(stopBit1, 10),
      baud2: parseInt(baud2, 10),
      check2: parseInt(check2, 10),
      stopBit2: parseInt(stopBit2, 10),
    };

    if (newConfig.addr1 < 1 || newConfig.addr1 > 247) {
      Alert.alert('Error', 'Address must be between 1 and 247.');
      return;
    }

    // Update DeviceStore (which will also send to WDX)
    console.log('Applying configuration:', newConfig);
    updateDeviceConfig(selectedDeviceId, newConfig);

    Alert.alert('Success', 'Configuration applied successfully!');
    navigation.goBack();
  };

  if (isLoading) {
    console.log('Rendering loading state');
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Loading devices...</Text>
      </View>
    );
  }

  console.log('Rendering main UI with devices:', devices.map(d => ({ id: d.id, name: d.name })));
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Power Analyzer Configuration</Text>
      <View style={styles.content}>
        <ConfigCard
          label="Device"
          value={selectedDeviceId ? devices.find(d => d.id === selectedDeviceId)?.name || 'No Device' : 'No Device Selected'}
          options={devices.map(device => ({ label: device.name, value: device.id }))}
          onChange={(value) => {
            console.log(`Device selection changed to: ${value}`);
            setSelectedDeviceId(value);
          }}
          disabled={devices.length === 0}
        />
        <ConfigCard
          label="Address (Addr1)"
          value={addr1}
          options={Array.from({ length: 247 }, (_, i) => ({ label: (i + 1).toString(), value: (i + 1).toString() }))}
          onChange={setAddr1}
          disabled={!selectedDeviceId}
        />
        <ConfigCard
          label="Baud Rate 1 (Baud1)"
          value={baud1}
          options={[
            { label: '1200', value: '1200' },
            { label: '2400', value: '2400' },
            { label: '4800', value: '4800' },
            { label: '9600', value: '9600' },
            { label: '19200', value: '19200' },
            { label: '38400', value: '38400' },
            { label: '57600', value: '57600' },
          ]}
          onChange={setBaud1}
          disabled={!selectedDeviceId}
        />
        <ConfigCard
          label="Check Digit 1 (Check1)"
          value={check1}
          options={[
            { label: '0 No check', value: '0' },
            { label: '1 Odd parity', value: '1' },
            { label: '2 Parity', value: '2' },
          ]}
          onChange={setCheck1}
          disabled={!selectedDeviceId}
        />
        <ConfigCard
          label="Stop Bit (Check1)"
          value={stopBit1}
          options={[
            { label: '1 stop bit', value: '0' },
            { label: '1.5 stop bit', value: '1' },
            { label: '2 stop bit', value: '2' },
          ]}
          onChange={setStopBit1}
          disabled={!selectedDeviceId}
        />
        <ConfigCard
          label="Baud Rate 2 (Baud2)"
          value={baud2}
          options={[
            { label: '1200', value: '1200' },
            { label: '2400', value: '2400' },
            { label: '4800', value: '4800' },
            { label: '9600', value: '9600' },
            { label: '19200', value: '19200' },
            { label: '38400', value: '38400' },
            { label: '57600', value: '57600' },
          ]}
          onChange={setBaud2}
          disabled={!selectedDeviceId}
        />
        <ConfigCard
          label="Check Digit 2 (Check2)"
          value={check2}
          options={[
            { label: 'No check', value: '0' },
            { label: 'Odd parity', value: '1' },
            { label: 'Parity', value: '2' },
          ]}
          onChange={setCheck2}
          disabled={!selectedDeviceId}
        />
        <ConfigCard
          label="Stop Bit (Check2)"
          value={stopBit2}
          options={[
            { label: '1 stop bit', value: '0' },
            { label: '1.5 stop bit', value: '1' },
            { label: '2 stop bit', value: '2' },
          ]}
          onChange={setStopBit2}
          disabled={!selectedDeviceId}
        />
        <Pressable style={styles.applyButton} onPress={handleApply}>
          <Text style={styles.applyButtonText}>Apply Configuration</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 20,
  },
  content: {
    flex: 1,
  },
  applyButton: {
    backgroundColor: '#28a745',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ConfigureScreen;