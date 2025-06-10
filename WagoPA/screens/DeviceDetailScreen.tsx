import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, Dimensions } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { RootParamList } from '../navigation/types';
import { devices, geocodeAddress, reverseGeocode, voltageChartDataMap, currentChartDataMap, subscribeToAlarms, VOLTAGE_ALARM_RANGE, CURRENT_ALARM_RANGE } from '../utils/DeviceStore';
import tw from 'twrnc';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import Svg, { Polyline, Line, Circle, Defs, LinearGradient, Stop, Rect, Text as SvgText } from 'react-native-svg';

// Simulated voltage and consumption data for the graphs
const chartWidth = Dimensions.get('window').width - 40; // padding
const chartHeight = 128;

const DeviceDetailScreen = () => {
  const route = useRoute<RouteProp<RootParamList, 'DeviceDetail'>>();
  const navigation = useNavigation();
  const { deviceId } = route.params;
  const device = devices.find((d) => d.name === deviceId);

  // Address editing state
  const [address, setAddress] = useState(device?.address || '');
  const [isSaving, setIsSaving] = useState(false);
  const [location, setLocation] = useState({
    latitude: device?.latitude || 41.0,
    longitude: device?.longitude || 29.0,
  });
  const [region, setRegion] = useState<Region>({
    latitude: device?.latitude || 41.0,
    longitude: device?.longitude || 29.0,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  // Chart state from DeviceStore (per device)
  const [voltageData, setVoltageData] = useState(device ? [...(voltageChartDataMap[device.id] || [])] : []);
  const [consumptionData, setConsumptionData] = useState(device ? [...(currentChartDataMap[device.id] || [])] : []);

  // Alarm state
  const [alarmActive, setAlarmActive] = useState(false); // Default false, only set true when alarm triggers
  const [alarmTypes, setAlarmTypes] = useState<{ volt: boolean; curr: boolean }>({ volt: false, curr: false });

  // Subscribe to chart data updates every 2s
  React.useEffect(() => {
    const interval = setInterval(() => {
      if (device) {
        setVoltageData([...(voltageChartDataMap[device.id] || [])]);
        setConsumptionData([...(currentChartDataMap[device.id] || [])]);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [device]);

  // Subscribe to alarm updates
  React.useEffect(() => {
    const unsub = subscribeToAlarms((alarm) => {
      setAlarmActive(true);
      setAlarmTypes((prev) => ({ ...prev, [alarm.type]: true }));
    });
    return () => unsub();
  }, []);

  // Check if any voltage or current exceeds the threshold
  React.useEffect(() => {
    let overVoltage = voltageData.some((v) => v < VOLTAGE_ALARM_RANGE.min || v > VOLTAGE_ALARM_RANGE.max);
    let overCurrent = consumptionData.some((c) => c < CURRENT_ALARM_RANGE.min || c > CURRENT_ALARM_RANGE.max);
    setAlarmActive(overVoltage || overCurrent);
    setAlarmTypes({ volt: overVoltage, curr: overCurrent });
  }, [voltageData, consumptionData, device?.status]);

  if (!device) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <Text>Device not found.</Text>
      </View>
    );
  }

  // Keep address and map in sync
  const handleSaveAddress = async () => {
    setIsSaving(true);
    const geo = await geocodeAddress(address);
    if (geo) {
      device.address = address;
      device.latitude = geo.latitude;
      device.longitude = geo.longitude;
      setLocation({ latitude: geo.latitude, longitude: geo.longitude });
      setRegion({ ...region, latitude: geo.latitude, longitude: geo.longitude });
      Alert.alert('Success', 'Address updated and location set.');
    } else {
      Alert.alert('Error', 'Could not find this address.');
    }
    setIsSaving(false);
  };

  // When user presses on the map, update address and marker
  const handleMapPress = async (e: any) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setLocation({ latitude, longitude });
    setRegion({ ...region, latitude, longitude });
    const addr = await reverseGeocode(latitude, longitude);
    if (addr) {
      setAddress(addr);
      device.address = addr;
      device.latitude = latitude;
      device.longitude = longitude;
      Alert.alert('Location Updated', 'Address and coordinates updated from map.');
    } else {
      Alert.alert('Error', 'Could not resolve address for this location.');
    }
  };

  // When address input changes, update the map marker after a short delay
  React.useEffect(() => {
    const timeout = setTimeout(async () => {
      if (address && address !== device.address) {
        const geo = await geocodeAddress(address);
        if (geo) {
          setLocation({ latitude: geo.latitude, longitude: geo.longitude });
          setRegion({ ...region, latitude: geo.latitude, longitude: geo.longitude });
        }
      }
    }, 600);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  // Helper to render a line graph with out-of-range segments in red
  function CustomLineGraph({ data, min, max, alarmRange, color, alarmColor, label }: {
    data: number[];
    min: number;
    max: number;
    alarmRange: { min: number; max: number };
    color: string;
    alarmColor: string;
    label: string;
  }) {
    const width = chartWidth;
    const height = chartHeight;
    if (data.length < 2) return null;
    // Normalize data to SVG coordinates
    const points: [number, number][] = data.map((v, i) => [
      (i / (data.length - 1)) * (width - 16) + 8, // x with padding
      height - ((Math.max(min, Math.min(max, v)) - min) / (max - min)) * (height - 24) - 8 // y with padding
    ]);
    // Split into segments: normal and alarm
    const segments = [];
    let current: [number, number][] = [];
    let currentAlarm = false;
    for (let i = 0; i < points.length; ++i) {
      const v = data[i];
      const isAlarm = v < alarmRange.min || v > alarmRange.max;
      if (i === 0) {
        current.push(points[i] as [number, number]);
        currentAlarm = isAlarm;
      } else if (isAlarm === currentAlarm) {
        current.push(points[i] as [number, number]);
      } else {
        segments.push({ alarm: currentAlarm, pts: [...current, points[i] as [number, number]] });
        current = [points[i - 1] as [number, number], points[i] as [number, number]];
        currentAlarm = isAlarm;
      }
    }
    if (current.length > 1) segments.push({ alarm: currentAlarm, pts: current });

    // Gradient for area fill
    const gradientId = `${label}-gradient`;
    const areaPoints = points.map(([x, y]) => `${x},${y}`).join(' ') + ` ${points[points.length-1][0]},${height-8} ${points[0][0]},${height-8}`;

    // Axis labels
    const yTicks = 4;
    const yLabels = Array.from({length: yTicks+1}, (_,i) => min + (i*(max-min)/yTicks));

    return (
      <Svg width={width} height={height}>
        {/* Background gradient */}
        <Defs>
          <LinearGradient id={gradientId} x1="0" y1="0" x2="0" y2={height}>
            <Stop offset="0%" stopColor={color} stopOpacity="0.12" />
            <Stop offset="100%" stopColor={color} stopOpacity="0.02" />
          </LinearGradient>
        </Defs>
        {/* Area fill */}
        <Polyline
          points={areaPoints}
          fill={`url(#${gradientId})`}
          stroke="none"
        />
        {/* Grid lines and y-axis labels */}
        {yLabels.map((v, i) => {
          const y = height - ((v - min) / (max - min)) * (height - 24) - 8;
          return (
            <>
              <Line key={`grid-${i}`} x1={8} x2={width-8} y1={y} y2={y} stroke="#e5e7eb" strokeWidth={1} />
              <SvgText
                key={`label-${i}`}
                x={0}
                y={y+4}
                fontSize={"10"}
                fill="#6b7280"
                textAnchor="start"
              >{Math.round(v)}</SvgText>
            </>
          );
        })}
        {/* Draw segments */}
        {segments.map((seg, i) => (
          <Polyline
            key={i}
            points={seg.pts.map(([x, y]) => `${x},${y}`).join(' ')}
            fill="none"
            stroke={seg.alarm ? alarmColor : color}
            strokeWidth={3}
            strokeLinejoin="round"
            strokeLinecap="round"
            opacity={seg.alarm ? 0.95 : 1}
          />
        ))}
        {/* Draw dots */}
        {points.map(([x, y], i) => {
          const v = data[i];
          const isAlarm = v < alarmRange.min || v > alarmRange.max;
          return (
            <Circle
              key={i}
              cx={x}
              cy={y}
              r={isAlarm ? 7 : 3}
              fill={isAlarm ? '#dc2626' : '#fff'}
              stroke={isAlarm ? '#dc2626' : '#374151'}
              strokeWidth={isAlarm ? 3 : 1}
            />
          );
        })}
      </Svg>
    );
  }

  return (
    <ScrollView style={tw`flex-1 bg-white`} contentContainerStyle={tw`p-5`}>
      <Text style={tw`text-2xl font-bold mb-2`}>{device.name}</Text>
      <Text style={tw`mb-1`}>ID: {device.id}</Text>
      <Text style={tw`mb-1`}>Address:</Text>
      <TextInput
        style={tw`border border-gray-300 rounded px-3 py-2 mb-2`}
        value={address}
        onChangeText={setAddress}
        placeholder="Enter address"
        editable={!isSaving}
      />
      <View style={tw`flex-row mb-2`}>
        <TouchableOpacity
          style={tw`bg-green-600 py-2 px-4 rounded items-center mr-2`}
          onPress={handleSaveAddress}
          disabled={isSaving}
        >
          <Text style={tw`text-white`}>{isSaving ? 'Saving...' : 'Save Address'}</Text>
        </TouchableOpacity>
      </View>
      <Text style={tw`mb-1`}>Or pick location on map:</Text>
      <View style={tw`my-2 bg-gray-100 rounded items-center overflow-hidden w-full`}>
        <MapView
          provider={PROVIDER_GOOGLE}
          ref={undefined}
          style={{ width: '100%', height: 128 }}
          region={region}
          onPress={handleMapPress}
          pointerEvents={isSaving ? 'none' : 'auto'}
          onRegionChangeComplete={setRegion}
        >
          <Marker coordinate={location} />
        </MapView>
      </View>
      
      {/* Voltage Graph (Live) */}
      <View style={tw`my-5 bg-gray-100 p-4 rounded items-center w-full`}>
        <Text style={tw`font-bold mb-2`}>Voltage Graph (Live)</Text>
        <CustomLineGraph
          data={voltageData}
          min={210}
          max={240}
          alarmRange={VOLTAGE_ALARM_RANGE}
          color="#16a34a"
          alarmColor="#16a34a" // Always green, no red line
          label="voltage"
        />
        <View style={tw`flex-row justify-between w-full mt-2`}>
          {voltageData.map((v, i) => (
            <Text key={i} style={tw`text-xs text-gray-500`}>{v}</Text>
          ))}
        </View>
      </View>
      <Text style={tw`mb-1`}>Voltage Range: {device.voltageRange}</Text>
      <Text style={tw`mb-1`}>Status: {alarmActive ? 'ALARM' : device.status}</Text>
      {/* Consumption Graph (Live) */}
      <View style={tw`my-5 bg-gray-100 p-4 rounded items-center w-full`}>
        <Text style={tw`font-bold mb-2`}>Consumption Graph (Live)</Text>
        <CustomLineGraph
          data={consumptionData}
          min={0}
          max={2}
          alarmRange={CURRENT_ALARM_RANGE}
          color="#2563eb"
          alarmColor="#2563eb" // Always blue, no red line
          label="current"
        />
        <View style={tw`flex-row justify-between w-full mt-2`}>
          {consumptionData.map((c, i) => (
            <Text key={i} style={tw`text-xs text-gray-500`}>{c.toFixed(2)}</Text>
          ))}
        </View>
      </View>
      {/* Alarm Button */}
      {(alarmActive && (alarmTypes.volt || alarmTypes.curr)) && (
        <View style={tw`my-2`}>
          <TouchableOpacity
            style={tw`bg-red-600 py-4 px-8 rounded-lg items-center w-full`}
            activeOpacity={0.8}
            disabled
          >
            <Text style={tw`text-white text-xl font-bold`}>
              {alarmTypes.volt && alarmTypes.curr
                ? 'ALARM: Voltage & Current Out of Range!'
                : alarmTypes.volt
                ? 'ALARM: Voltage Out of Range!'
                : 'ALARM: Current Out of Range!'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
      {/* Normal Return Button */}
      <TouchableOpacity
        style={tw`bg-green-600 py-2 rounded mt-5 items-center`}
        onPress={() => navigation.goBack()}
      >
        <Text style={tw`text-white`}>Back</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default DeviceDetailScreen;
