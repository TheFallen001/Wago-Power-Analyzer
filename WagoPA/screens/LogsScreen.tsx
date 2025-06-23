import { View, Text, Button, TouchableOpacity } from "react-native";
import tw from "twrnc";
import React, { useEffect, useState } from "react";
import { getLogs } from "../utils/VirtualDeviceStore";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import { devices, logData } from "../utils/VirtualDeviceStore";
import DeviceDropdown from "../components/DropDownMenu";
import LogItemComponent from "../components/LogItem";

export interface LogItem {
  level: string;
  date: {
    timestamp: number;
    date: string;
  };
  channel: string;
  title: string;
  messsage: string; 
  instanceUuid: string;
}

interface LogResponse {
  items: LogItem[];
  total: number;
  currentPage: number;
  totalPages: number;
}

const LogsScreen = () => {
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [selectedDevice, setSelectedDevice] = useState("");

  const handleConfirm = () => {
    // useEffect(() => {
    console.log("Getting Logs...");
    getLogs(selectedDevice);
    // }, [setSelectedDevice]);
  };

  useEffect(() => {
    try {
      if (logData.length > 0) {
        const data: LogResponse = JSON.parse(logData);
        setLogs(data.items);
      }
    } catch (e) {
      console.error("Error:", e);
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

      <TouchableOpacity
        style={tw`bg-green-500 px-4 py-2 rounded-lg items-center`}
        onPress={handleConfirm}
      >
        <Text>Confirm</Text>
      </TouchableOpacity>
      <View style={tw`flex bg-gray-100 rounded-2xl h-110`}>
        <FlatList
        data={logs}
        keyExtractor={(item, index) => `${item.date.timestamp}-${index}`}
        renderItem={({ item }) => <LogItemComponent log={item} />}
        />
      </View>
      
    </View>
  );
};

export default LogsScreen;
