import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

interface DatePickerFieldProps {
  label: string;
  value: Date;
  onChange: (date: Date) => void;
  required?: boolean;
  disabled?: boolean;
}

const DatePickerField: React.FC<DatePickerFieldProps> = ({ 
  label, 
  value, 
  onChange, 
  required = false,
  disabled = false
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (selectedDate && selectedDate <= new Date()) {
      onChange(selectedDate);
    }
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const hideDatePicker = () => {
    setShowDatePicker(false);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString();
  };

  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}{required && ' *'}</Text>
      <TouchableOpacity 
        style={[styles.dateButton, disabled && styles.dateButtonDisabled]} 
        onPress={disabled ? undefined : showDatepicker}
        disabled={disabled}
      >
        <Text style={[styles.dateButtonText, disabled && styles.dateButtonTextDisabled]}>
          {formatDate(value)}
        </Text>
      </TouchableOpacity>
      
      {showDatePicker && (
        <Modal
          animationType="fade"
          transparent={true}
          visible={showDatePicker}
          onRequestClose={hideDatePicker}
        >
          <View style={styles.datePickerOverlay}>
            <View style={styles.datePickerContainer}>
              <View style={styles.datePickerHeader}>
                <TouchableOpacity onPress={hideDatePicker}>
                  <Text style={styles.datePickerButton}>Cancel</Text>
                </TouchableOpacity>
                <Text style={styles.datePickerTitle}>Select Date</Text>
                <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                  <Text style={styles.datePickerButton}>Done</Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={value}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleDateChange}
                maximumDate={new Date()}
                style={styles.datePickerWheel}
              />
            </View>
          </View>
        </Modal>
      )}
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
  dateButton: {
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FAFBFC',
    justifyContent: 'center',
  },
  dateButtonText: {
    fontSize: 16,
    color: '#2C3E50',
  },
  dateButtonDisabled: {
    backgroundColor: '#F5F5F5',
    borderColor: '#D0D0D0',
  },
  dateButtonTextDisabled: {
    color: '#999999',
  },
  datePickerOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  datePickerContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: '85%',
    maxHeight: '60%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  datePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  datePickerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
  },
  datePickerButton: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3498DB',
  },
  datePickerWheel: {
    height: 200,
  },
});

export default DatePickerField;