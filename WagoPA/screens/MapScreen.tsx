// screens/MapScreen.tsx
import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Dimensions, Text, TouchableOpacity } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { devices } from '../utils/DeviceStore';
import { RootParamList } from '../navigation/types';

const MapScreen = () => {
  const mapRef = useRef<MapView>(null);
  const navigation = useNavigation<NativeStackNavigationProp<RootParamList>>();

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

  const handleConfigure = (deviceId: string) => {
    navigation.navigate('Configure', { deviceId });
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
      >
        {devices.map((device) => (
          <Marker
            key={device.id}
            coordinate={{
              latitude: device.latitude,
              longitude: device.longitude,
            }}
          >
            <View style={styles.markerDot} />
            <Callout>
              <View style={styles.callout}>
                <Text style={styles.calloutTitle}>{device.name}</Text>
                <Text>Voltage Range: {device.voltageRange}</Text>
                <Text>Status: {device.status}</Text>
                <TouchableOpacity
                  style={styles.configureButton}
                  onPress={() => handleConfigure(device.id)}
                >
                  <Text style={styles.configureButtonText}>Configure</Text>
                </TouchableOpacity>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
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
  callout: {
    padding: 10,
    width: 150,
  },
  calloutTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  configureButton: {
    backgroundColor: '#6CBB3C',
    padding: 5,
    borderRadius: 5,
    marginTop: 5,
  },
  configureButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
});

export default MapScreen;