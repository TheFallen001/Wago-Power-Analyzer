import { NavigationContainer } from "@react-navigation/native";
import * as React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import MainStackNavigator from "./StackNavigator";
import MapScreen from "../screens/MapScreen";
import NewDetailScreen from "../screens/NewDetailScreen";

const Drawer = createDrawerNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen
        name="Home"
        component={MainStackNavigator}
        options={{headerShown: false}}
        />    
        <Drawer.Screen
        name="Maps"
        component={MapScreen}/>
        <Drawer.Screen
        name="Details"
        component={NewDetailScreen}/>
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
