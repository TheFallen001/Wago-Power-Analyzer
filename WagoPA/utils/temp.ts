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






// // --- Export helpers for use in DeviceStore.ts and elsewhere ---
// export { validDevicePaths, devicePathMap };

// // --- VirtualDeviceStore: All Virtual device logic separated from DeviceStore ---


