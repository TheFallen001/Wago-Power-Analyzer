import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  FlatList,
} from "react-native";
import { PieChart, BarChart } from "react-native-chart-kit";
import tw from "twrnc";

// Mock Data
const pieData = [
  {
    name: "Off Hours",
    population: 34.1,
    color: "#60A5FA",
    legendFontColor: "#1E293B",
    legendFontSize: 14,
  },
  {
    name: "Auxiliary",
    population: 65.9,
    color: "#34D399",
    legendFontColor: "#1E293B",
    legendFontSize: 14,
  },
];

const barData = {
  labels: [
    "Active Consumption",
    "Reactive Inductive Consumption Penalty",
    "Reactive Inductive Consumption",
  ],
  datasets: [
    {
      data: [400000, 200000, 150000],
      colors: [() => "#60A5FA", () => "#34D399", () => "#FBBF24"],
    },
    {
      data: [300000, 100000, 120000],
      colors: [() => "#93C5FD", () => "#6EE7B7", () => "#FDE68A"],
    },
  ],
};

const barData2 = {
  labels: [
    "Active Consumption",
    "Reactive Inductive Consumption Penalty",
    "Reactive Inductive Consumption",
  ],
  datasets: [
    {
      data: [350000, 180000, 120000],
      colors: [() => "#60A5FA", () => "#34D399", () => "#FBBF24"],
    },
    {
      data: [200000, 80000, 90000],
      colors: [() => "#93C5FD", () => "#6EE7B7", () => "#FDE68A"],
    },
  ],
};

const horizontalBarData = {
  labels: [
    "Central Anatolia Social Outlet",
    "Central Anatolia Panora Mall",
    "Central Anatolia Gordion Mall",
    "Central Anatolia Next Level Mall",
    "Central Anatolia Metropol Mall",
    "Central Anatolia Family Mall",
    "Central Anatolia Arcadium Mall",
    "Central Anatolia Ankamall",
    "Central Anatolia Cepa Mall",
    "Central Anatolia Kentpark Mall",
    "Central Anatolia Taurus Mall",
    "Central Anatolia Armada Mall",
    "Central Anatolia Atakule",
    "Central Anatolia Forum Ankara Mall",
    "Central Anatolia Nata Vega Mall",
    "Central Anatolia Podium Mall",
    "Central Anatolia Antares Mall",
    "Central Anatolia Kızılay Mall",
    "Central Anatolia Karum Mall",
    "Central Anatolia Tepe Prime Mall",
    "Central Anatolia Bilkent Center",
    "Central Anatolia Bilkent Station",
    "Central Anatolia Bilkent Hotel",
    "Central Anatolia Bilkent Cyberpark",
    "Central Anatolia Bilkent University",
    "Central Anatolia Mall X",
    "Central Anatolia Mall Y",
    "Central Anatolia Mall Z",
  ],
  datasets: [
    {
      data: [
        100, 80, 60, 90, 120, 110, 70, 130, 50, 40, 30, 20, 10, 60, 80, 90, 100,
        110, 120, 130, 140, 150, 160, 170, 180, 90, 60, 30,
      ],
      colors: [() => "#6EE7B7"],
    },
  ],
};

const tableData = [
  {
    name: "Central Anatolia Social Outlet",
    total: "16,252,513",
    average: "8.01",
    january: "2,213,545",
    february: "7,813,950",
    march: "2,250,673",
    april: "2,250,673",
    may: "2,151,667",
    june: "15,879,879",
    july: "1,000,000",
    august: "1,200,000",
    september: "1,100,000",
    october: "1,300,000",
    november: "1,400,000",
    december: "1,500,000",
  },
  {
    name: "Central Anatolia Panora Mall",
    total: "12,000,000",
    average: "7.50",
    january: "1,000,000",
    february: "1,200,000",
    march: "1,100,000",
    april: "1,300,000",
    may: "1,400,000",
    june: "1,500,000",
    july: "1,600,000",
    august: "1,700,000",
    september: "1,800,000",
    october: "1,900,000",
    november: "2,000,000",
    december: "2,100,000",
  },
  {
    name: "Central Anatolia Gordion Mall",
    total: "10,000,000",
    average: "6.00",
    january: "800,000",
    february: "900,000",
    march: "1,000,000",
    april: "1,100,000",
    may: "1,200,000",
    june: "1,300,000",
    july: "1,400,000",
    august: "1,500,000",
    september: "1,600,000",
    october: "1,700,000",
    november: "1,800,000",
    december: "1,900,000",
  },
  // Add more rows as needed
];

const heatmapData = [
  [25, 50, 75, 100, 125, 150, 175, 200, 225, 250, 275, 300],
  [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120],
  [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180],
  [20, 40, 60, 80, 100, 120, 140, 160, 180, 200, 220, 240],
];

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const deviceList = [
  "Central Anatolia Ceko Mall",
  "Bursa Times Square",
  "Ankara BDC Mall",
  "Kurt Kose",
  "Anatol Natural AVM",
  "Adli Family Fun Kids",
  "Adli Family Mall",
  "Grand Majid Mall",
  "Gulon Mall",
  "Kaya Store Outlet",
  "Suleymaniyah Family Mall",
  "Majid Mall",
];

