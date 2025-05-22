import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Picker as RNPicker } from '@react-native-picker/picker'; // Correct import
interface DrawerFieldProps {
  label: string;
  value: string;
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
  disabled?: boolean;
}

const DrawerField = ({ label, value, options, onChange, disabled }: DrawerFieldProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View style={styles.container}>
      <Pressable
        style={[styles.summary, disabled && styles.disabled]}
        onPress={() => !disabled && setIsOpen(!isOpen)}
      >
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value || 'Select...'}</Text>
      </Pressable>
      {isOpen && !disabled && (
        <View style={styles.drawer}>
          <RNPicker
            selectedValue={value}
            style={styles.picker}
            onValueChange={onChange}
            enabled={!disabled}
          >
            {options.map((option) => (
              <RNPicker.Item
                key={option.value}
                label={option.label}
                value={option.value}
              />
            ))}
          </RNPicker>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#2d2d2d',
    borderWidth: 1,
    borderColor: '#4b5563',
    borderRadius: 5,
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    fontSize: 16,
    color: '#d1d5db',
  },
  value: {
    fontSize: 16,
    color: '#fff',
  },
  drawer: {
    backgroundColor: '#2d2d2d',
    borderWidth: 1,
    borderColor: '#4b5563',
    borderTopWidth: 0,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  picker: {
    height: 150, // Enough height to show all options
    width: '100%',
    color: '#fff',
  },
});

export default DrawerField;