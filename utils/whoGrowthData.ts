import whoData from '../who-growth-chart-data.json';

export interface WHODataPoint {
  month: number;
  P3: number;
  P10: number;
  P25: number;
  P50: number;
  P75: number;
  P90: number;
  P97: number;
}

export const getWHOPercentileData = (gender: 'MALE' | 'FEMALE', measurementType: 'WEIGHT_FOR_AGE' | 'heightForAge' | 'circumferenceForAge'): WHODataPoint[] => {
  const genderData = whoData[gender];
  if (!genderData || !genderData[measurementType]) return [];
  
  const measurements = genderData[measurementType] as any;
  const result: WHODataPoint[] = [];
  
  // Extract data for months 0-60 (0-5 years)
  for (let month = 0; month <= 60; month++) {
    const monthData = measurements[month.toString()];
    if (monthData?.PERCENTILES) {
      result.push({
        month,
        P3: monthData.PERCENTILES.P3,
        P10: monthData.PERCENTILES.P15, // Use P15 as closest to P10
        P25: monthData.PERCENTILES.P25,
        P50: monthData.PERCENTILES.P50,
        P75: monthData.PERCENTILES.P75,
        P90: monthData.PERCENTILES.P85, // Use P85 as closest to P90
        P97: monthData.PERCENTILES.P97,
      });
    }
  }
  
  return result;
};

export const interpolatePercentileValue = (ageInDays: number, percentileData: WHODataPoint[], percentile: 'P3' | 'P10' | 'P25' | 'P50' | 'P75' | 'P90' | 'P97'): number => {
  const ageInMonths = ageInDays / 30.44; // Average days per month
  
  // Find the two closest data points
  const lowerMonth = Math.floor(ageInMonths);
  const upperMonth = Math.ceil(ageInMonths);
  
  const lowerData = percentileData.find(d => d.month === lowerMonth);
  const upperData = percentileData.find(d => d.month === upperMonth);
  
  if (!lowerData || !upperData || lowerMonth === upperMonth) {
    return lowerData?.[percentile] || upperData?.[percentile] || 0;
  }
  
  // Linear interpolation
  const ratio = (ageInMonths - lowerMonth) / (upperMonth - lowerMonth);
  const lowerValue = lowerData[percentile];
  const upperValue = upperData[percentile];
  
  return lowerValue + (upperValue - lowerValue) * ratio;
};

export const getPercentileFromValue = (value: number, ageInDays: number, gender: 'MALE' | 'FEMALE', measurementType: 'WEIGHT_FOR_AGE' | 'heightForAge' | 'circumferenceForAge'): number => {
  const ageInMonths = Math.round(ageInDays / 30.44);
  const genderData = whoData[gender];
  
  if (!genderData || !genderData[measurementType]) return 50;
  
  const monthData = (genderData[measurementType] as any)[ageInMonths.toString()];
  if (!monthData?.PERCENTILES) return 50;
  
  const percentiles = monthData.PERCENTILES;
  
  // Find which percentile range the value falls into
  if (value <= percentiles.P3) return Math.max(1, (value / percentiles.P3) * 3);
  if (value <= percentiles.P15) return 3 + ((value - percentiles.P3) / (percentiles.P15 - percentiles.P3)) * 12;
  if (value <= percentiles.P25) return 15 + ((value - percentiles.P15) / (percentiles.P25 - percentiles.P15)) * 10;
  if (value <= percentiles.P50) return 25 + ((value - percentiles.P25) / (percentiles.P50 - percentiles.P25)) * 25;
  if (value <= percentiles.P75) return 50 + ((value - percentiles.P50) / (percentiles.P75 - percentiles.P50)) * 25;
  if (value <= percentiles.P85) return 75 + ((value - percentiles.P75) / (percentiles.P85 - percentiles.P75)) * 10;
  if (value <= percentiles.P97) return 85 + ((value - percentiles.P85) / (percentiles.P97 - percentiles.P85)) * 12;
  
  return Math.min(99, 97 + ((value - percentiles.P97) / (percentiles.P99 - percentiles.P97)) * 2);
};