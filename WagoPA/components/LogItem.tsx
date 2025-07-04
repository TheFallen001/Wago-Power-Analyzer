import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { LogItem } from "../screens/LogsScreen";

interface LogItemProps {
  log: LogItem;
}
// interface Message {
//   createdDate: number;
//   dataSourceOptions: {
//     database: null;
//     host: null;
//     id: number;
//     name: string;
//     password: null;
//     port: null;
//     type: null;
//     username: null;
//     uuid: string;
//   };
//   enabled: boolean;
//   executionOptions: {
//     id: number;
//     mode: string;
//     script: string;
//     uuid: string;
//   };
//   id: number;
//   ipcType: string;
//   logOptions: {
//     errorLogFile: string;
//     id: number;
//     level: string;
//     logFile: string;
//     mergeLog: boolean;
//     mergeLogFile: string;
//     uuid: string;
//   };
//   name: string;
//   namespace: string;
//   needsRestart: null;
//   order: number;
//   parentProcessId: number;
//   processId: number;
//   startTime: null;
//   status: string;
//   stopTime: null;
//   tcpOptions: {
//     id: number;
//     listenOpts: {
//       backlog: null;
//       exclusive: null;
//       host: string;
//       id: number;
//       ipv6Only: boolean;
//       path: null;
//       port: number;
//       readableAll: null;
//       uuid: string;
//       writableAll: null;
//     };
//     serverOpts: {
//       allowHalfOpen: null;
//       highWaterMark: null;
//       id: number;
//       keepAlive: null;
//       keepAliveInitialDelay: null;
//       noDelay: null;
//       pauseOnConnect: null;
//       uuid: string;
//     };
//     uuid: string;
//   };
//   threadId: number;
//   type: string;
//   udpOptions: {
//     id: number;
//     uuid: string;
//   };
//   updatedDate: number;
//   uuid: string;
// }

const LogItemComponent: React.FC<LogItemProps> = ({ log }) => {
  return (
    <TouchableOpacity>
      <View style={styles.container}>
        <Text style={styles.title}>{log.title}</Text>
        <Text style={styles.date}>{log.date.date}</Text>
        <Text
          style={[
            styles.level,
            log.level === "error"
              ? { color: "red" }
              : log.level === "info"
              ? { color: "blue" }
              : log.level === "debug"
              ? { color: "green" }
              : { color: "black" },
          ]}
        >
          Level: {log.level}
        </Text>
        <Text style={styles.channel}>Channel: {log.channel}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 10,
  },
  loadingContainer: {
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
  },
  date: {
    color: "#666",
    fontSize: 12,
  },
  level: {
    fontSize: 14,
  },
  channel: {
    fontSize: 14,
  },
  detail: {
    fontSize: 14,
    color: "#333",
  },
});
export default LogItemComponent;
