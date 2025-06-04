import { View, Text } from "react-native";
import tw from "twrnc";
import React, { useEffect, useState } from "react";
import { getLogs } from "../utils/DeviceStore";
import { ScrollView } from "react-native-gesture-handler";

const LogsScreen = () => {
  const [logs, setLogs] = useState<string[]>(["List is empty"]);

  useEffect(() => {
    console.log("Getting Logs...");
    setLogs(getLogs());
    console.log(getLogs());
  }, []);

  return (
    <View style={tw`relative flex-1 bg-white pt-10 px-5 gap-10`}>
      <Text style={tw`text-2xl font-bold text-center mb-5`}>Logs</Text>
      <View style={tw`flex p-16 bg-gray-100 rounded-2xl h-60`}>
        <ScrollView style={tw`flex-1`}>
          {logs.length === 0 ? (
            <Text style={tw`text-sm mb-2 text-gray-800`}>
              {"No Logs Received"}
            </Text>
          ) : (
            logs.map((log, index) => (
              <Text key={index} style={tw`text-sm mb-2 text-gray-800`}>
                • {log}
              </Text>
            ))
          )}
        </ScrollView>
      </View>
    </View>
  );
};

export default LogsScreen;
