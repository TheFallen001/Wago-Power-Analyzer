import React from 'react';
import { View, Text, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { devices } from '../utils/DeviceStore';
import { RootParamList } from '../navigation/types';
import tw from 'twrnc';

const DevicesScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootParamList>>();

  const renderDeviceItem = ({ item }: { item: typeof devices[0] }) => (
    <View style={tw`bg-gray-100 p-4 mb-3 rounded`}>
      <Text style={tw`text-lg font-bold mb-1`}>{item.name}</Text>
      <Text>Latitude: {item.latitude}</Text>
      <Text>Longitude: {item.longitude}</Text>
      <Text>Voltage Range: {item.voltageRange}</Text>
      <Text>Status: {item.status}</Text>
      <TouchableOpacity
        style={tw`bg-green-600 py-2 rounded mt-2 items-center`}
        onPress={() => navigation.navigate('Configure', { deviceId: item.name })}
      >
        <Text style={tw`text-white`}>Configure</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={tw`flex-1 bg-white pt-10`}>
      <Text style={tw`text-2xl font-bold text-center mb-5`}>Power Analyzers</Text>
      <ScrollView contentContainerStyle={tw`px-5 pb-10`}>
        <FlatList
          data={devices}
          renderItem={renderDeviceItem}
          keyExtractor={(item) => item.name}
          scrollEnabled={false}
        />
      </ScrollView>
    </View>
  );
};

export default DevicesScreen;