import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { AddMeasurementModalProps } from '../types/addMeasurementModal';
import DatePickerField from './DatePickerField';
import MeasurementField from './MeasurementField';
import { useMeasurementValidation } from '../hooks/useMeasurementValidation';
import useGrowthMeasurementsStore from '../stores/growthMeasurementsStore';
import useBabyProfileStore from '../stores/babyProfileStore';
import useToastStore from '../stores/toastStore';
import { calculateAllMeasurements } from '../utils/whoCalculations';

const AddMeasurementModal: React.FC<AddMeasurementModalProps> = ({ visible, onClose, editingMeasurement }) => {
  const [date, setDate] = useState(new Date());
  const [weight, setWeight] = useState('');
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>('kg');
  const [height, setHeight] = useState('');
  const [heightUnit, setHeightUnit] = useState<'cm' | 'in'>('cm');
  const [headCircumference, setHeadCircumference] = useState('');
  const [headUnit, setHeadUnit] = useState<'cm' | 'in'>('cm');

  const isEditMode = !!editingMeasurement;
  
  const { errors, validateForm, clearError, clearAllErrors } = useMeasurementValidation();

  // Populate form with editing data
  useEffect(() => {
    if (editingMeasurement && visible) {
      setDate(new Date(editingMeasurement.date));
      setWeight(editingMeasurement.weightInKg.toString());
      setWeightUnit('kg'); // Always use kg as it's stored in standard units
      setHeight(editingMeasurement.heightInCm.toString());
      setHeightUnit('cm'); // Always use cm as it's stored in standard units
      setHeadCircumference(editingMeasurement.headInCm.toString());
      setHeadUnit('cm'); // Always use cm as it's stored in standard units
      clearAllErrors();
    } else if (!editingMeasurement && visible) {
      resetForm();
    }
  }, [editingMeasurement, visible]);
  const { getMeasurementByDate, addMeasurement, updateMeasurement } = useGrowthMeasurementsStore();
  const baby = useBabyProfileStore((state) => state.baby);
  const { showToast } = useToastStore();


  const convertToStandardUnits = () => {
    // Convert weight to kg
    let weightInKg = parseFloat(weight);
    if (weightUnit === 'lbs') {
      weightInKg = weightInKg * 0.453592;
    }

    // Convert height to cm
    let heightInCm = parseFloat(height);
    if (heightUnit === 'in') {
      heightInCm = heightInCm * 2.54;
    }

    // Convert head circumference to cm
    let headInCm = parseFloat(headCircumference);
    if (headUnit === 'in') {
      headInCm = headInCm * 2.54;
    }

    return {
      weightInKg: parseFloat(weightInKg.toFixed(2)),
      heightInCm: parseFloat(heightInCm.toFixed(1)),
      headInCm: parseFloat(headInCm.toFixed(1)),
    };
  };

  const saveMeasurement = (forceUpdate = false) => {
    const selectedDate = date.toISOString().split('T')[0];
    const { weightInKg, heightInCm, headInCm } = convertToStandardUnits();

    if (!baby) {
      Alert.alert('Error', 'Baby profile not found. Please check your baby profile settings.');
      return;
    }

    // Calculate age in days from baby's birth date
    const birthDate = new Date(baby.dateOfBirth);
    const measurementDate = new Date(selectedDate);
    const ageInDays = Math.floor((measurementDate.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24));

    // Calculate WHO percentiles and z-scores
    const calculations = calculateAllMeasurements(
      weightInKg,
      heightInCm,
      headInCm,
      ageInDays,
      baby.gender
    );

    if (isEditMode) {
      // In edit mode, directly update the existing measurement
      const newMeasurement = {
        id: editingMeasurement.id,
        date: selectedDate,
        ageInDays,
        weightInKg,
        heightInCm,
        headInCm,
        ...calculations,
      };
      updateMeasurement(editingMeasurement.id, newMeasurement);
      showToast('Measurement updated successfully', 'success');
    } else {
      // In add mode, check for duplicates
      const existingMeasurement = getMeasurementByDate(selectedDate);
      
      if (existingMeasurement && !forceUpdate) {
        Alert.alert(
          'Measurement Exists',
          `A measurement already exists for ${selectedDate}. Do you want to replace it?`,
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Replace',
              onPress: () => saveMeasurement(true),
              style: 'destructive',
            },
          ]
        );
        return;
      }

      let newMeasurement;
      
      if (existingMeasurement && forceUpdate) {
        // Keep the existing ID when updating
        newMeasurement = {
          id: existingMeasurement.id,
          date: selectedDate,
          ageInDays,
          weightInKg,
          heightInCm,
          headInCm,
          ...calculations,
        };
        updateMeasurement(existingMeasurement.id, newMeasurement);
        showToast('Measurement updated successfully', 'success');
      } else {
        // Generate a new sequential ID for new measurements
        const existingMeasurements = useGrowthMeasurementsStore.getState().getAllMeasurements();
        const maxId = existingMeasurements.reduce((max, measurement) => {
          const idNumber = parseInt(measurement.id.replace('measurement_', ''), 10);
          return isNaN(idNumber) ? max : Math.max(max, idNumber);
        }, -1);
        const newId = `measurement_${maxId + 1}`;

        newMeasurement = {
          id: newId,
          date: selectedDate,
          ageInDays,
          weightInKg,
          heightInCm,
          headInCm,
          ...calculations,
        };
        addMeasurement(newMeasurement);
        showToast('Measurement added successfully', 'success');
      }
    }

    resetForm();
    onClose();
  };

  const handleSave = () => {
    if (!validateForm({
      weight,
      weightUnit,
      height,
      heightUnit,
      headCircumference,
      headUnit,
    })) {
      return;
    }

    saveMeasurement();
  };

  const resetForm = () => {
    setDate(new Date());
    setWeight('');
    setWeightUnit('kg');
    setHeight('');
    setHeightUnit('cm');
    setHeadCircumference('');
    setHeadUnit('cm');
    clearAllErrors();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity 
          style={styles.backdrop} 
          activeOpacity={1} 
          onPress={onClose}
        />
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{isEditMode ? 'Edit Measurement' : 'Add Measurement'}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <View style={styles.formContainer}>
              <View style={styles.infoContainer}>
                <Text style={styles.infoText}>
                  {isEditMode 
                    ? "Update the measurements for this date. The date cannot be changed when editing."
                    : "You can add only one measurement per day. If a measurement already exists for the selected date, you'll be asked to replace it."
                  }
                </Text>
              </View>
              
              <DatePickerField
                label="Date"
                value={date}
                onChange={setDate}
                required
                disabled={isEditMode}
              />
              
              <MeasurementField
                label="Weight"
                value={weight}
                unit={weightUnit}
                unitOptions={[
                  { value: 'kg', label: 'kg' },
                  { value: 'lbs', label: 'lbs' }
                ]}
                onValueChange={(value) => {
                  setWeight(value);
                  if (errors.weight) clearError('weight');
                }}
                onUnitChange={(unit) => setWeightUnit(unit as 'kg' | 'lbs')}
                error={errors.weight}
                required
              />
              
              <MeasurementField
                label="Height"
                value={height}
                unit={heightUnit}
                unitOptions={[
                  { value: 'cm', label: 'cm' },
                  { value: 'in', label: 'in' }
                ]}
                onValueChange={(value) => {
                  setHeight(value);
                  if (errors.height) clearError('height');
                }}
                onUnitChange={(unit) => setHeightUnit(unit as 'cm' | 'in')}
                error={errors.height}
                required
              />
              
              <MeasurementField
                label="Head Circumference"
                value={headCircumference}
                unit={headUnit}
                unitOptions={[
                  { value: 'cm', label: 'cm' },
                  { value: 'in', label: 'in' }
                ]}
                onValueChange={(value) => {
                  setHeadCircumference(value);
                  if (errors.headCircumference) clearError('headCircumference');
                }}
                onUnitChange={(unit) => setHeadUnit(unit as 'cm' | 'in')}
                error={errors.headCircumference}
                required
              />
            </View>
          </ScrollView>

          {/* Footer with Save button */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '70%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2C3E50',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    color: '#7F8C8D',
    fontWeight: '600',
  },
  scrollContent: {
    flex: 1,
    maxHeight: '100%',
  },
  formContainer: {
    padding: 20,
    minHeight: 300,
  },
  infoContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    borderLeftWidth: 3,
    borderLeftColor: '#3498DB',
  },
  infoText: {
    fontSize: 14,
    color: '#5A6C7D',
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E8E8E8',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    marginRight: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BDC3C7',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7F8C8D',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 12,
    marginLeft: 8,
    borderRadius: 8,
    backgroundColor: '#3498DB',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default AddMeasurementModal;