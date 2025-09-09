import { useState } from 'react';

interface ValidationData {
  weight: string;
  weightUnit: 'kg' | 'lbs';
  height: string;
  heightUnit: 'cm' | 'in';
  headCircumference: string;
  headUnit: 'cm' | 'in';
}

interface ValidationErrors {
  [key: string]: string;
}

export const useMeasurementValidation = () => {
  const [errors, setErrors] = useState<ValidationErrors>({});

  const isValidNumber = (value: string): boolean => {
    // Allow digits, one decimal point, and prevent leading zeros (except 0.x)
    const numberRegex = /^(0|[1-9]\d*)(\.\d{0,2})?$/;
    return numberRegex.test(value) && !isNaN(parseFloat(value));
  };

  const validateForm = (data: ValidationData): boolean => {
    const newErrors: ValidationErrors = {};

    // Weight validation
    if (!data.weight.trim()) {
      newErrors.weight = 'Weight is required';
    } else if (!isValidNumber(data.weight)) {
      newErrors.weight = 'Please enter a valid weight';
    } else {
      const weightValue = parseFloat(data.weight);
      const maxWeight = data.weightUnit === 'kg' ? 50 : 110; // 50kg or 110lbs max for babies
      if (weightValue <= 0) {
        newErrors.weight = 'Weight must be greater than 0';
      } else if (weightValue > maxWeight) {
        newErrors.weight = `Weight seems too high for a baby (max ${maxWeight}${data.weightUnit})`;
      }
    }

    // Height validation
    if (!data.height.trim()) {
      newErrors.height = 'Height is required';
    } else if (!isValidNumber(data.height)) {
      newErrors.height = 'Please enter a valid height';
    } else {
      const heightValue = parseFloat(data.height);
      const maxHeight = data.heightUnit === 'cm' ? 150 : 59; // 150cm or 59in max for babies
      if (heightValue <= 0) {
        newErrors.height = 'Height must be greater than 0';
      } else if (heightValue > maxHeight) {
        newErrors.height = `Height seems too high for a baby (max ${maxHeight}${data.heightUnit})`;
      }
    }

    // Head circumference validation
    if (!data.headCircumference.trim()) {
      newErrors.headCircumference = 'Head circumference is required';
    } else if (!isValidNumber(data.headCircumference)) {
      newErrors.headCircumference = 'Please enter a valid head circumference';
    } else {
      const headValue = parseFloat(data.headCircumference);
      const maxHead = data.headUnit === 'cm' ? 60 : 24; // 60cm or 24in max for babies
      if (headValue <= 0) {
        newErrors.headCircumference = 'Head circumference must be greater than 0';
      } else if (headValue > maxHead) {
        newErrors.headCircumference = `Head circumference seems too high for a baby (max ${maxHead}${data.headUnit})`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearError = (field: string) => {
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const clearAllErrors = () => {
    setErrors({});
  };

  return {
    errors,
    validateForm,
    clearError,
    clearAllErrors,
  };
};