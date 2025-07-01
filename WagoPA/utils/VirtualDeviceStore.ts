// --- Virtual Device Simulation Ranges ---
export const VOLTAGE_RANGE = { min: 215, max: 240 };
export const CURRENT_RANGE = { min: 0, max: 2.0 };
export const VOLTAGE_ALARM_RANGE = { min: 215, max: 236 };
export const CURRENT_ALARM_RANGE = { min: 0, max: 1.6 };

// --- Virtual Device Chart Data Buffers ---
export let voltageChartDataMap: { [deviceId: string]: number[] } = {};
export let currentChartDataMap: { [deviceId: string]: number[] } = {};