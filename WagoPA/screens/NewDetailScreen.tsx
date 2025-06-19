import React from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { PieChart, LineChart } from 'react-native-chart-kit';

const mockSiteInfo = {
  name: 'Irq Al Basrah Times Square Mall',
  area: '842.00 m²',
  power: '200 kVA',
  lastData: '16/06/2025 14:30',
  weather: 'Clear',
  temperature: '48.6°C',
  alarms: '-',
  image: '/WAGO.svg',
};

const mockMetrics = [
  { label: 'Grid Consumption (kWh)', value: '216.30', icon: '⚡' },
  { label: 'Gas (m³)', value: '-', icon: '🔥' },
  { label: 'Reactive Inductive Ratio', value: '0.56', icon: '%' },
  { label: 'Reactive Capacitive Ratio', value: '6.31', icon: '%' },
  { label: 'Carbon Emission (TON)', value: '0.12', icon: '☁️' },
  { label: 'Water (m³)', value: '-', icon: '💧' },
  { label: 'Energy Cost', value: '36', icon: '💵' },
  { label: 'Energy Intensity (kWh/m²)', value: '0.256', icon: '📊' },
];

const pieData = [
  { name: 'A', population: 70, color: '#2196f3', legendFontColor: '#1E293B', legendFontSize: 14 },
  { name: 'B', population: 30, color: '#009688', legendFontColor: '#1E293B', legendFontSize: 14 },
];

const lineData = {
  labels: ['16. Jun', '04:00', '08:00', '12:00', '16:00', '20:00'],
  datasets: [
    {
      data: [20, 10, 30, 50, 55, 55],
      color: () => '#43a047',
      strokeWidth: 2,
    },
  ],
};

const screenWidth = Dimensions.get('window').width;

export default function NewDetailScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.infoCard}>
        <Text style={styles.siteName}>{mockSiteInfo.name}</Text>
        <Text style={styles.infoText}>Area: {mockSiteInfo.area}</Text>
        <Text style={styles.infoText}>Power: {mockSiteInfo.power}</Text>
        <Text style={styles.infoText}>Last Data: {mockSiteInfo.lastData}</Text>
        <Text style={styles.infoText}>Weather: {mockSiteInfo.weather} {mockSiteInfo.temperature}</Text>
        <Text style={styles.infoText}>Alarms: {mockSiteInfo.alarms}</Text>
      </View>
      <View style={styles.metricsGrid}>
        {mockMetrics.map((m, i) => (
          <View key={i} style={styles.metricCard}>
            <Text style={styles.metricIcon}>{m.icon}</Text>
            <Text style={styles.metricValue}>{m.value}</Text>
            <Text style={styles.metricLabel}>{m.label}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.header}>Circular Consumption Chart</Text>
      <PieChart
        data={pieData}
        width={screenWidth - 32}
        height={220}
        chartConfig={chartConfig}
        accessor={'population'}
        backgroundColor={'transparent'}
        paddingLeft={'15'}
        absolute
      />
      <Text style={styles.header}>Consumption Chart</Text>
      <LineChart
        data={lineData}
        width={screenWidth - 32}
        height={220}
        chartConfig={chartConfig}
        bezier
        style={{ borderRadius: 16 }}
      />
      {/* Add more sections as needed */}
    </ScrollView>
  );
}

const chartConfig = {
  backgroundGradientFrom: '#fff',
  backgroundGradientTo: '#fff',
  color: (opacity = 1) => `rgba(30,41,59,${opacity})`,
  labelColor: (opacity = 1) => `rgba(30,41,59,${opacity})`,
  propsForLabels: { fontWeight: 'bold' },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    marginTop: 30,
    padding: 16,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  siteName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#334155',
    marginBottom: 2,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  metricCard: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 8,
    margin: 4,
    alignItems: 'center',
    width: '22%',
  },
  metricIcon: {
    fontSize: 20,
    marginBottom: 2,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  metricLabel: {
    fontSize: 10,
    color: '#64748B',
    textAlign: 'center',
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 12,
    textAlign: 'center',
  },
});
