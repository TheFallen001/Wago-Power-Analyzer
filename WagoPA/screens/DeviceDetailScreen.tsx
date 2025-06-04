import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { RootParamList } from '../navigation/types';
import { devices, geocodeAddress, reverseGeocode } from '../utils/DeviceStore';
import tw from 'twrnc';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';

// Simulated voltage and consumption data for the graphs
const voltageData = [220, 221, 219, 222, 218, 220, 221, 223, 219, 220];
const consumptionData = [1.2, 1.4, 1.1, 1.5, 1.3, 1.6, 1.2, 1.7, 1.3, 1.5];

const DeviceDetailScreen = () => {
  const route = useRoute<RouteProp<RootParamList, 'DeviceDetail'>>();
  const navigation = useNavigation();
  const { deviceId } = route.params;
  const device = devices.find((d) => d.name === deviceId);

  // Address editing state
  const [address, setAddress] = useState(device?.address || '');
  const [isSaving, setIsSaving] = useState(false);
  const [location, setLocation] = useState({
    latitude: device?.latitude || 41.0,
    longitude: device?.longitude || 29.0,
  });
  const [region, setRegion] = useState<Region>({
    latitude: device?.latitude || 41.0,
    longitude: device?.longitude || 29.0,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  if (!device) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <Text>Device not found.</Text>
      </View>
    );
  }

  // Keep address and map in sync
  const handleSaveAddress = async () => {
    setIsSaving(true);
    const geo = await geocodeAddress(address);
    if (geo) {
      device.address = address;
      device.latitude = geo.latitude;
      device.longitude = geo.longitude;
      setLocation({ latitude: geo.latitude, longitude: geo.longitude });
      setRegion({ ...region, latitude: geo.latitude, longitude: geo.longitude });
      Alert.alert('Success', 'Address updated and location set.');
    } else {
      Alert.alert('Error', 'Could not find this address.');
    }
    setIsSaving(false);
  };

  // When user presses on the map, update address and marker
  const handleMapPress = async (e: any) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setLocation({ latitude, longitude });
    setRegion({ ...region, latitude, longitude });
    const addr = await reverseGeocode(latitude, longitude);
    if (addr) {
      setAddress(addr);
      device.address = addr;
      device.latitude = latitude;
      device.longitude = longitude;
      Alert.alert('Location Updated', 'Address and coordinates updated from map.');
    } else {
      Alert.alert('Error', 'Could not resolve address for this location.');
    }
  };

  // When address input changes, update the map marker after a short delay
  React.useEffect(() => {
    const timeout = setTimeout(async () => {
      if (address && address !== device.address) {
        const geo = await geocodeAddress(address);
        if (geo) {
          setLocation({ latitude: geo.latitude, longitude: geo.longitude });
          setRegion({ ...region, latitude: geo.latitude, longitude: geo.longitude });
        }
      }
    }, 600);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  return (
    <ScrollView style={tw`flex-1 bg-white`} contentContainerStyle={tw`p-5`}>
      <Text style={tw`text-2xl font-bold mb-2`}>{device.name}</Text>
      <Text style={tw`mb-1`}>ID: {device.id}</Text>
      <Text style={tw`mb-1`}>Address:</Text>
      <TextInput
        style={tw`border border-gray-300 rounded px-3 py-2 mb-2`}
        value={address}
        onChangeText={setAddress}
        placeholder="Enter address"
        editable={!isSaving}
      />
      <View style={tw`flex-row mb-2`}>
        <TouchableOpacity
          style={tw`bg-green-600 py-2 px-4 rounded items-center mr-2`}
          onPress={handleSaveAddress}
          disabled={isSaving}
        >
          <Text style={tw`text-white`}>{isSaving ? 'Saving...' : 'Save Address'}</Text>
        </TouchableOpacity>
      </View>
      <Text style={tw`mb-1`}>Or pick location on map:</Text>
      <View style={tw`my-2 bg-gray-100 rounded items-center overflow-hidden`}>
        <MapView
          provider={PROVIDER_GOOGLE}
          ref={undefined}
          style={{ width: '100%', height: 130 }}
          region={region}
          onPress={handleMapPress}
          pointerEvents={isSaving ? 'none' : 'auto'}
          onRegionChangeComplete={setRegion}
        >
          <Marker coordinate={location} />
        </MapView>
      </View>
      
      {/* Simulated Voltage Graph */}
      <View style={tw`my-5 bg-gray-100 p-4 rounded items-center`}>
        <Text style={tw`font-bold mb-2`}>Voltage Graph (Simulated)</Text>
        <View style={tw`flex-row items-end h-32 w-full justify-between`}>
          {voltageData.map((v, i) => (
            <View
              key={i}
              style={[
                tw`bg-green-600 rounded`,
                { height: (v - 215) * 6, width: 14 },
              ]}
            />
          ))}
        </View>
        <View style={tw`flex-row justify-between w-full mt-2`}>
          {voltageData.map((v, i) => (
            <Text key={i} style={tw`text-xs text-gray-500`}>{v}</Text>
          ))}
        </View>
      </View>
      <Text style={tw`mb-1`}>Voltage Range: {device.voltageRange}</Text>
      <Text style={tw`mb-1`}>Status: {device.status}</Text>
      {/* Simulated Consumption Graph */}
      <View style={tw`my-5 bg-gray-100 p-4 rounded items-center`}>
        <Text style={tw`font-bold mb-2`}>Consumption Graph (Simulated)</Text>
        <View style={tw`flex-row items-end h-32 w-full justify-between`}>
          {consumptionData.map((c, i) => (
            <View
              key={i}
              style={[
                tw`bg-blue-500 rounded`,
                { height: c * 60, width: 14 },
              ]}
            />
          ))}
        </View>
        <View style={tw`flex-row justify-between w-full mt-2`}>
          {consumptionData.map((c, i) => (
            <Text key={i} style={tw`text-xs text-gray-500`}>{c.toFixed(2)}</Text>
          ))}
        </View>
      </View>
      <Text style={tw`font-bold mb-1`}>Power Analyzer Info</Text>
      <Text style={tw`mb-1`}>Last Update: Simulated</Text>
      <Text style={tw`mb-1`}>Firmware Version: 1.0.0</Text>
      <Text style={tw`mb-1`}>Connection: WiFi</Text>
      <Text style={tw`mb-1`}>Location: {address}</Text>
      <TouchableOpacity
        style={tw`bg-green-600 py-2 rounded mt-5 items-center`}
        onPress={() => navigation.goBack()}
      >
        <Text style={tw`text-white`}>Back</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default DeviceDetailScreen;
