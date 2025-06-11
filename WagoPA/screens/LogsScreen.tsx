import { View, Text, Button, TouchableOpacity } from "react-native";
import tw from "twrnc";
import React, { useEffect, useState } from "react";
import { getLogs } from "../utils/DeviceStore";
import { ScrollView } from "react-native-gesture-handler";
import { devices, logData } from "../utils/DeviceStore";
import DeviceDropdown from "../components/DropDownMenu";

const LogsScreen = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [selectedDevice, setSelectedDevice] = useState("");

  const handleConfirm = () => {
    
    // useEffect(() => {
      console.log("Getting Logs...");
      getLogs(selectedDevice);
    // }, [setSelectedDevice]);
  };

  useEffect(() => {
    if (logData) {
      setLogs((prevLogs) => [...prevLogs, logData]);
    }
  }, [logData]);

  return (
    <View style={tw`relative flex-1 bg-white pt-10 px-5 gap-10`}>
      <Text style={tw`text-2xl font-bold text-center mb-5`}>Logs</Text>
      <DeviceDropdown
        devices={devices}
        selectedDevice={selectedDevice}
        onChange={(value) => setSelectedDevice(value)}
      />

      <TouchableOpacity style={tw`bg-green-500 px-4 py-2 rounded-lg items-center`} onPress={handleConfirm}>
        <Text>Confirm</Text>
      </TouchableOpacity>
      <View style={tw`flex p-16 bg-gray-100 rounded-2xl h-60`}>
        <ScrollView style={tw`flex-1`}>
          {logs}
        </ScrollView>
      </View>
    </View>
  );
};

export default LogsScreen;
