import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Alert, Dimensions } from 'react-native';
import { PieChart, LineChart } from 'react-native-chart-kit';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootParamList } from '../navigation/types';
import wdxHelper from '../utils/wdx-helpers'; // Adjust path as needed
import tw from 'twrnc';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SITE_AREA = 842; // m²
const INSTALLED_POWER = 200; // kVA

const DeviceScreen = () => {
  const route = useRoute<RouteProp<RootParamList, 'DeviceDetail'>>();
  const navigation = useNavigation<NativeStackNavigationProp<RootParamList>>();
  const { deviceId } = route.params;
  const [lastData, setLastData] = useState('');
  const [powerHistory, setPowerHistory] = useState([0, 0, 0, 0, 0, 0]);
  const [voltageData, setVoltageData] = useState<number[]>([]);
  const [currentData, setCurrentData] = useState<number[]>([]);
  const [address, setAddress] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [alarmActive, setAlarmActive] = useState(false);
  const [alarmTypes, setAlarmTypes] = useState<{ volt: boolean; curr: boolean }>({ volt: false, curr: false });

  const device = wdxHelper.devices.find((d) => d.name === deviceId);

  useEffect(() => {
    if (device) {
      setAddress(device.address || '');
      setLastData(new Date().toLocaleString());
      setIsLoading(false);
    }
  }, [device]);

  // Subscribe to chart data updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (deviceId) {
        const voltages = wdxHelper.devices
          .filter((d) => d.name === deviceId)
          .map((d) => d.config?.UA || 0);
        const currents = wdxHelper.devices
          .filter((d) => d.name === deviceId)
          .map((d) => d.config?.IA || 0);
        setVoltageData(voltages);
        setCurrentData(currents);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [deviceId]);

  // Subscribe to alarms
  useEffect(() => {
    const unsub = wdxHelper.subscribeToAlarms((alarm) => {
      setAlarmActive(true);
      setAlarmTypes((prev) => ({ ...prev, [alarm.type]: true }));
    });
    return () => unsub();
  }, []);

  // Check for voltage and current alarms
  useEffect(() => {
    const overVoltage = voltageData.some((v) => v > 300); // Example threshold
    const overCurrent = currentData.some((c) => c > 100); // Example
    setAlarmActive(overVoltage || overCurrent);
    setAlarmTypes({ volt: overVoltage, curr: overCurrent });
  }, [voltageData, currentData]);

  // Update power history
  useEffect(() => {
    if (device && typeof device.config?.PT === 'number') {
      const now = new Date();
      const hours = now.getHours();
      const slotHours = [0, 4, 8, 12, 16, 20];
      let slotIndex = slotHours.findIndex(
        (h, i) => hours >= h && (i === slotHours.length - 1 || hours < slotHours[i + 1])
      );
      if (slotIndex === -1) slotIndex = slotHours.length - 1;
      setPowerHistory((prev) => {
        const updated = [...prev];
        updated[slotIndex] = device.config.PT;
        return updated;
      });
    }
  }, [device?.config?.PT]);

  // Set header back button (optional, if header is visible)
  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          style={tw`ml-4 bg-green-500 p-2 rounded-lg`}
          onPress={() => navigation.goBack()}
        >
          <Text style={tw`text-white font-medium`}>Return</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  if (isLoading) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <ActivityIndicator size="large" color="#16a34a" />
        <Text style={tw`text-lg text-gray-800 mt-2`}>Loading device data...</Text>
      </View>
    );
  }

  if (!device) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <Text style={tw`text-lg text-gray-800`}>Device not found</Text>
        <TouchableOpacity
          style={tw`bg-green-500 py-2 px-4 rounded mt-5 items-center active:bg-green-600`}
          onPress={() => navigation.goBack()}
        >
          <Text style={tw`text-white`}>Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const volt = device.config?.UA ?? '-';
  const curr = device.config?.IA ?? '-';
  const power = device.config?.PT ?? '-';
  const energy = device.config?.PF ?? '-';
  const totalEnergy = typeof energy === 'number' ? energy : 0;
  const energyIntensity = SITE_AREA ? (totalEnergy / SITE_AREA).toFixed(3) : '-';
  const carbonEmission = (totalEnergy * 0.000475).toFixed(3);
  const energyCost = (totalEnergy * 0.15).toFixed(2);
  const reactiveInductiveRatio = device.config.QT || '-';
  const reactiveCapacitiveRatio = device.config.F || '-';

  const metrics = [
    { label: 'Grid Consumption (kWh)', value: totalEnergy.toFixed(2), icon: '⚡' },
    { label: 'Gas (m³)', value: '-', icon: '🔥' },
    { label: 'Reactive Inductive Ratio', value: reactiveInductiveRatio, icon: '%' },
    { label: 'Reactive Capacitive Ratio', value: reactiveCapacitiveRatio, icon: '%' },
    { label: 'Carbon Emission (TON)', value: carbonEmission, icon: '☁️' },
    { label: 'Water (m³)', value: '-', icon: '💧' },
    { label: 'Energy Cost', value: energyCost, icon: '💵' },
    { label: 'Energy Intensity (kWh/m²)', value: energyIntensity, icon: '📊' },
  ];

  const pieData = [
    { name: 'Energy', value: totalEnergy, color: '#2196f3' },
    { name: 'Other', value: 100 - totalEnergy, color: '#009688' },
  ];

  const lineData = {
    labels: ['16. Jun', '04:00', '08:00', '12:00', '16:00', '20:00'],
    datasets: [
      {
        data: powerHistory,
        color: () => '#43a047',
        strokeWidth: 2,
      },
    ],
  };

  return (
    <ScrollView style={tw`flex-1 bg-white`} contentContainerStyle={tw`p-5 pb-10`}>
      {/* Header */}
      <Text style={tw`text-2xl font-bold text-gray-800 mb-4`}>{device.name}</Text>

      {/* Alarm Banner */}
      {alarmActive && (
        <View style={tw`bg-red-100 border-l-4 border-red-600 p-4 mb-4 rounded-lg`}>
          <Text style={tw`text-red-600 font-bold`}>
            {alarmTypes.volt && alarmTypes.curr
              ? 'ALARM: Voltage & Current Out of Range!'
              : alarmTypes.volt
              ? 'ALARM: Voltage Out of Range!'
              : 'ALARM: Current Out of Range!'}
          </Text>
        </View>
      )}

      {/* Site Info */}
      <View style={tw`bg-gray-100 rounded-lg p-4 mb-4 shadow-md`}>
        <Image
          source={require('../assets/WAGO.png')} // Adjust path to your asset
          style={tw`w-full h-30 rounded-lg mb-3`}
          resizeMode="cover"
          onError={() => {
            Alert.alert('Error', 'Failed to load site image.');
          }}
        />
        <View style={tw`flex-row justify-between mb-3`}>
          <View style={tw`flex-row items-center`}>
            <Text style={tw`text-2xl mr-2`}>☀️</Text>
            <Text style={tw`text-sm text-gray-600 font-medium`}>Clear</Text>
            <Text style={tw`text-sm text-gray-700 ml-2`}>48.6°C</Text>
          </View>
          <View style={tw`flex-row items-center`}>
            <Text style={tw`text-2xl mr-2`}>🔔</Text>
            <Text style={tw`text-sm text-gray-600 font-medium`}>Alarms</Text>
            <Text style={tw`text-sm text-gray-700 ml-2`}>{alarmActive ? 'Active' : '-'}</Text>
          </View>
        </View>
        <Text style={tw`text-xs font-bold text-gray-500 uppercase`}>Site Name</Text>
        <Text style={tw`text-sm text-gray-700 mb-2`}>{device.name}</Text>
        <Text style={tw`text-xs font-bold text-gray-500 uppercase`}>Total Area</Text>
        <Text style={tw`text-sm text-gray-700 mb-2`}>{SITE_AREA} m²</Text>
        <Text style={tw`text-xs font-bold text-gray-500 uppercase`}>Installed Power</Text>
        <Text style={tw`text-sm text-gray-700 mb-2`}>{INSTALLED_POWER} kVA</Text>
        <Text style={tw`text-xs font-bold text-gray-500 uppercase`}>Last Data</Text>
        <View style={tw`flex-row items-center text-sm text-gray-700 mb-2`}>
          <Text style={tw`mr-1 text-xl`}>🕒</Text>
          <Text>{lastData}</Text>
        </View>
        <Text style={tw`text-xs font-bold text-gray-500 uppercase mt-2`}>Real-Time Values</Text>
        <Text style={tw`text-sm text-gray-700`}>Voltage: {volt} V</Text>
        <Text style={tw`text-sm text-gray-700`}>Current: {curr} A</Text>
        <Text style={tw`text-sm text-gray-700`}>Power: {power} kW</Text>
        <Text style={tw`text-sm text-gray-700`}>Energy: {energy} kWh</Text>
      </View>

      {/* Metrics */}
      <View style={tw`bg-gray-100 rounded-lg p-4 mb-4 shadow-md`}>
        <Text style={tw`text-lg font-bold text-gray-800 mb-3`}>Metrics</Text>
        <View style={tw`flex-row flex-wrap justify-between`}>
          {metrics.map((m, i) => (
            <View
              key={i}
              style={tw`w-1/2 items-center py-3 ${i % 2 === 1 ? '' : 'border-r border-gray-200'}`}
            >
              <Text style={tw`text-2xl text-gray-500 mb-1`}>{m.icon}</Text>
              <Text style={tw`text-lg font-bold text-gray-800`}>{m.value}</Text>
              <Text style={tw`text-xs text-gray-500 text-center mt-1`}>{m.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Charts */}
      <View style={tw`mb-4`}>
        <View style={tw`bg-gray-100 rounded-lg p-4 mb-4 items-center shadow-md`}>
          <Text style={tw`font-bold text-lg text-gray-800 mb-3`}>Circular Consumption Chart</Text>
          <PieChart
            data={pieData}
            width={SCREEN_WIDTH * 0.5}
            height={240}
            chartConfig={{
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            accessor="value"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        </View>

        <View style={tw`bg-gray-100 rounded-lg p-4 items-center shadow-md`}>
          <Text style={tw`font-bold text-lg text-gray-800 mb-3`}>Power Consumption Chart</Text>
          <LineChart
            data={lineData}
            width={SCREEN_WIDTH * 0.9}
            height={240}
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 1,
              color: (opacity = 1) => '#43a047',
              labelColor: (opacity = 1) => '#1E293B',
              style: { borderRadius: 16 },
              propsForDots: { r: '6', strokeWidth: '2', stroke: '#43a047' },
            }}
            bezier
            yAxisLabel=""
            yAxisSuffix=" kW"
            yAxisInterval={1}
          />
        </View>
      </View>

      {/* Back Button */}
      <TouchableOpacity
        style={tw`bg-green-500 py-3 px-6 rounded-lg mt-5 items-center shadow-md active:bg-green-600`}
        onPress={() => navigation.goBack()}
      >
        <Text style={tw`text-white text-base font-medium`}>Back to Devices</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default DeviceScreen;