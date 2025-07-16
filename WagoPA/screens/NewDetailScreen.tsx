import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { PieChart, LineChart } from 'react-native-chart-kit';
import { useRoute } from '@react-navigation/native';
import { ModbusDevices } from '../utils/ModbusDeviceStore'; // Adjust path as needed

const SCREEN_WIDTH = Dimensions.get('window').width;
const SITE_AREA = 842; // m²
const INSTALLED_POWER = 200; // kVA

const DeviceScreen = () => {
  const route = useRoute();
  const { deviceId } = route.params || {};
  const [lastData, setLastData] = useState('');
  const [powerHistory, setPowerHistory] = useState([0, 0, 0, 0, 0, 0]);
  const devices = ModbusDevices;

  useEffect(() => {
    setLastData(new Date().toLocaleString());
  }, []);

  // Changed from d.id to d.name to match DevicesScreen
  const device = devices.find((d) => d.name === deviceId);

  const volt = device?.config?.UA ?? '-';
  const curr = device?.config?.IA ?? '-';
  const power = device?.config?.PT ?? '-';
  const energy = device?.config?.PF ?? '-';

  useEffect(() => {
    if (typeof power === 'number') {
      const now = new Date();
      const hours = now.getHours();
      const slotHours = [0, 4, 8, 12, 16, 20];
      let slotIndex = slotHours.findIndex(
        (h, i) => hours >= h && (i === slotHours.length - 1 || hours < slotHours[i + 1])
      );
      if (slotIndex === -1) slotIndex = slotHours.length - 1;
      setPowerHistory((prev) => {
        const updated = [...prev];
        updated[slotIndex] = power;
        return updated;
      });
    }
  }, [power]);

  if (!device) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Device not found</Text>
      </View>
    );
  }

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
    <ScrollView style={styles.container}>
      <View style={styles.grid}>
        {/* Site Info */}
        <View style={styles.card}>
          <Image
            source={{ uri: 'https://example.com/WAGO.svg' }} // Replace with actual image URL or local asset
            style={styles.siteImage}
          />
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={styles.icon}>☀️</Text>
              <Text style={styles.infoText}>Clear</Text>
              <Text style={styles.infoValue}>48.6°C</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.icon}>🔔</Text>
              <Text style={styles.infoText}>Alarms</Text>
              <Text style={styles.infoValue}>-</Text>
            </View>
          </View>
          <Text style={styles.label}>SITE NAME</Text>
          <Text style={styles.value}>{device.name}</Text>
          <Text style={styles.label}>TOTAL AREA</Text>
          <Text style={styles.value}>{SITE_AREA} m²</Text>
          <Text style={styles.label}>INSTALLED POWER</Text>
          <Text style={styles.value}>{INSTALLED_POWER} kVA</Text>
          <Text style={styles.label}>LAST DATA</Text>
          <View style={styles.infoRow}>
            <Text style={styles.icon}>🕒</Text>
            <Text style={styles.value}>{lastData}</Text>
          </View>
          <Text style={styles.label}>REAL-TIME VALUES</Text>
          <Text style={styles.value}>Voltage: {volt}</Text>
          <Text style={styles.value}>Current: {curr}</Text>
          <Text style={styles.value}>Power: {power}</Text>
          <Text style={styles.value}>Energy: {energy}</Text>
        </View>

        {/* Metrics */}
        <View style={[styles.card, styles.metricsCard]}>
          <View style={styles.metricsGrid}>
            {metrics.map((m, i) => (
              <View key={i} style={styles.metricItem}>
                <Text style={styles.metricIcon}>{m.icon}</Text>
                <Text style={styles.metricValue}>{m.value}</Text>
                <Text style={styles.metricLabel}>{m.label}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.chartsGrid}>
        {/* Pie Chart */}
        <View style={styles.card}>
          <Text style={styles.chartTitle}>Circular Consumption Chart</Text>
          <PieChart
            data={pieData}
            width={SCREEN_WIDTH * 0.4}
            height={220}
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

        {/* Line Chart */}
        <View style={styles.card}>
          <Text style={styles.chartTitle}>Consumption Chart</Text>
          <LineChart
            data={lineData}
            width={SCREEN_WIDTH * 0.9}
            height={220}
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 0,
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    padding: 16,
  },
  grid: {
    flexDirection: 'column',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  metricsCard: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  siteImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: 20,
    marginRight: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#4b5563',
    marginRight: 4,
  },
  infoValue: {
    fontSize: 14,
    color: '#4b5563',
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#6b7280',
    marginTop: 8,
  },
  value: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 4,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricItem: {
    width: '48%',
    alignItems: 'center',
    paddingVertical: 8,
    borderRightWidth: 1,
    borderRightColor: '#e5e7eb',
    marginBottom: 8,
  },
  metricIcon: {
    fontSize: 24,
    color: '#6b7280',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  metricLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  chartsGrid: {
    flexDirection: 'column',
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#1f2937',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default DeviceScreen;