import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { LogItem } from "../screens/LogsScreen";
import { useNavigation } from "@react-navigation/native";
import tw from "twrnc";
import { Message } from "../screens/LogDetailsScreen";

interface LogItemProps {
  log: LogItem;
}

const LogItemComponent: React.FC<LogItemProps> = ({ log }) => {
  const navigation = useNavigation();

  const handleNavigation = () => {
    let parsedMessage: Message | null = null;
    try {
      const parsed = JSON.parse(log.messsage); // logs sometimes contain [ { ... } ]
      parsedMessage = Array.isArray(parsed) ? parsed[0] : parsed;
    } catch (e) {
      console.warn("Failed to parse messsage", e);
    }
    navigation.navigate("LogsDetailScreen", { log, parsedMessage });
  };
  return (
    <TouchableOpacity
      onPress={handleNavigation}
      style={tw`p-2 border-b border-gray-300`}
    >
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
});
export default LogItemComponent;
