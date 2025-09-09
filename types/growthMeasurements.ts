export type WeightUnit = 'kg' | 'lbs';
export type HeightUnit = 'cm' | 'in';
export type HeadUnit = 'cm' | 'in';

export type ISODateString = string & { readonly __brand: 'ISODateString' }; // ISO 8601 date string in UTC

export interface GrowthMeasurement {
  id: string;
  date: string;               // ISO date string (UTC 00:00)
  ageInDays: number;          // derived from birthDate -> date
  weightKg: number;           // stored in SI units
  heightCm: number;           // stored in SI units
  headCm: number;             // stored in SI units
  weightPercentile?: number;
  heightPercentile?: number;
  headPercentile?: number;
}