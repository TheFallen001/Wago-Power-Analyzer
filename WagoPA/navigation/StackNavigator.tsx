import { createStackNavigator } from '@react-navigation/stack';
import { RootParamList } from './types';
import SplashScreen from '../screens/SplashScreen';
import BottomTabNavigator from './BottomTabNavigator';
import * as React from 'react';
import LogScreen from '../screens/LogsScreen';
import ConfigureScreen from "../screens/ConfigureScreen"

const Stack = createStackNavigator<RootParamList>();
const StackNavigator =() => (
    <Stack.Navigator >
        
        <Stack.Screen
          name="MainTabs"
          component={BottomTabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="LogsScreen"
          component={LogScreen}
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
        <Stack.Screen
          name="AlarmScreen"
          component={require('../screens/AlarmScreen').default}
          options={{ headerShown: true, title: 'Alarm History' }}
        />
      </Stack.Navigator>
);

export default StackNavigator;