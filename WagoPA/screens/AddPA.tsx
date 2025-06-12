import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { addDevice } from "../utils/DeviceStore";
import MapView, {
  MapPressEvent,
  Marker,
  PROVIDER_GOOGLE,
} from "react-native-maps";

const AddDeviceScreen = () => {
  const [name, setName] = useState("");
  // const [latitude, setLatitude] = useState('');
  // const [longitude, setLongitude] = useState('');
  const [status, setStatus] = useState("Active");
  const [isSaving, setIsSaving] = useState(false);

  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const handleMapPress = (event: MapPressEvent) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setLocation({ latitude, longitude });
  };

  const handleAddDevice = () => {
    if (!name || !location?.latitude || !location.longitude) {
      Alert.alert(
        "Error",
        "Please fill in all required fields (Name, Latitude, Longitude)."
      );
      return;
    }

    const newDevice = {
      id: Date.now().toString(),
      name,
      latitude: location.latitude,
      longitude: location.longitude,
      status,
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

    addDevice(newDevice);
    Alert.alert("Success", `Device "${name}" added successfully!`);

    // Reset form
    setName("");

    setStatus("Active");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add a New Power Analyzer</Text>

      <Text style={styles.label}>Device Name *</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Enter device name"
      />

      <Text style={styles.label}>Location *</Text>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={{ height: 300, width: "100%" }}
        region={{
          latitude: 41.0082,
          longitude: 28.9784,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        pointerEvents={isSaving ? 'none' : 'auto'}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 40,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
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
