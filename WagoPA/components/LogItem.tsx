import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, ActivityIndicator } from "react-native";
import { LogItem } from "../screens/LogsScreen";

interface LogItemProps {
  log: LogItem;
}
interface Message {
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

const LogItemComponent: React.FC<LogItemProps> = ({ log }) => {
  const [parsedMessage, setParsedMessage] = useState<Message>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const parseMessage = async () => {
      try {
        const message: Message = JSON.parse(log.messsage)[0] || {};
        if (isMounted) setParsedMessage(message);
      } catch (error) {
        console.warn("Invalid JSON in message:", log.messsage);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    parseMessage();

    return () => {
      isMounted = false;
    };
  }, [log]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#007aff" />
        <Text>Loading log...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{log.title}</Text>
      <Text style={styles.date}>{log.date.date}</Text>
      <Text style={styles.level}>Level: {log.level}</Text>
      <Text style={styles.channel}>Channel: {log.channel}</Text>

      {parsedMessage?.createdDate && (
        <Text style={styles.detail}>
          Created Date: {parsedMessage.createdDate}
        </Text>
      )}
      {parsedMessage?.dataSourceOptions?.database && (
        <Text style={styles.detail}>
          Database: {parsedMessage.dataSourceOptions.database}
        </Text>
      )}
      {parsedMessage?.dataSourceOptions?.host && (
        <Text style={styles.detail}>
          Host: {parsedMessage.dataSourceOptions.host}
        </Text>
      )}
      {parsedMessage?.dataSourceOptions?.id && (
        <Text style={styles.detail}>
          Data Source ID: {parsedMessage.dataSourceOptions.id}
        </Text>
      )}
      {parsedMessage?.dataSourceOptions?.name && (
        <Text style={styles.detail}>
          Data Source Name: {parsedMessage.dataSourceOptions.name}
        </Text>
      )}
      {parsedMessage?.dataSourceOptions?.password && (
        <Text style={styles.detail}>
          Password: {parsedMessage.dataSourceOptions.password}
        </Text>
      )}
      {parsedMessage?.dataSourceOptions?.port && (
        <Text style={styles.detail}>
          Port: {parsedMessage.dataSourceOptions.port}
        </Text>
      )}
      {parsedMessage?.dataSourceOptions?.type && (
        <Text style={styles.detail}>
          Type: {parsedMessage.dataSourceOptions.type}
        </Text>
      )}
      {parsedMessage?.dataSourceOptions?.username && (
        <Text style={styles.detail}>
          Username: {parsedMessage.dataSourceOptions.username}
        </Text>
      )}
      {parsedMessage?.dataSourceOptions?.uuid && (
        <Text style={styles.detail}>
          Data Source UUID: {parsedMessage.dataSourceOptions.uuid}
        </Text>
      )}
      {parsedMessage?.enabled && (
        <Text style={styles.detail}>
          Enabled: {parsedMessage.enabled.toString()}
        </Text>
      )}
      {parsedMessage?.executionOptions?.id && (
        <Text style={styles.detail}>
          Execution ID: {parsedMessage.executionOptions.id}
        </Text>
      )}
      {parsedMessage?.executionOptions?.mode && (
        <Text style={styles.detail}>
          Mode: {parsedMessage.executionOptions.mode}
        </Text>
      )}
      {parsedMessage?.executionOptions?.script && (
        <Text style={styles.detail}>
          Script: {parsedMessage.executionOptions.script}
        </Text>
      )}
      {parsedMessage?.executionOptions?.uuid && (
        <Text style={styles.detail}>
          Execution UUID: {parsedMessage.executionOptions.uuid}
        </Text>
      )}
      {parsedMessage?.id && (
        <Text style={styles.detail}>ID: {parsedMessage.id}</Text>
      )}
      {parsedMessage?.ipcType && (
        <Text style={styles.detail}>IPC Type: {parsedMessage.ipcType}</Text>
      )}
      {parsedMessage?.logOptions?.errorLogFile && (
        <Text style={styles.detail}>
          Error Log File: {parsedMessage.logOptions.errorLogFile}
        </Text>
      )}
      {parsedMessage?.logOptions?.id && (
        <Text style={styles.detail}>Log ID: {parsedMessage.logOptions.id}</Text>
      )}
      {parsedMessage?.logOptions?.level && (
        <Text style={styles.detail}>
          Log Level: {parsedMessage.logOptions.level}
        </Text>
      )}
      {parsedMessage?.logOptions?.logFile && (
        <Text style={styles.detail}>
          Log File: {parsedMessage.logOptions.logFile}
        </Text>
      )}
      {parsedMessage?.logOptions?.mergeLog && (
        <Text style={styles.detail}>
          Merge Log: {parsedMessage.logOptions.mergeLog.toString()}
        </Text>
      )}
      {parsedMessage?.logOptions?.mergeLogFile && (
        <Text style={styles.detail}>
          Merge Log File: {parsedMessage.logOptions.mergeLogFile}
        </Text>
      )}
      {parsedMessage?.logOptions?.uuid && (
        <Text style={styles.detail}>
          Log UUID: {parsedMessage.logOptions.uuid}
        </Text>
      )}
      {parsedMessage?.name && (
        <Text style={styles.detail}>Name: {parsedMessage.name}</Text>
      )}
      {parsedMessage?.namespace && (
        <Text style={styles.detail}>Namespace: {parsedMessage.namespace}</Text>
      )}
      {parsedMessage?.needsRestart && (
        <Text style={styles.detail}>
          Needs Restart: {parsedMessage.needsRestart}
        </Text>
      )}
      {parsedMessage?.order && (
        <Text style={styles.detail}>Order: {parsedMessage.order}</Text>
      )}
      {parsedMessage?.parentProcessId && (
        <Text style={styles.detail}>
          Parent Process ID: {parsedMessage.parentProcessId}
        </Text>
      )}
      {parsedMessage?.processId && (
        <Text style={styles.detail}>Process ID: {parsedMessage.processId}</Text>
      )}
      {parsedMessage?.startTime && (
        <Text style={styles.detail}>Start Time: {parsedMessage.startTime}</Text>
      )}
      {parsedMessage?.status && (
        <Text style={styles.detail}>Status: {parsedMessage.status}</Text>
      )}
      {parsedMessage?.stopTime && (
        <Text style={styles.detail}>Stop Time: {parsedMessage.stopTime}</Text>
      )}
      {parsedMessage?.tcpOptions?.id && (
        <Text style={styles.detail}>TCP ID: {parsedMessage.tcpOptions.id}</Text>
      )}
      {parsedMessage?.tcpOptions?.listenOpts?.backlog && (
        <Text style={styles.detail}>
          Backlog: {parsedMessage.tcpOptions.listenOpts.backlog}
        </Text>
      )}
      {parsedMessage?.tcpOptions?.listenOpts?.exclusive && (
        <Text style={styles.detail}>
          Exclusive: {parsedMessage.tcpOptions.listenOpts.exclusive}
        </Text>
      )}
      {parsedMessage?.tcpOptions?.listenOpts?.host && (
        <Text style={styles.detail}>
          Host: {parsedMessage.tcpOptions.listenOpts.host}
        </Text>
      )}
      {parsedMessage?.tcpOptions?.listenOpts?.id && (
        <Text style={styles.detail}>
          Listen ID: {parsedMessage.tcpOptions.listenOpts.id}
        </Text>
      )}
      {parsedMessage?.tcpOptions?.listenOpts?.ipv6Only && (
        <Text style={styles.detail}>
          IPv6 Only: {parsedMessage.tcpOptions.listenOpts.ipv6Only.toString()}
        </Text>
      )}
      {parsedMessage?.tcpOptions?.listenOpts?.path && (
        <Text style={styles.detail}>
          Path: {parsedMessage.tcpOptions.listenOpts.path}
        </Text>
      )}
      {parsedMessage?.tcpOptions?.listenOpts?.port && (
        <Text style={styles.detail}>
          Port: {parsedMessage.tcpOptions.listenOpts.port}
        </Text>
      )}
      {parsedMessage?.tcpOptions?.listenOpts?.readableAll && (
        <Text style={styles.detail}>
          Readable All: {parsedMessage.tcpOptions.listenOpts.readableAll}
        </Text>
      )}
      {parsedMessage?.tcpOptions?.listenOpts?.uuid && (
        <Text style={styles.detail}>
          Listen UUID: {parsedMessage.tcpOptions.listenOpts.uuid}
        </Text>
      )}
      {parsedMessage?.tcpOptions?.listenOpts?.writableAll && (
        <Text style={styles.detail}>
          Writable All: {parsedMessage.tcpOptions.listenOpts.writableAll}
        </Text>
      )}
      {parsedMessage?.tcpOptions?.serverOpts?.allowHalfOpen && (
        <Text style={styles.detail}>
          Allow Half Open: {parsedMessage.tcpOptions.serverOpts.allowHalfOpen}
        </Text>
      )}
      {parsedMessage?.tcpOptions?.serverOpts?.highWaterMark && (
        <Text style={styles.detail}>
          High Water Mark: {parsedMessage.tcpOptions.serverOpts.highWaterMark}
        </Text>
      )}
      {parsedMessage?.tcpOptions?.serverOpts?.id && (
        <Text style={styles.detail}>
          Server ID: {parsedMessage.tcpOptions.serverOpts.id}
        </Text>
      )}
      {parsedMessage?.tcpOptions?.serverOpts?.keepAlive && (
        <Text style={styles.detail}>
          Keep Alive: {parsedMessage.tcpOptions.serverOpts.keepAlive}
        </Text>
      )}
      {parsedMessage?.tcpOptions?.serverOpts?.keepAliveInitialDelay && (
        <Text style={styles.detail}>
          Keep Alive Initial Delay:{" "}
          {parsedMessage.tcpOptions.serverOpts.keepAliveInitialDelay}
        </Text>
      )}
      {parsedMessage?.tcpOptions?.serverOpts?.noDelay && (
        <Text style={styles.detail}>
          No Delay: {parsedMessage.tcpOptions.serverOpts.noDelay}
        </Text>
      )}
      {parsedMessage?.tcpOptions?.serverOpts?.pauseOnConnect && (
        <Text style={styles.detail}>
          Pause On Connect: {parsedMessage.tcpOptions.serverOpts.pauseOnConnect}
        </Text>
      )}
      {parsedMessage?.tcpOptions?.serverOpts?.uuid && (
        <Text style={styles.detail}>
          Server UUID: {parsedMessage.tcpOptions.serverOpts.uuid}
        </Text>
      )}
      {parsedMessage?.tcpOptions?.uuid && (
        <Text style={styles.detail}>
          TCP UUID: {parsedMessage.tcpOptions.uuid}
        </Text>
      )}
      {parsedMessage?.threadId && (
        <Text style={styles.detail}>Thread ID: {parsedMessage.threadId}</Text>
      )}
      {parsedMessage?.type && (
        <Text style={styles.detail}>Type: {parsedMessage.type}</Text>
      )}
      {parsedMessage?.udpOptions?.id && (
        <Text style={styles.detail}>UDP ID: {parsedMessage.udpOptions.id}</Text>
      )}
      {parsedMessage?.udpOptions?.uuid && (
        <Text style={styles.detail}>
          UDP UUID: {parsedMessage.udpOptions.uuid}
        </Text>
      )}
      {parsedMessage?.updatedDate && (
        <Text style={styles.detail}>
          Updated Date: {parsedMessage.updatedDate}
        </Text>
      )}
      {parsedMessage?.uuid && (
        <Text style={styles.detail}>UUID: {parsedMessage.uuid}</Text>
      )}
      {/* {parsedMessage. && (
        <Text style={styles.detail}>
          Created Date: {parsedMessage.createdDate}
        </Text>
      )} */}
    </View>
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
