/**
 * @description These are all the functions i havent found use for. ill update them accordingly.
 */

// // VirtualDeviceStore.ts
// // Contains all logic and functions related to Virtual device instances (path: Virtual)

// // --- Virtual Device Path Helpers ---



// export function setVirtualDevicePaths(devices: { name: string }[]) {
//   validDevicePaths = new Set();
//   devicePathMap = {};
//   devices.forEach((device) => {
//     const deviceName = device.name;
//     validDevicePaths.add(`Virtual.${deviceName}.volt`);
//     validDevicePaths.add(`Virtual.${deviceName}.curr`);
//     validDevicePaths.add(`Virtual.${deviceName}.addr1`);
//     validDevicePaths.add(`Virtual.${deviceName}.baud1`);
//     validDevicePaths.add(`Virtual.${deviceName}.baud2`);
//     validDevicePaths.add(`Virtual.${deviceName}.check1`);
//     validDevicePaths.add(`Virtual.${deviceName}.check2`);
//     validDevicePaths.add(`Virtual.${deviceName}.stopBit1`);
//     validDevicePaths.add(`Virtual.${deviceName}.stopBit2`);
//     devicePathMap[deviceName] = `Virtual.${deviceName}`;
//   });
// }

// export function getVirtualDevicePath(deviceName: string) {
//   return devicePathMap[deviceName];
// }

// export function isVirtualDevicePath(path: string) {
//   return path.startsWith("Virtual.");
// }



// // --- Virtual Device Value Generation ---
// function randomInRange(min: number, max: number) {
//   return Math.random() * (max - min) + min;
// }

// export function generateVirtualDeviceValues(device: Device, index: number) {
//   const deviceVolt = Math.round(
//     randomInRange(VOLTAGE_RANGE.min, VOLTAGE_RANGE.max) + index * 2
//   );
//   const deviceCurr =
//     Math.round(randomInRange(CURRENT_RANGE.min, CURRENT_RANGE.max) * 100) /
//       100 +
//     index * 0.1;
//   return { deviceVolt, deviceCurr };
// }

// // --- Virtual Device Alarm Check ---
// export function checkVirtualDeviceAlarms(
//   deviceVolt: number,
//   deviceCurr: number
// ) {
//   let alarm = false;
//   if (
//     deviceVolt < VOLTAGE_ALARM_RANGE.min ||
//     deviceVolt > VOLTAGE_ALARM_RANGE.max
//   )
//     alarm = true;
//   if (
//     deviceCurr < CURRENT_ALARM_RANGE.min ||
//     deviceCurr > CURRENT_ALARM_RANGE.max
//   )
//     alarm = true;
//   return alarm;
// }

// // --- Export helpers for use in DeviceStore.ts and elsewhere ---
// export { validDevicePaths, devicePathMap };

// // --- VirtualDeviceStore: All Virtual device logic separated from DeviceStore ---


