import 'dotenv/config';

export default {
  expo: {
    name: 'WagoPA',
    slug: 'WagoPA',
    version: '1.0.0',
    orientation: 'portrait',
    jsEngine: 'jsc',
    icon: './assets/logo-wago.jpg',
    userInterfaceStyle: 'light',
    newArchEnabled: true,
    splash: {
      image: './assets/logo-wago.jpg',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    ios: {
      supportsTablet: true,
      infoPlist: {
        NSCameraUsageDescription: 'Allow $(PRODUCT_NAME) to access your camera',
        NSMicrophoneUsageDescription: 'Allow $(PRODUCT_NAME) to access your microphone',
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/logo-wago.jpg',
        backgroundColor: '#ffffff',
      },
      edgeToEdgeEnabled: true,
      permissions: ['android.permission.CAMERA'],
      package: 'com.anonymous.WagoPA',
    },
    web: {
      favicon: './assets/logo-wago.jpg',
    },
    plugins: ['expo-barcode-scanner'],
    extra: {
      eas: {
        projectId: '8458c336-9ec6-4115-9956-67ada7bd80fb',
      },
      apiKey: process.env.API_KEY, // 👈 Load your secret key from .env
    },
  },
};
