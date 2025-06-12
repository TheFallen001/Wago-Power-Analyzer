// WebSocket client for WagoPA intermediary server
// Usage: import { useWagoWebSocket } from './useWagoWebSocket';
import { useEffect, useRef } from "react";

export function useWagoWebSocket({ onSchema, onData, onLogs }:{
  onSchema?: (schema: any) => void,
  onData?: (data: any) => void,
  onLogs?: (logs: any) => void,
}) {
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket("ws://192.168.31.214:8080");
    wsRef.current = ws;
    ws.onopen = () => {
      // console.log("WebSocket connected");
    };
    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === "schema" && onSchema) onSchema(msg.devices);
        if (msg.type === "data" && onData) onData(msg);
        if (msg.type === "updateLogs" && onLogs) onLogs(msg.logs);
      } catch {}
    };
    ws.onerror = (e) => {
      // console.error("WebSocket error", e);
    };
    ws.onclose = () => {
      // Optionally: reconnect logic
    };
    return () => ws.close();
  }, [onSchema, onData, onLogs]);

  // Send message helper
  const send = (msg: any) => {
    if (wsRef.current && wsRef.current.readyState === 1) {
      wsRef.current.send(JSON.stringify(msg));
    }
  };

  return { send };
}
