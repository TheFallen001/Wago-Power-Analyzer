import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootParamList } from '../navigation/types';

const SplashScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootParamList>>();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace("MainTabs"); // Navigate to the tab navigator
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo-wago.jpg')} style={styles.logo} />
      <Text style={styles.text}>Wago PA</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  text: {
    fontSize: 30,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default SplashScreen;