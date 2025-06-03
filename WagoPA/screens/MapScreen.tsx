// screens/MapScreen.tsx
import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  TouchableOpacity,
  Modal,
  Pressable,
  Animated,
  ScrollView,
} from "react-native";
import MapView, { Marker, Region, PROVIDER_GOOGLE } from "react-native-maps";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { devices } from "../utils/DeviceStore";
import { RootParamList } from "../navigation/types";
import tw from "twrnc";

const MapScreen = () => {
  const mapRef = useRef<MapView>(null);
  const navigation = useNavigation<NativeStackNavigationProp<RootParamList>>();
  const [selectedDevice, setSelectedDevice] = useState<
    (typeof devices)[0] | null
  >(null);
  const [modalPosition, setModalPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [region, setRegion] = useState<Region>({
    latitude: 41.0082,
    longitude: 28.9784,
    latitudeDelta: 0.5,
    longitudeDelta: 0.5,
  });
  const scaleAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (mapRef.current && devices.length > 0) {
      const coordinates = devices.map((device) => ({
        latitude: device.latitude,
        longitude: device.longitude,
      }));
      mapRef.current.fitToCoordinates(coordinates, {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      });
    }
  }, []);

  useEffect(() => {
    if (selectedDevice) {
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      scaleAnim.setValue(0);
    }
  }, [selectedDevice, scaleAnim]);

  const handleConfigure = (deviceId: string) => {
    console.log("Configure button pressed for device:", deviceId);
    navigation.navigate("Configure", { deviceId });
    setSelectedDevice(null);
  };

  const handleMarkerPress = useCallback(
    (device: (typeof devices)[0]) => {
      const { latitude, longitude } = device;

      mapRef.current?.animateToRegion(
        {
          latitude,
          longitude,
          latitudeDelta: region.latitudeDelta,
          longitudeDelta: region.longitudeDelta,
        },
        300
      );

      const { width, height } = Dimensions.get("window");
      const modalX = width / 2 - 125;
      const modalY = height / 2 - 160;

      setModalPosition({ x: modalX, y: modalY });
      setSelectedDevice(device);
    },
    [region]
  );

  const handleRegionChange = (newRegion: Region) => {
    setRegion(newRegion);
  };

  const closeModal = () => {
    setSelectedDevice(null);
  };

  return (
    <View style={tw`flex-1 bg-white`}>
      <ScrollView contentContainerStyle={tw`flex-grow`}>
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: 41.0082,
            longitude: 28.9784,
            latitudeDelta: 0.5,
            longitudeDelta: 0.5,
          }}
          onRegionChangeComplete={handleRegionChange}
          onDoublePress={(e) => {
            e.stopPropagation();
          }}
        >
          {devices.map((device) => (
            <Marker
              key={device.id}
              coordinate={{
                latitude: device.latitude,
                longitude: device.longitude,
              }}
              onPress={(e) => handleMarkerPress(device)}
            >
              <View style={styles.markerDot} />
            </Marker>
          ))}
        </MapView>
        {/* Modal remains outside ScrollView for correct overlay behavior */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={selectedDevice !== null}
          onRequestClose={closeModal}
        >
          <Pressable style={styles.modalOverlay} onPress={closeModal}>
            {selectedDevice && (
              <Animated.View
                style={[
                  styles.modalContent,
                  {
                    transform: [{ scale: scaleAnim }],
                    left: modalPosition.x,
                    top: modalPosition.y,
                  },
                ]}
              >
                <View style={styles.item}>
                  <Text style={styles.name}>{selectedDevice.name}</Text>
                  <Text>Latitude: {selectedDevice.latitude}</Text>
                  <Text>Longitude: {selectedDevice.longitude}</Text>
                  <Text>Voltage Range: {selectedDevice.voltageRange}</Text>
                  <Text>Status: {selectedDevice.status}</Text>
                  <TouchableOpacity
                    style={[
                      styles.configureButton,
                      { backgroundColor: "#28a745" },
                    ]}
                    onPress={() => handleConfigure(selectedDevice.name)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.configureButtonText}>Configure</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.pointer} />
              </Animated.View>
            )}
          </Pressable>
        </Modal>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  markerDot: {
    width: 20,
    height: 20,
    backgroundColor: "#6CBB3C",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#fff",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0)",
  },
  modalContent: {
    position: "absolute",
    backgroundColor: "#fff",
    borderRadius: 10,
    width: 250,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  item: {
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 15,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#000",
  },
  configureButton: {
    padding: 5,
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
  },
  configureButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 14,
  },
  pointer: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 10,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "#f9f9f9",
    alignSelf: "center",
    marginBottom: -10,
  },
});

export default MapScreen;
