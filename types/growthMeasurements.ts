export type WeightUnit = 'kg' | 'lbs';
export type HeightUnit = 'cm' | 'in';
export type HeadUnit = 'cm' | 'in';

export type ISODateString = string & { readonly __brand: 'ISODateString' }; // ISO 8601 date string in UTC

export interface GrowthMeasurement {
  id: string;
  date: string;               // ISO date string (UTC 00:00)
  ageInDays: number;          // derived from birthDate -> date
  weightInKg: number;           // stored in SI units
  heightInCm: number;           // stored in SI units
  headInCm: number;             // stored in SI units
  weightPercentile: number;
  weightZScore: number;
  heightPercentile: number;
  heightZScore: number;
  headPercentile: number;
  headZScore: number;
}

export interface GrowthMeasurementsStore {
  measurements: Map<string, GrowthMeasurement>;
  sortedIds: string[];
  addMeasurement: (measurement: GrowthMeasurement) => void;
  updateMeasurement: (id: string, measurement: Partial<GrowthMeasurement>) => void;
  deleteMeasurement: (id: string) => void;
  getMeasurementById: (id: string) => GrowthMeasurement | undefined;
  getMeasurementByDate: (date: string) => GrowthMeasurement | undefined;
  getMeasurementsInRange: (startDate: string, endDate: string) => GrowthMeasurement[];
  getLatestMeasurements: (count: number) => GrowthMeasurement[];
  getAllMeasurements: () => GrowthMeasurement[];
}