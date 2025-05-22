import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import MapScreen from '../screens/MapScreen';
import DevicesScreen from '../screens/PAScreen';
import AddDeviceScreen from '../screens/AddPA';
import ConfigureScreen from '../screens/ConfigureScreen'; 
import SettingsScreen from '../screens/SettingsScreen';

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
            case 'Devices':
              iconName = focused ? 'list' : 'list-outline';
              break;
            case 'Add Device':
              iconName = focused ? 'add-circle' : 'add-circle-outline';
              break;
            case 'Configure': // Updated name
              iconName = focused ? 'cog' : 'cog-outline'; // Changed icon to represent configuration
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
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{ tabBarLabel: 'Map' }}
      />
      <Tab.Screen
        name="Devices"
        component={DevicesScreen}
        options={{ tabBarLabel: 'Devices' }}
      />
      <Tab.Screen
        name="Add Device"
        component={AddDeviceScreen}
        options={{ tabBarLabel: 'Add Device' }}
      />
      <Tab.Screen
        name="Configure" // Updated name
        component={ConfigureScreen}
        options={{ tabBarLabel: 'Configure' }}
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