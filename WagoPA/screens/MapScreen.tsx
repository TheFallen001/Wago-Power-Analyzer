import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  Pressable,
  Animated,
  useWindowDimensions,
  Dimensions,
} from "react-native";
import MapView, { Marker, Region, PROVIDER_GOOGLE } from "react-native-maps";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { devices, geocodeAddress, reverseGeocode, subscribeToDeviceUpdates } from "../utils/DeviceStore";
import { RootParamList } from "../navigation/types";

const MapScreen = () => {
  const mapRef = useRef<MapView>(null);
  const navigation = useNavigation<NativeStackNavigationProp<RootParamList>>();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [selectedDevice, setSelectedDevice] = useState<
    (typeof devices)[0] | null
  >(null);
  const [modalPosition, setModalPosition] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  }>({ x: 0, y: 0, width: 0, height: 0 });
  const [region, setRegion] = useState<Region>({
    latitude: 41.0082,
    longitude: 28.9784,
    latitudeDelta: 0.3,
    longitudeDelta: 0.3,
  });
  const [deviceList, setDeviceList] = useState([...devices]);
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  // Fit map to device coordinates
  useEffect(() => {
    if (mapRef.current && devices.length > 0) {
      const coordinates = devices.map((device) => ({
        latitude: device.latitude,
        longitude: device.longitude,
      }));
      mapRef.current.fitToCoordinates(coordinates, {
        edgePadding: {
          top: insets.top + 30,
          right: 30,
          bottom: insets.bottom + 30,
          left: 30,
        },
        animated: true,
      });
    }
  }, [insets]);

  // Animate modal
  useEffect(() => {
    if (selectedDevice) {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [selectedDevice, scaleAnim, opacityAnim]);

  const handleConfigure = useCallback(
    (deviceId: string) => {
      navigation.navigate("Configure", { deviceId });
      setSelectedDevice(null);
    },
    [navigation]
  );

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

      setTimeout(async () => {
        // Modal size: scale with device, but fixed aspect ratio
        const modalWidth = Math.max(220, Math.min(0.8 * screenWidth, 360));
        const modalHeight = Math.max(140, Math.min(0.3 * screenHeight, 240));
        let modalX = 0;
        let modalY = 0;
        if (mapRef.current && mapRef.current.pointForCoordinate) {
          try {
            const point = await mapRef.current.pointForCoordinate({ latitude, longitude });
            modalX = point.x - modalWidth / 2;
            modalY = point.y - modalHeight - 35;
            // Clamp to screen bounds
            modalX = Math.max(8, Math.min(modalX, screenWidth - modalWidth - 8));
            modalY = Math.max(8, Math.min(modalY, screenHeight - modalHeight - 8));
          } catch (e) {
            modalX = screenWidth / 2 - modalWidth / 2;
            modalY = screenHeight / 2 - modalHeight / 2;
          }
        } else {
          modalX = screenWidth / 2 - modalWidth / 2;
          modalY = screenHeight / 2 - modalHeight / 2;
        }
        setModalPosition({ x: modalX, y: modalY, width: modalWidth, height: modalHeight });
        setSelectedDevice(device);
      }, 300);
    },
    [region, screenWidth, screenHeight, insets, modalPosition.height]
  );

  const handleRegionChange = useCallback((newRegion: Region) => {
    setRegion(newRegion);
  }, []);

  const closeModal = useCallback(() => {
    setSelectedDevice(null);
  }, []);

  const handleModalLayout = useCallback(
    (event: any) => {
      const { width, height } = event.nativeEvent.layout;
      setModalPosition((prev) => ({ ...prev, width, height }));
    },
    []
  );

  // Keep device list in sync with DeviceStore
  useEffect(() => {
    const unsubscribe = subscribeToDeviceUpdates((updatedDevices) => {
      setDeviceList([...updatedDevices]);
    });
    return unsubscribe;
  }, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: 41.0082,
          longitude: 28.9784,
          latitudeDelta: 0.2,
          longitudeDelta: 0.2,
        }}
        onRegionChangeComplete={handleRegionChange}
        onDoublePress={(e) => e.stopPropagation()}
      >
        {deviceList.map((device) => (
          <Marker
            key={device.name} // Use device.name for uniqueness
            coordinate={{
              latitude: device.latitude,
              longitude: device.longitude,
            }}
            onPress={() => handleMarkerPress(device)}
            accessibilityLabel={`Marker for ${device.name}`}
          >
            <View style={styles.markerDot} />
          </Marker>
        ))}
      </MapView>
      <Modal
        animationType="none" // Handled by Animated
        transparent={true}
        visible={selectedDevice !== null}
        onRequestClose={closeModal}
        accessible={true}
        accessibilityLabel="Device details modal"
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={closeModal}
          accessibilityRole="button"
          accessibilityLabel="Close modal"
        >
          {selectedDevice && (
            <Animated.View
              style={[
                styles.modalContent,
                {
                  transform: [{ scale: scaleAnim }],
                  opacity: opacityAnim,
                  left: modalPosition.x,
                  top: modalPosition.y,
                  width: modalPosition.width,
                },
              ]}
              onLayout={handleModalLayout}
            >
              <View style={styles.item}>
                <Text
                  style={styles.name}
                  accessibilityLabel={`Device name ${selectedDevice.name}`}
                >
                  {selectedDevice.name}
                </Text>
                <Text style={styles.text}>
                  Address: {selectedDevice.address || 'Unknown'}
                </Text>
                <Text style={styles.text}>
                  Voltage Range: {selectedDevice.voltageRange}
                </Text>
                <Text style={styles.text}>
                  Status: {selectedDevice.status}
                </Text>
                <TouchableOpacity
                  style={styles.configureButton}
                  onPress={() => handleConfigure(selectedDevice.id)}
                  activeOpacity={0.7}
                  accessibilityRole="button"
                  accessibilityLabel={`Configure ${selectedDevice.name}`}
                >
                  <Text style={styles.configureButtonText}>Configure</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.pointer} />
            </Animated.View>
          )}
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  map: {
    flex: 1,
  },
  markerDot: {
    width: Math.min(Dimensions.get("window").width * 0.06, 24),
    height: Math.min(Dimensions.get("window").width * 0.06, 24),
    backgroundColor: "#6CBB3C",
    borderRadius: Math.min(Dimensions.get("window").width * 0.03, 12),
    borderWidth: 2,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  modalContent: {
    position: "absolute",
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    width: Math.max(220, Math.min(0.8 * Dimensions.get("window").width, 360)),
    minHeight: 140,
    maxHeight: 240,
  },
  item: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: Math.min(Dimensions.get("window").width * 0.05, 16),
  },
  name: {
    fontSize: Math.min(Dimensions.get("window").width * 0.05, 18),
    fontWeight: "600",
    marginBottom: 8,
    color: "#1a1a1a",
  },
  text: {
    fontSize: Math.min(Dimensions.get("window").width * 0.04, 14),
    marginBottom: 6,
    color: "#333",
  },
  configureButton: {
    backgroundColor: "#28a745",
    paddingVertical: Math.min(Dimensions.get("window").width * 0.03, 12),
    paddingHorizontal: Math.min(Dimensions.get("window").width * 0.05, 20),
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
  },
  configureButtonText: {
    color: "#fff",
    fontSize: Math.min(Dimensions.get("window").width * 0.04, 14),
    fontWeight: "500",
  },
  pointer: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 12,
    borderRightWidth: 12,
    borderTopWidth: 12,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "#fff",
    alignSelf: "center",
    marginTop: -1,
  },
});

export default MapScreen;