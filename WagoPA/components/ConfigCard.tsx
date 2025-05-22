import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Modal } from 'react-native';
import { Picker as RNPicker } from '@react-native-picker/picker';


interface ConfigCardProps {
  label: string;
  value: string;
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
  disabled?: boolean;
}

const ConfigCard = ({ label, value, options, onChange, disabled }: ConfigCardProps) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  return (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value || '-'}</Text>
      </View>
      <Pressable
        style={[styles.selectButton, disabled && styles.disabled]}
        onPress={() => !disabled && setIsModalVisible(true)}
        disabled={disabled}
      >
        <Text style={styles.buttonText}>Select</Text>
      </Pressable>
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <RNPicker
              selectedValue={value}
              style={styles.picker}
              onValueChange={(itemValue) => {
                onChange(itemValue);
                setIsModalVisible(false);
              }}
            >
              {options.map((option) => (
                <RNPicker.Item
                  key={option.value}
                  label={option.label}
                  value={option.value}
                />
              ))}
            </RNPicker>
            <Pressable
              style={styles.closeButton}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  cardContent: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    color: '#000',
  },
  value: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
  },
  selectButton: {
    backgroundColor: '#28a745',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  disabled: {
    backgroundColor: '#6c757d',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    width: '90%',
  },
  picker: {
    height: 150,
    justifyContent: 'center',

  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#dc3545',
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ConfigCard;