const devicePieData = deviceList.map((name, idx) => ({
  name,
  data: [
    {
      name: "Off Hours",
      population: Math.floor(Math.random() * 60) + 20,
      color: "#60A5FA",
      legendFontColor: "#1E293B",
      legendFontSize: 12,
    },
    {
      name: "Auxiliary",
      population: Math.floor(Math.random() * 60) + 20,
      color: "#34D399",
      legendFontColor: "#1E293B",
      legendFontSize: 12,
    },
  ],
}));

const screenWidth = Dimensions.get("window").width;

export default function DashboardScreen() {
  return (
    <View style={{flex:1}}>
      <Text style={tw`relative pt-12 text-2xl font-bold text-center mb-5`}>
        Dashboard
      </Text>
      <ScrollView style={styles.container}>
        {/* First chart row: Pie only */}

        <View style={styles.fullRow}>
          <View style={styles.fullCard}>
            <Text style={styles.header}>Circular Consumption Chart</Text>
            <PieChart
              data={pieData}
              width={screenWidth - 32}
              height={220}
              chartConfig={chartConfig}
              accessor={"population"}
              backgroundColor={"transparent"}
              paddingLeft={"15"}
              absolute
            />
          </View>
        </View>
        {/* Second chart row: Bar chart 1 */}
        <View style={styles.fullRow}>
          <View style={styles.fullCard}>
            <Text style={styles.header}>Reactive Inductive Energy</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <BarChart
                data={{
                  labels: barData.labels,
                  datasets: barData.datasets.map((ds) => ({ data: ds.data })),
                }}
                width={Math.max(barData.labels.length * 120, screenWidth - 32)}
                height={220}
                chartConfig={{
                  ...chartConfig,
                  propsForLabels: {
                    fontWeight: "bold",
                    fontSize: 12,
                    rotation: 0,
                  },
                  formatXLabel: (label: string) =>
                    label.length > 12 ? label.slice(0, 12) + "…" : label,
                }}
                fromZero
                showBarTops={false}
                style={{ borderRadius: 16, marginBottom: 16 }}
              />
            </ScrollView>
          </View>
        </View>
        {/* Third chart row: Bar chart 2 */}
        <View style={styles.fullRow}>
          <View style={styles.fullCard}>
            <Text style={styles.header}>Reactive Capacitive Energy</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <BarChart
                data={{
                  labels: barData2.labels,
                  datasets: barData2.datasets.map((ds) => ({ data: ds.data })),
                }}
                width={Math.max(barData2.labels.length * 120, screenWidth - 32)}
                height={220}
                chartConfig={{
                  ...chartConfig,
                  propsForLabels: {
                    fontWeight: "bold",
                    fontSize: 12,
                    rotation: 0,
                  },
                  formatXLabel: (label: string) =>
                    label.length > 12 ? label.slice(0, 12) + "…" : label,
                }}
                fromZero
                showBarTops={false}
                style={{ borderRadius: 16, marginBottom: 16 }}
              />
            </ScrollView>
          </View>
        </View>
        {/* Device pie charts: 2 rows, 4 per row */}
        <Text style={styles.header}>Device Consumption Pie Charts</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: 16 }}
        >
          {devicePieData.map((dev, i) => (
            <View
              key={i}
              style={[styles.deviceCard, { width: 180, marginRight: 16 }]}
            >
              <Text style={styles.deviceName}>{dev.name}</Text>
              <PieChart
                data={dev.data}
                width={160}
                height={160}
                chartConfig={chartConfig}
                accessor={"population"}
                backgroundColor={"transparent"}
                paddingLeft={"10"}
                absolute
              />
            </View>
          ))}
        </ScrollView>
        {/* Table and Heatmap can be implemented with FlatList or custom components if needed */}
      </ScrollView>
    </View>
  );
}

const chartConfig = {
  backgroundGradientFrom: "#fff",
  backgroundGradientTo: "#fff",
  color: (opacity = 1) => `rgba(30,41,59,${opacity})`,
  labelColor: (opacity = 1) => `rgba(30,41,59,${opacity})`,
  propsForLabels: { fontWeight: "bold" },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    padding: 16,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1E293B",
    marginBottom: 12,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginRight: 16,
    alignItems: "center",
    width: 300,
  },
  fullRow: {
    width: "100%",
    marginBottom: 16,
  },
  fullCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    width: "100%",
  },
  deviceCard: {
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    padding: 8,
    alignItems: "center",
    // width is set inline for scrollable
  },
  deviceName: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#1E293B",
    marginBottom: 4,
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
});
