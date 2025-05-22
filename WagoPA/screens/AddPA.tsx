import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { addDevice } from '../utils/DeviceStore';

const AddDeviceScreen = () => {
  const [name, setName] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [voltageRange, setVoltageRange] = useState('');
  const [status, setStatus] = useState('Active');

  const handleAddDevice = () => {
    if (!name || !latitude || !longitude) {
      Alert.alert('Error', 'Please fill in all required fields (Name, Latitude, Longitude).');
      return;
    }

    const newDevice = {
      id: Date.now().toString(),
      name,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      voltageRange,
      status,
      config: {
        addr1: 1, // Default value
        baud1: 9600, // Default value
        check1: 2, // Default: Parity
        stopBit1: 1, // Default: 1.5 stop bit
        baud2: 57600, // Default value
        check2: 2, // Default: Parity
        stopBit2: 1, // Default: 1.5 stop bit
      },
    };

    addDevice(newDevice);
    Alert.alert('Success', `Device "${name}" added successfully!`);

    // Reset form
    setName('');
    setLatitude('');
    setLongitude('');
    setVoltageRange('');
    setStatus('Active');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add a New Power Analyzer</Text>

      <Text style={styles.label}>Device Name *</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Enter device name"
      />

      <Text style={styles.label}>Latitude *</Text>
      <TextInput
        style={styles.input}
        value={latitude}
        onChangeText={setLatitude}
        placeholder="e.g., 41.0082 (Istanbul)"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Longitude *</Text>
      <TextInput
        style={styles.input}
        value={longitude}
        onChangeText={setLongitude}
        placeholder="e.g., 28.9784 (Istanbul)"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Voltage Range (Optional)</Text>
      <TextInput
        style={styles.input}
        value={voltageRange}
        onChangeText={setVoltageRange}
        placeholder="e.g., 220-240V"
      />

      <Text style={styles.label}>Status</Text>
      <View style={styles.statusContainer}>
        <Button
          title="Active"
          onPress={() => setStatus('Active')}
          color={status === 'Active' ? '#28a745' : '#ccc'}
        />
        <Button
          title="Inactive"
          onPress={() => setStatus('Inactive')}
          color={status === 'Inactive' ? '#FF2400' : '#ccc'}
        />
      </View>

      <Button title="Add Device" onPress={handleAddDevice} color="#28a745" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 40,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
});

export default AddDeviceScreen;