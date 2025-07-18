import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import wdxHelper, { sendCsvSchema } from "../utils/DeviceStore";
import { RootParamList } from "../navigation/types";
import tw from "twrnc";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import Papa from "papaparse";

interface SchemaTree {
  path: string;
  children: DataSchema[];
}
interface DataSchema {
  path: string;
  relativePath: string;
  description: string;
  metadata: ModbusMetadata;
  readonly: boolean;
  subscribeable: boolean;
  editable: boolean;
  extendable: boolean;
  expandable: boolean;
  refreshable: boolean;
  removable: boolean;
}

interface ModbusMetadata {
  MODBUSAddressFrom: number;
  MODBUSAccess: ModbusAccess[];
  MODBUSReadTransformation: string;
  MODBUSWriteTransformation: string;
  MODBUSType: string;
  MODBUSAddressLength: number;
}

type ModbusAccess = "READ" | "WRITE" | "READ/WRITE";

const DevicesScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootParamList>>();

  const handlePickCSV = async (devName: string) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*", // accept any file
        copyToCacheDirectory: true,
        multiple: false,
      });
      console.log("Result: ", result)

      if (result.canceled || !result.assets?.length) {
        console.log("User canceled the file picker");
        return;
      }

      const file = result.assets[0];

      if (!file.name.toLowerCase().endsWith(".csv")) {
        Alert.alert("Invalid File", "Please select a .csv file.");
        return;
      }
      const fileContent = await FileSystem.readAsStringAsync(file.uri);

      const parsed = Papa.parse<string[]>(fileContent, {
        header: false,
        skipEmptyLines: true,
      });

      const rows = parsed.data as string[][];

      await sendCsvSchema(devName, rows);
    } catch (error) {
      console.error("Error picking file:", error);
      Alert.alert("Error", "Failed to pick file.");
    }
  };

  const isDefaultConfig = (config: any) => {
    const defaultConfig = {
      Addr1: 0,
      Baud1: 0,
      Check1: 0,
      Baud2: 0,
      Check2: 0,
      "645Addr": 0,
      Language: 0,
      F: 0,
      PF: 0,
      QT: 0,
      PT: 0,
      UA: 0,
      IA: 0,
    };

    return Object.entries(defaultConfig).every(
      ([key, val]) => config[key] === val
    );
  };
  const renderDeviceItem = ({
    item,
  }: {
    item: (typeof wdxHelper.devices)[0];
  }) => (
    <View style={tw`bg-gray-100 p-4 mb-3 rounded`}>
      <Text style={tw`text-lg font-bold mb-1`}>{item.name}</Text>
      <Text>Address: {item.address || "Unknown"}</Text>
      <Text>Voltage Range: {item.voltageRange}</Text>
      {/* <Text>Status: {item.status}</Text> */}
      <View style={tw`flex-row mt-2`}>
        <TouchableOpacity
          style={tw`bg-green-600 py-2 px-4 rounded items-center mr-2`}
          onPress={() =>
            navigation.navigate("DeviceDetail", { deviceId: item.name })
          }
        >
          <Text style={tw`text-white`}>View Details</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={tw`bg-green-600 py-2 px-4 rounded items-center`}
          onPress={() =>
            navigation.navigate("Configure", { deviceId: item.name })
          }
        >
          <Text style={tw`text-white`}>Configure</Text>
        </TouchableOpacity>
      </View>
      {(isDefaultConfig(item.config) ||
        (typeof item.config === "object" &&
          Object.keys(item.config).length === 0)) && (
        <TouchableOpacity
          onPress={() => handlePickCSV(item.name)}
          style={tw`bg-green-600 py-2 px-4 rounded items-center mr-2 mt-5`}
        >
          <Text style={tw`text-white`}>Upload CSV</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={tw`flex-1 bg-white pt-10`}>
      <Text style={tw`text-2xl font-bold text-center mb-5`}>
        Power Analyzers
      </Text>
      <ScrollView contentContainerStyle={tw`px-5 pb-10`}>
        <FlatList
          data={wdxHelper.devices}
          renderItem={renderDeviceItem}
          keyExtractor={(item) => item.name}
          scrollEnabled={false}
        />
      </ScrollView>
    </View>
  );
};

export default DevicesScreen;
