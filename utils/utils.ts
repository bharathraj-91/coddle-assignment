import {ISODateString, WeightUnit, HeightUnit, HeadUnit} from '../types/growthMeasurements';

export const toISODateString = (date: Date | string): ISODateString => {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) {
    throw new Error('Invalid date provided');
  }
  return d.toISOString() as ISODateString;
};

export const calculateAgeInDays = (
  birthDate: ISODateString, 
  referenceDate: ISODateString = toISODateString(new Date())
): number => {
  // Convert ISO strings to Date objects
  const birth = new Date(birthDate);
  const reference = new Date(referenceDate);
  
  // Input validation
  if (isNaN(birth.getTime())) {
    throw new Error('Invalid birth date provided');
  }
  if (isNaN(reference.getTime())) {
    throw new Error('Invalid reference date provided');
  }
  
  // Strip time component to get calendar days (set to UTC midnight)
  const birthDay = new Date(birth.toISOString().split('T')[0] + 'T00:00:00.000Z');
  const referenceDay = new Date(reference.toISOString().split('T')[0] + 'T00:00:00.000Z');
  const diffMs = referenceDay.getTime() - birthDay.getTime();
  
  // Return 0 if birth date is in future
  if (diffMs < 0) {
    return 0;
  }
  
  // Convert to days (1000ms * 60s * 60min * 24h)
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
};

export const convertWeight = (
  weightKg: number,
  targetUnit: WeightUnit
): number => {
  if (targetUnit === 'kg') {
    // Already in kg, return with 2 decimal places
    return Math.round(weightKg * 100) / 100;
  }
  
  // Convert to lbs (1 kg = 2.20462 lbs)
  const weightLbs = weightKg * 2.20462;
  // Return with 1 decimal place for lbs
  return Math.round(weightLbs * 10) / 10;
};

export const convertHeight = (
  heightCm: number,
  targetUnit: HeightUnit
): number => {
  if (targetUnit === 'cm') {
    // Already in cm, return with 1 decimal place
    return Math.round(heightCm * 10) / 10;
  }
  
  // Convert to inches (1 cm = 0.393701 inches)
  const heightIn = heightCm * 0.393701;
  // Return with 1 decimal place for inches
  return Math.round(heightIn * 10) / 10;
};

export const convertHead = (
  headCm: number,
  targetUnit: HeadUnit
): number => {
  if (targetUnit === 'cm') {
    // Already in cm, return with 1 decimal place
    return Math.round(headCm * 10) / 10;
  }
  
  // Convert to inches (1 cm = 0.393701 inches)
  const headIn = headCm * 0.393701;
  // Return with 1 decimal place for inches
  return Math.round(headIn * 10) / 10;
};