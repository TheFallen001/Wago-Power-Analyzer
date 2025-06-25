import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { geocodeAddress, reverseGeocode } from "../utils/DeviceStore";
import { addVirtualDevice } from "../utils/VirtualDeviceStore";
import { addModbusDevice } from "../utils/ModbusDeviceStore";
import MapView, {
  MapPressEvent,
  Marker,
  PROVIDER_GOOGLE,
} from "react-native-maps";
import { Picker } from "@react-native-picker/picker";
import { ScrollView } from "react-native-gesture-handler";

const deviceOptions = ["Virtual", "MODBUS"];
const AddDeviceScreen = () => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState("Active");
  const [isSaving, setIsSaving] = useState(false);
  const [selectedValue, setSelectedValue] = useState(deviceOptions[0]);

  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  // When address changes, geocode and update marker
  React.useEffect(() => {
    const timeout = setTimeout(async () => {
      if (address) {
        const geo = await geocodeAddress(address);
        if (geo) {
          setLocation({ latitude: geo.latitude, longitude: geo.longitude });
        }
      }
    }, 600);
    return () => clearTimeout(timeout);
  }, [address]);

  // When user presses on the map, reverse geocode and update address
  const handleMapPress = async (event: MapPressEvent) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setLocation({ latitude, longitude });

    const addr = await reverseGeocode(latitude, longitude);
    if (addr) {
      setAddress(addr);
    }
  };

  const handleAddDevice = () => {
    if (!name || !location?.latitude || !location.longitude || !address) {
      Alert.alert(
        "Error",
        "Please fill in all required fields (Name, Address, Latitude, Longitude)."
      );
      return;
    }

    const newDevice = {
      id: Date.now().toString(),
      name,
      deviceType: selectedValue,
      latitude: location.latitude,
      longitude: location.longitude,
      address, // Add the missing address property
      status,
      voltageRange: "230V", // Default value
      currentMax: 2.0, // Default value
      currentMin: 0, // Default value
      config: {
        addr1: 1, // Default value
        baud1: 9600, // Default value
        check1: 2, // Default: Parity
        stopBit1: 1, // Default: 1.5 stop bit
        baud2: 57600, // Default value
        check2: 2, // Default: Parity
        stopBit2: 1, // Default: 1.5 stop bit
      },
    };

    if ((newDevice.deviceType = deviceOptions[0])) {
      // addVirtualDevice(newDevice);
      console.log("V");
    } else {
      // addModbusDevice(newDevice);
      console.log("M");
    }
    Alert.alert("Success", `Device "${name}" added successfully!`);

    // Reset form
    setName("");
    setAddress("");
    setLocation(null);
    setStatus("Active");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add a New Power Analyzer</Text>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Text style={styles.label}>Device Name *</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter device name"
        />

        <Text style={styles.label}>Instance Type</Text>
        <Picker
          selectedValue={selectedValue}
          onValueChange={(itemValue) => setSelectedValue(itemValue)}
        >
          {deviceOptions.map((option) => (
            <Picker.Item label={option} value={option} key={option} />
          ))}
        </Picker>

        <Text style={styles.label}>Address *</Text>
        <TextInput
          style={styles.input}
          value={address}
          onChangeText={setAddress}
          placeholder="Enter address"
        />

        <Text style={styles.label}>Location *</Text>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={{ height: 300, width: "100%" }}
          region={
            location
              ? {
                  latitude: location.latitude,
                  longitude: location.longitude,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }
              : {
                  latitude: 41.0082,
                  longitude: 28.9784,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }
          }
          pointerEvents={isSaving ? "none" : "auto"}
          onPress={handleMapPress}
        >
          {location && <Marker coordinate={location} />}
        </MapView>

        <Text style={styles.label}>Status</Text>
        <View style={styles.statusContainer}>
          <Button
            title="Active"
            onPress={() => setStatus("Active")}
            color={status === "Active" ? "#28a745" : "#ccc"}
          />
          <Button
            title="Inactive"
            onPress={() => setStatus("Inactive")}
            color={status === "Inactive" ? "#FF2400" : "#ccc"}
          />
        </View>

        <Button title="Add Device" onPress={handleAddDevice} color="#28a745" />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    backgroundColor: "#fff",
  },
  title: {
    position: "relative",
    paddingTop: 12, // pt-12 = 12 * 4 = 48
    fontSize: 24, // text-2xl ≈ 24px
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  label: {
    paddingTop: 8,
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  statusContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
});

export default AddDeviceScreen;
