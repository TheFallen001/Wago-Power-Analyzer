export type RootParamList = {
  SplashScreen: undefined;
  MainTabs: undefined;
  Configure: { deviceId?: string }; // Make deviceId optional
  DeviceDetail: { deviceId: string }; // Add DeviceDetail route
  LogsScreen: undefined;
  AlarmScreen: undefined; // Add AlarmScreen route
};