// screens/ConfigureScreen.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Picker as RNPicker } from '@react-native-picker/picker';
import { devices, updateDeviceConfig, Device } from '../utils/DeviceStore';
import { RootParamList } from '../navigation/types';
import DrawerField from '../components/DrawerField';

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

  const updateFormWithDevice = useCallback((deviceIdToUse: string | undefined) => {
    const selectedDevice = devices.find((d) => d.id === deviceIdToUse);
    if (selectedDevice) {
      setAddr1(selectedDevice.config.addr1.toString());
      setBaud1(selectedDevice.config.baud1.toString());
      setCheck1(selectedDevice.config.check1.toString());
      setStopBit1(selectedDevice.config.stopBit1.toString());
      setBaud2(selectedDevice.config.baud2.toString());
      setCheck2(selectedDevice.config.check2.toString());
      setStopBit2(selectedDevice.config.stopBit2.toString());
    } else {
      setAddr1('');
      setBaud1('');
      setCheck1('');
      setStopBit1('');
      setBaud2('');
      setCheck2('');
      setStopBit2('');
    }
  }, []);

  useEffect(() => {
    if (deviceId) {
      setSelectedDeviceId(deviceId);
      updateFormWithDevice(deviceId);
    } else {
      setSelectedDeviceId(undefined);
      updateFormWithDevice(undefined);
    }
  }, [deviceId, updateFormWithDevice]);

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

    updateDeviceConfig(selectedDeviceId, newConfig);
    Alert.alert('Success', 'Configuration applied successfully!');
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Power Analyzer Configuration</Text>
      <View style={styles.form}>
        <Text style={styles.label}>Select Device</Text>
        <RNPicker
          selectedValue={selectedDeviceId}
          style={styles.picker}
          onValueChange={(itemValue) => {
            setSelectedDeviceId(itemValue);
            updateFormWithDevice(itemValue);
          }}
        >
          <RNPicker.Item label="Select a device" value={undefined} />
          {devices.map((device) => (
            <RNPicker.Item key={device.id} label={device.name} value={device.id} />
          ))}
        </RNPicker>

        <DrawerField
          label="Address (Addr1)"
          value={addr1}
          options={[{ label: '1', value: '1' }, { label: '2', value: '2' }, { label: '247', value: '247' }].map(n => ({ label: n.label, value: n.value }))} // Simplified for demo, adjust range as needed
          onChange={setAddr1}
          disabled={!selectedDeviceId}
        />

        <DrawerField
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

        <DrawerField
          label="Check Digit 1 (Check1)"
          value={check1}
          options={[
            { label: 'No check', value: '0' },
            { label: 'Odd parity', value: '1' },
            { label: 'Parity', value: '2' },
          ]}
          onChange={setCheck1}
          disabled={!selectedDeviceId}
        />

        <DrawerField
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

        <DrawerField
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

        <DrawerField
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

        <DrawerField
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

        <Button title="Apply Configuration" onPress={handleApply} color="#007AFF" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#1a1a1a',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  form: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: 10,
    padding: 20,
  },
  label: {
    fontSize: 16,
    color: '#d1d5db',
    marginBottom: 5,
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 15,
    backgroundColor: '#2d2d2d',
    color: '#fff',
    borderWidth: 1,
    borderColor: '#4b5563',
    borderRadius: 5,
  },
});

export default ConfigureScreen;