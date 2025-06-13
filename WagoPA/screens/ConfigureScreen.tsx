import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, Pressable, ScrollView } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { devices, updateDeviceConfig, subscribeToDeviceUpdates, setConfigEditing } from '../utils/DeviceStore';
import { RootParamList } from '../navigation/types';
import ConfigCard from '../components/ConfigCard';
import tw from 'twrnc';

const ConfigureScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootParamList>>();
  const route = useRoute<RouteProp<RootParamList, 'Configure'>>();
  const deviceId = route.params?.deviceId;

  const [device, setDevice] = useState<typeof devices[0] | undefined>(undefined);
  const [addr1, setAddr1] = useState('');
  const [baud1, setBaud1] = useState('');
  const [check1, setCheck1] = useState('');
  const [stopBit1, setStopBit1] = useState('');
  const [baud2, setBaud2] = useState('');
  const [check2, setCheck2] = useState('');
  const [stopBit2, setStopBit2] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Update form with selected device data from DeviceStore
  const updateFormWithDevice = (dev: typeof devices[0] | undefined) => {
    if (dev) {
      setAddr1(dev.config.addr1.toString());
      setBaud1(dev.config.baud1.toString());
      setCheck1(dev.config.check1.toString());
      setStopBit1(dev.config.stopBit1.toString());
      setBaud2(dev.config.baud2.toString());
      setCheck2(dev.config.check2.toString());
      setStopBit2(dev.config.stopBit2.toString());
    } else {
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
    setConfigEditing(true);
    const unsubscribe = subscribeToDeviceUpdates((updatedDevices) => {
      setIsLoading(false);
      // Only update the device and form if the device list changes (e.g. device added/removed)
      // Do NOT update config fields if config changes from the server
      const selected =
        updatedDevices.find((d) => d.name === deviceId) ||
        updatedDevices.find((d) => d.id === deviceId) ||
        updatedDevices[0];
      // Only update if device is not set or deviceId changed (e.g. user selects a different device)
      if (!device || (selected && device.name !== selected.name)) {
        setDevice(selected);
        updateFormWithDevice(selected);
      }
      // Do NOT update config fields if config changes from the server
    });
    return () => {
      setConfigEditing(false);
      unsubscribe();
    };
  }, [deviceId]);

  // Update form when device changes
  useEffect(() => {
    updateFormWithDevice(device);
  }, [device]);

  // When device changes (from dropdown), update form fields
  const handleDeviceChange = (name: string) => {
    const found = devices.find((d) => d.name === name);
    setDevice(found);
    updateFormWithDevice(found);
  };

  const handleApply = () => {
    setConfigEditing(false);
    if (!device) {
      Alert.alert('Error', 'Device not found.');
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
    updateDeviceConfig(device.name, newConfig); // Use name as identifier for config update
    Alert.alert('Success', 'Configuration applied successfully!');
    navigation.goBack();
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Loading device...</Text>
      </View>
    );
  }
  if (!device) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Device not found.</Text>
      </View>
    );
  }
  return (
    <View style={tw`flex-1 bg-white pt-10`}>
      <Text style={tw`text-2xl font-bold text-center mb-5`}>Power Analyzer Configuration</Text>
      <ScrollView contentContainerStyle={tw`flex-grow p-5`}> 
        <View style={tw`flex-1`}>
          <ConfigCard
            label="Device"
            value={device?.name || ''}
            options={devices.map(d => ({ label: d.name, value: d.name }))}
            onChange={handleDeviceChange}
            disabled={devices.length === 0}
          />
          <ConfigCard
            label="Address (Addr1)"
            value={addr1}
            options={Array.from({ length: 247 }, (_, i) => ({ label: (i + 1).toString(), value: (i + 1).toString() }))}
            onChange={setAddr1}
            disabled={false}
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
            disabled={false}
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
            disabled={false}
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
            disabled={false}
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
            disabled={false}
          />
          <ConfigCard
            label="Check Digit 2 (Check2)"
            value={check2}
            options={[
              { label: '0 No check', value: '0' },
              { label: '1 Odd parity', value: '1' },
              { label: '2 Parity', value: '2' },
            ]}
            onChange={setCheck2}
            disabled={false}
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
            disabled={false}
          />
          <Pressable style={tw`bg-green-600 py-3 rounded mt-4 items-center`} onPress={handleApply}>
            <Text style={tw`text-white text-base`}>Apply Configuration</Text>
          </Pressable>
        </View>
      </ScrollView>
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