import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';

interface MeasurementFieldProps {
  label: string;
  value: string;
  unit: string;
  unitOptions: { value: string; label: string }[];
  onValueChange: (value: string) => void;
  onUnitChange: (unit: string) => void;
  error?: string;
  required?: boolean;
}

const MeasurementField: React.FC<MeasurementFieldProps> = ({
  label,
  value,
  unit,
  unitOptions,
  onValueChange,
  onUnitChange,
  error,
  required = false,
}) => {
  const filterNumericInput = (inputValue: string): string => {
    // Remove any non-digit and non-decimal characters
    let filtered = inputValue.replace(/[^0-9.]/g, '');
    
    // Ensure only one decimal point
    const decimalCount = (filtered.match(/\./g) || []).length;
    if (decimalCount > 1) {
      const firstDecimalIndex = filtered.indexOf('.');
      filtered = filtered.substring(0, firstDecimalIndex + 1) + 
                filtered.substring(firstDecimalIndex + 1).replace(/\./g, '');
    }
    
    // Limit to 2 decimal places
    if (filtered.includes('.')) {
      const [whole, decimal] = filtered.split('.');
      if (decimal && decimal.length > 2) {
        filtered = `${whole}.${decimal.substring(0, 2)}`;
      }
    }
    
    return filtered;
  };

  const handleValueChange = (inputValue: string) => {
    const filtered = filterNumericInput(inputValue);
    onValueChange(filtered);
  };

  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}{required && ' *'}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={[
            styles.textInput,
            styles.measurementInput,
            error && styles.textInputError
          ]}
          value={value}
          onChangeText={handleValueChange}
          placeholder="0.0"
          placeholderTextColor="#BDC3C7"
          keyboardType="decimal-pad"
        />
        <View style={styles.unitSelector}>
          {unitOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.unitButton,
                unit === option.value && styles.unitButtonActive
              ]}
              onPress={() => onUnitChange(option.value)}
            >
              <Text
                style={[
                  styles.unitText,
                  unit === option.value && styles.unitTextActive
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  fieldContainer: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#2C3E50',
    backgroundColor: '#FAFBFC',
  },
  measurementInput: {
    flex: 1,
    marginRight: 12,
  },
  textInputError: {
    borderColor: '#E74C3C',
    borderWidth: 1.5,
  },
  unitSelector: {
    flexDirection: 'row',
    backgroundColor: '#F0F0F0',
    borderRadius: 6,
  },
  unitButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  unitButtonActive: {
    backgroundColor: '#3498DB',
  },
  unitText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7F8C8D',
  },
  unitTextActive: {
    color: '#FFFFFF',
  },
  errorText: {
    fontSize: 12,
    color: '#E74C3C',
    marginTop: 4,
    marginLeft: 4,
  },
});

export default MeasurementField;