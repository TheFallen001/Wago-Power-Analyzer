import { View, Text, ScrollView } from "react-native";
import React from "react";
import { RouteProp, useRoute } from "@react-navigation/native";
import { LogItem } from "./LogsScreen"; // adjust path as needed
import tw from "twrnc";

export interface Message {
  createdDate: number;
  dataSourceOptions: {
    database: null;
    host: null;
    id: number;
    name: string;
    password: null;
    port: null;
    type: null;
    username: null;
    uuid: string;
  };
  enabled: boolean;
  executionOptions: {
    id: number;
    mode: string;
    script: string;
    uuid: string;
  };
  id: number;
  ipcType: string;
  logOptions: {
    errorLogFile: string;
    id: number;
    level: string;
    logFile: string;
    mergeLog: boolean;
    mergeLogFile: string;
    uuid: string;
  };
  name: string;
  namespace: string;
  needsRestart: null;
  order: number;
  parentProcessId: number;
  processId: number;
  startTime: null;
  status: string;
  stopTime: null;
  tcpOptions: {
    id: number;
    listenOpts: {
      backlog: null;
      exclusive: null;
      host: string;
      id: number;
      ipv6Only: boolean;
      path: null;
      port: number;
      readableAll: null;
      uuid: string;
      writableAll: null;
    };
    serverOpts: {
      allowHalfOpen: null;
      highWaterMark: null;
      id: number;
      keepAlive: null;
      keepAliveInitialDelay: null;
      noDelay: null;
      pauseOnConnect: null;
      uuid: string;
    };
    uuid: string;
  };
  threadId: number;
  type: string;
  udpOptions: {
    id: number;
    uuid: string;
  };
  updatedDate: number;
  uuid: string;
}


type LogsDetailRouteProp = RouteProp<{ LogsDetailScreen: {log:LogItem,  parsedMessage: Message | null } }, "LogsDetailScreen">;

const LogsDetailScreen = () => {
  const route = useRoute<LogsDetailRouteProp>();
  const { log, parsedMessage } = route.params;

  return (
    <ScrollView style={tw`pt-10 pl-5 pr-5 bg-white flex-1`}>
      <Text style={tw`text-2xl font-bold mb-10 justify-center mt-10`}>{log.title}</Text>
      <Text style={tw`text-gray-600 mb-1`}>Timestamp: {log.date.timestamp}</Text>
      <Text style={tw`text-gray-600 mb-1`}>Date: {log.date.date}</Text>
      <Text style={tw`text-gray-600 mb-1`}>Level: {log.level}</Text>
      <Text style={tw`text-gray-600 mb-1`}>Channel: {log.channel}</Text>
      <Text style={tw`text-gray-600 mb-1`}>Instance UUID: {log.instanceUuid}</Text>
      <Text style={tw`text-gray-800 mt-4`}>Message:</Text>
      <Text style={tw`text-sm text-gray-900 bg-gray-100 p-3 rounded`}>
        {parsedMessage ? JSON.stringify(parsedMessage, null, 2) : "No message data"}
      </Text>
    </ScrollView>
  );
};

export default LogsDetailScreen;
