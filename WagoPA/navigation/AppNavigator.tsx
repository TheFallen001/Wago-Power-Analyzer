import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from '../screens/SplashScreen';
import BottomTabNavigator from './BottomTabNavigator';
import ConfigureScreen from '../screens/ConfigureScreen';
import { RootParamList } from './types';

const Stack = createStackNavigator<RootParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SplashScreen">
        <Stack.Screen
          name="SplashScreen"
          component={SplashScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MainTabs"
          component={BottomTabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Configure"
          component={ConfigureScreen}
          options={{ headerShown: true, title: 'Configure Device' }}
        />
        <Stack.Screen
          name="DeviceDetail"
          component={require('../screens/DeviceDetailScreen').default}
          options={{ headerShown: true, title: 'Device Details' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;