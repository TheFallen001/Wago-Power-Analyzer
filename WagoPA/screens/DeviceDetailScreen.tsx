import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { RootParamList } from '../navigation/types';
import { devices } from '../utils/DeviceStore';
import tw from 'twrnc';

// Simulated voltage data for the graph
const voltageData = [220, 221, 219, 222, 218, 220, 221, 223, 219, 220];

const DeviceDetailScreen = () => {
  const route = useRoute<RouteProp<RootParamList, 'DeviceDetail'>>();
  const navigation = useNavigation();
  const { deviceId } = route.params;
  const device = devices.find((d) => d.name === deviceId);

  if (!device) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <Text>Device not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={tw`flex-1 bg-white`} contentContainerStyle={tw`p-5`}>
      <Text style={tw`text-2xl font-bold mb-2`}>{device.name}</Text>
      <Text style={tw`mb-1`}>ID: {device.id}</Text>
      <Text style={tw`mb-1`}>Latitude: {device.latitude}</Text>
      <Text style={tw`mb-1`}>Longitude: {device.longitude}</Text>
      <Text style={tw`mb-1`}>Voltage Range: {device.voltageRange}</Text>
      <Text style={tw`mb-1`}>Status: {device.status}</Text>
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
      {/* More Info */}
      <Text style={tw`font-bold mb-1`}>Power Analyzer Info</Text>
      <Text style={tw`mb-1`}>Last Update: Simulated</Text>
      <Text style={tw`mb-1`}>Firmware Version: 1.0.0</Text>
      <Text style={tw`mb-1`}>Connection: WiFi</Text>
      <Text style={tw`mb-1`}>Location: {device.latitude}, {device.longitude}</Text>
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
