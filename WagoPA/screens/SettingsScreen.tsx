import React, { useState } from "react";
import { View, Text, Switch, TouchableOpacity, Image } from "react-native";
import tw from "twrnc";

import { RootParamList } from "../navigation/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type Props = NativeStackScreenProps<RootParamList, "LogsScreen">;

const SettingsScreen = ({ navigation }: Props) => {
  const [isEnabled, setIsEnabled] = useState(false);

  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  return (
    <View style={tw`flex-1 bg-white pt-10 px-5`}>
      <Text style={tw`text-2xl font-bold text-center mb-5`}>Settings</Text>

      <View style={tw`relative items-center mt-10`}>
        <Image
          source={require("../assets/logo-wago.jpg")}
          style={{ width: 100, height: 100 }} 
          resizeMode="contain" 
        />
      </View>

      <View
        style={tw`flex-row items-center justify-between mt-10 px-5 py-3 bg-gray-100 rounded-2xl`}
      >
        <Text style={tw`text-md font-semibold`}>
          {isEnabled ? "Light Mode" : "Dark Mode"}
        </Text>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
      </View>
      <TouchableOpacity
        style={tw`mt-5 px-5 py-3 bg-gray-100 rounded-2xl`}
        onPress={() => navigation.navigate("LogsScreen")}
      >
        <Text style={tw`text-md font-semibold my-2`}>Logs</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={tw`mt-5 px-5 py-3 bg-gray-100 rounded-2xl`}
        onPress={() => alert("Navigate to About Us")}
      >
        <Text style={tw`text-md font-semibold my-2`}>About Us</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={tw`mt-5 px-5 py-3 bg-gray-100 rounded-2xl`}
        onPress={() => navigation.navigate("AlarmScreen")}
      >
        <Text style={tw`text-md font-semibold my-2`}>Alarms</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SettingsScreen;
