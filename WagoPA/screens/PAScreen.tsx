import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { devices } from '../utils/DeviceStore';
import { RootParamList } from '../navigation/types';

const DevicesScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootParamList>>();

  const renderDeviceItem = ({ item }: { item: typeof devices[0] }) => (
    <View style={styles.item}>
      <Text style={styles.name}>{item.name}</Text>
      <Text>Latitude: {item.latitude}</Text>
      <Text>Longitude: {item.longitude}</Text>
      <Text>Voltage Range: {item.voltageRange}</Text>
      <Text>Status: {item.status}</Text>
      <TouchableOpacity
        style={styles.configureButton}
        onPress={() => navigation.navigate('Configure', { deviceId: item.id })}
      >
        <Text style={styles.configureButtonText}>Configure</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Power Analyzers</Text>
      <FlatList
        data={devices}
        renderItem={renderDeviceItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
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
  list: {
    paddingBottom: 20,
  },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#f9f9f9',
    marginBottom: 10,
    borderRadius: 5,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  configureButton: {
    backgroundColor: '#6CBB3C',
    padding: 5,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  configureButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
});

export default DevicesScreen;