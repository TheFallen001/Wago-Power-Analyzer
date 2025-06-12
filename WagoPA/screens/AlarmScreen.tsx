import React, { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import tw from "twrnc";
import Icon from "react-native-vector-icons/FontAwesome";
import { devices, subscribeToAlarms } from "../utils/DeviceStore";

interface AlarmHistoryItem {
  id: string;
  device: string;
  message: string;
  timestamp: string;
}

const AlarmScreen = () => {
  const [alarmHistory, setAlarmHistory] = useState<AlarmHistoryItem[]>([]);

  useEffect(() => {
    // Listen for alarms and add to history only if value or type changed for the device
    let lastAlarmMap: { [key: string]: { type: string; value: number } } = {};
    const unsub = subscribeToAlarms((alarm) => {
      const key = alarm.deviceName + "-" + alarm.type;
      const last = lastAlarmMap[key];
      // Only add to history if value or type changed
      if (!last || last.value !== alarm.value) {
        lastAlarmMap[key] = { type: alarm.type, value: alarm.value };
        const now = new Date();
        setAlarmHistory((prev) => [
          {
            id: now.getTime().toString() + Math.random().toString(36).slice(2), // Ensure unique key
            device: alarm.deviceName || "Unknown Device",
            message:
              alarm.type === "volt"
                ? `Voltage out of range: ${alarm.value}`
                : `Current out of range: ${alarm.value}`,
            timestamp: now.toLocaleString(),
          },
          ...prev,
        ]);
      }
    });
    return () => unsub();
  }, []);

  return (
    <View style={tw`flex-1 bg-white pt-10 px-5`}>
      <Text style={tw`text-2xl font-bold text-center mb-5`}>Alarm History</Text>
      <FlatList
        data={alarmHistory}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={tw`flex-row items-center bg-gray-100 rounded-2xl p-4 mb-3`}>
            <Icon name="bell" size={30} color="#e53e3e" style={tw`mr-4`} />
            <View style={tw`flex-1`}>
              <Text style={tw`font-bold text-lg`}>{item.device}</Text>
              <Text style={tw`text-md text-gray-700`}>{item.message}</Text>
              <Text style={tw`text-xs text-gray-500 mt-1`}>{item.timestamp}</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={tw`text-center text-gray-400 mt-10`}>No alarms yet.</Text>}
      />
    </View>
  );
};

export default AlarmScreen;
