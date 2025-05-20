// navigation/BottomTabNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import MapScreen from '../screens/MapScreen';
import TestScreen from '../screens/TestScreen';
import A from '../screens/A';
import B from '../screens/B';
import { Settings } from 'react-native';  
import SettingsScreen from '../screens/Settings';

const Tab = createBottomTabNavigator();

export function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Map':
              iconName = focused ? 'map' : 'map-outline';
              break;
            case 'Events':
              iconName = focused ? 'people' : 'people-outline';
              break;
            case 'Create':
              iconName = focused ? 'add-circle' : 'add-circle-outline';
              break;
            case 'History':
              iconName = focused ? 'time' : 'time-outline';
              break;
            case 'Settings':
              iconName = focused ? 'settings' : 'settings-outline';
              break;
            default:
              iconName = 'help';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#85BB65',
        tabBarInactiveTintColor: 'gray',
        headerShown: false, // Hide headers for a cleaner look (optional)
      })}
    >
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{ tabBarLabel: 'Map' }}
      />
      <Tab.Screen
        name="Test"
        component={TestScreen}
        options={{ tabBarLabel: 'Events' }}
      />
      <Tab.Screen
        name="A"
        component={A}
        options={{ tabBarLabel: 'Create' }}
      />
      <Tab.Screen
        name="B"
        component={B}
        options={{ tabBarLabel: 'History' }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ tabBarLabel: 'Settings' }}
      />
    </Tab.Navigator>
  );
}

export default BottomTabNavigator;