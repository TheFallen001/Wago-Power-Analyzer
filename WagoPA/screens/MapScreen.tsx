// screens/MapScreen.tsx
import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  TouchableOpacity,
  Modal,
  Pressable,
  Animated,
} from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { devices } from '../utils/DeviceStore';
import { RootParamList } from '../navigation/types';

const MapScreen = () => {
  const mapRef = useRef<MapView>(null);
  const navigation = useNavigation<NativeStackNavigationProp<RootParamList>>();
  const [selectedDevice, setSelectedDevice] = useState<typeof devices[0] | null>(null);
  const [modalPosition, setModalPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [region, setRegion] = useState<Region>({
    latitude: 41.0082,
    longitude: 28.9784,
    latitudeDelta: 0.5,
    longitudeDelta: 0.5,
  });
  const scaleAnim = useRef(new Animated.Value(0)).current; // For scale animation

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
      // Start animation when modal opens
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      // Reset animation when modal closes
      scaleAnim.setValue(0);
    }
  }, [selectedDevice, scaleAnim]);

  const handleConfigure = (deviceId: string) => {
    console.log('Configure button pressed for device:', deviceId); // Debug log
    navigation.navigate('Configure', { deviceId });
    setSelectedDevice(null); // Close modal after navigation
  };

  const handleMarkerPress = useCallback(
    (device: typeof devices[0], event: any) => {
      setSelectedDevice(device);
      // Approximate screen position based on marker coordinates
      const { latitude, longitude } = device;
      const { width, height } = Dimensions.get('window');

      // Convert lat/lng to approximate screen position (simplified)
      const latDelta = region.latitudeDelta;
      const lngDelta = region.longitudeDelta;
      const latRange = latDelta * 0.5;
      const lngRange = lngDelta * 0.5;

      const x = ((longitude - (region.longitude - lngRange)) / lngDelta) * width;
      const y = ((region.latitude + latRange - latitude) / latDelta) * height;

      // Adjust position to place modal above marker
      setModalPosition({
        x: Math.max(20, Math.min(x - 125, width - 270)), // 125 is half modal width, 270 is modal width + padding
        y: Math.max(20, y - 180), // Position above marker (modal height + offset)
      });
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
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        customMapStyle={customMapStyle}
        initialRegion={{
          latitude: 41.0082,
          longitude: 28.9784,
          latitudeDelta: 0.5,
          longitudeDelta: 0.5,
        }}
        onRegionChangeComplete={handleRegionChange}
        onDoublePress={(e) => {
          e.stopPropagation(); // Prevent double-tap zoom
        }}
      >
        {devices.map((device) => (
          <Marker
            key={device.id}
            coordinate={{
              latitude: device.latitude,
              longitude: device.longitude,
            }}
            onPress={(e) => handleMarkerPress(device, e)}
          >
            <View style={styles.markerDot} />
          </Marker>
        ))}
      </MapView>
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
                  style={[styles.configureButton, { backgroundColor: '#28a745' }]}
                  onPress={() => handleConfigure(selectedDevice.id)}
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
    </View>
  );
};

const customMapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#ebe3cd' }] },
  { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#523735' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#f5f1e6' }] },
  { featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{ color: '#c9b2a6' }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#f5f1e6' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#f8c967' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
  { featureType: 'water', stylers: [{ color: '#c9e8ff' }] },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  markerDot: {
    width: 20,
    height: 20,
    backgroundColor: '#6CBB3C',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#fff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0)', // Transparent background
  },
  modalContent: {
    position: 'absolute',
    backgroundColor: '#fff',
    borderRadius: 10,
    width: 250,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  item: {
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 15,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#000',
  },
  configureButton: {
    padding: 5,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  configureButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 14,
  },
  pointer: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#f9f9f9',
    alignSelf: 'center',
    marginBottom: -10,
  },
});

export default MapScreen;