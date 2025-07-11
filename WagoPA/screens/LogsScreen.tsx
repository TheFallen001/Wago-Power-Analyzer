import {
  View,
  Text,
  Button,
  TouchableOpacity,
  ActivityIndicatorBase,
  ActivityIndicator,
} from "react-native";
import tw from "twrnc";
import React, { useEffect, useState } from "react";
import { getLogs } from "../utils/DeviceStore";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import wdxHelper from "../utils/DeviceStore";
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

// interface LogResponse {
//   items: LogItem[];
//   total: number;
//   currentPage: number;
//   totalPages: number;
// }

const LogsScreen = () => {
  const [logs, setLogs] = useState<LogItem[]>([]);

  const [selectedDevice, setSelectedDevice] = useState("");
  const [loading, setLoading] = useState(false);

  const handleConfirm = () => {
    // useEffect(() => {
    setLoading(true);
    setLogs([]);
    console.log("Getting Logs...");

    getLogs(selectedDevice, (rawLogs) => {
      try {
        const parsed = JSON.parse(rawLogs);
        setLogs(parsed);
      } catch (e) {
        console.error("Parse error:", e);
      }
      setLoading(false);
    });

    // }, [setSelectedDevice]);
  };

  return (
    <View style={tw`relative flex-1 bg-white pt-10 px-5 gap-10`}>
      <Text style={tw`text-2xl font-bold text-center mb-5`}>Logs</Text>
      <DeviceDropdown
        devices={wdxHelper.devices}
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
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={5}
        />
      </View>
    </View>
  );
};

export default LogsScreen;
