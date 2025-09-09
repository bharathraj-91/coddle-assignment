import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GrowthMeasurement, GrowthMeasurementsStore } from '../types/growthMeasurements';
import { calculateAllMeasurements } from '../utils/whoCalculations';

// Generate 60 days of default measurement data
const generateDefaultMeasurements = (): GrowthMeasurement[] => {
  const measurements: GrowthMeasurement[] = [];
  const startDate = new Date('2025-03-15');
  
  // Get baby's gender from profile store (default to female as per our default baby)
  const gender = 'female'; // Emma is female
  
  // Base values for a newborn girl (using WHO median values)
  let baseWeight = 3.2; // kg (WHO median for newborn girls)
  let baseHeight = 49.1; // cm (WHO median for newborn girls)
  let baseHead = 33.9; // cm (WHO median for newborn girls)
  
  for (let i = 0; i < 60; i++) {
    const measurementDate = new Date(startDate);
    measurementDate.setDate(startDate.getDate() + i);
    
    // Simulate realistic growth patterns based on WHO standards
    // Weight: gains ~25-30g per day in first 2 months
    const weightGain = 0.025 + Math.random() * 0.005;
    baseWeight += weightGain;
    
    // Height: grows ~3.5cm per month
    const heightGain = 0.116 + Math.random() * 0.02;
    baseHeight += heightGain;
    
    // Head: grows ~1.5cm per month
    const headGain = 0.05 + Math.random() * 0.01;
    baseHead += headGain;
    
    // Calculate percentiles and z-scores using WHO data
    const calculations = calculateAllMeasurements(
      parseFloat(baseWeight.toFixed(2)),
      parseFloat(baseHeight.toFixed(1)),
      parseFloat(baseHead.toFixed(1)),
      i,
      gender
    );
    
    measurements.push({
      id: `measurement_${i}`,
      date: measurementDate.toISOString().split('T')[0],
      ageInDays: i,
      weightInKg: parseFloat(baseWeight.toFixed(2)),
      heightInCm: parseFloat(baseHeight.toFixed(1)),
      headInCm: parseFloat(baseHead.toFixed(1)),
      ...calculations
    });
  }
  
  return measurements;
};

// Convert array to Map for performance
const measurementsArrayToMap = (measurements: GrowthMeasurement[]): Map<string, GrowthMeasurement> => {
  const map = new Map<string, GrowthMeasurement>();
  measurements.forEach(m => map.set(m.id, m));
  return map;
};

// Initialize default data
const defaultMeasurements = generateDefaultMeasurements();
const defaultMeasurementsMap = measurementsArrayToMap(defaultMeasurements);
// Sort default measurements from latest to oldest
const defaultSortedIds = defaultMeasurements
  .sort((a, b) => b.date.localeCompare(a.date))
  .map(m => m.id);

const useGrowthMeasurementsStore = create<GrowthMeasurementsStore>()(
  persist(
    (set, get) => ({
      measurements: defaultMeasurementsMap,
      sortedIds: defaultSortedIds,
      
      addMeasurement: (measurement) =>
        set((state) => {
          const newMeasurements = new Map(state.measurements);
          newMeasurements.set(measurement.id, measurement);
          
          // Update sorted IDs (latest to oldest)
          const allMeasurements = Array.from(newMeasurements.values());
          const sortedIds = allMeasurements
            .sort((a, b) => b.date.localeCompare(a.date))
            .map(m => m.id);
          
          return {
            measurements: newMeasurements,
            sortedIds,
          };
        }),
      
      updateMeasurement: (id, updatedMeasurement) =>
        set((state) => {
          const existing = state.measurements.get(id);
          if (!existing) return state;
          
          const newMeasurements = new Map(state.measurements);
          newMeasurements.set(id, { ...existing, ...updatedMeasurement });
          
          return { measurements: newMeasurements };
        }),
      
      deleteMeasurement: (id) =>
        set((state) => {
          const newMeasurements = new Map(state.measurements);
          newMeasurements.delete(id);
          
          const sortedIds = state.sortedIds.filter(sortedId => sortedId !== id);
          
          return {
            measurements: newMeasurements,
            sortedIds,
          };
        }),
      
      getMeasurementById: (id) => {
        const state = get();
        return state.measurements.get(id);
      },
      
      getMeasurementByDate: (date) => {
        const state = get();
        for (const measurement of state.measurements.values()) {
          if (measurement.date === date) return measurement;
        }
        return undefined;
      },
      
      getMeasurementsInRange: (startDate, endDate) => {
        const state = get();
        const results: GrowthMeasurement[] = [];
        
        for (const id of state.sortedIds) {
          const measurement = state.measurements.get(id);
          if (measurement && measurement.date >= startDate && measurement.date <= endDate) {
            results.push(measurement);
          }
          if (measurement && measurement.date > endDate) break;
        }
        
        return results;
      },
      
      getLatestMeasurements: (count) => {
        const state = get();
        const latestIds = state.sortedIds.slice(0, count);
        return latestIds
          .map(id => state.measurements.get(id))
          .filter((m): m is GrowthMeasurement => m !== undefined);
      },
      
      getAllMeasurements: () => {
        const state = get();
        return state.sortedIds
          .map(id => state.measurements.get(id))
          .filter((m): m is GrowthMeasurement => m !== undefined);
      },
    }),
    {
      name: 'growth-measurements-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Custom serialization for Map
      partialize: (state) => ({
        measurements: Array.from(state.measurements.entries()),
        sortedIds: state.sortedIds,
      }),
      // Custom deserialization for Map
      onRehydrateStorage: () => (state) => {
        if (state && Array.isArray(state.measurements)) {
          state.measurements = new Map(state.measurements);
        }
      },
    }
  )
);

export default useGrowthMeasurementsStore;