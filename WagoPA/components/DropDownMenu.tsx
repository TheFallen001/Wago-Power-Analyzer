import RNPickerSelect from 'react-native-picker-select';
import { View, Text } from 'react-native';
import tw from 'twrnc'; // Tailwind if you're using `twrnc`
import { Device } from '../utils/DeviceStore';
import React from 'react';

interface DropDownMenuProps {
    devices: Device[];
    selectedDevice: string | null;
    onChange:(value: any) => void;
    
}
export default function DeviceDropdown({ devices, selectedDevice, onChange }: DropDownMenuProps) {



  return (
    <View style={tw`mb-4`}>
      <Text style={tw`mb-2 text-gray-700`}>Select Device:</Text>

      <RNPickerSelect
        onValueChange={onChange}
        value={selectedDevice}
        items={devices.map((device) => ({
          label: device.name,
          value: device.name,
        }))}
        placeholder={{ label: 'Select a device...', value: null }}
        style={{
          inputIOS: {
            padding: 10,
            backgroundColor: '#f0f0f0',
            borderRadius: 10,
            fontSize: 16,
          },
          inputAndroid: {
            padding: 10,
            backgroundColor: '#f0f0f0',
            borderRadius: 10,
            fontSize: 16,
          },
        }}
      />
    </View>
  );
}
