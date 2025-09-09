import whoData from '../who-growth-chart-data.json';

type Gender = 'male' | 'female';
type MeasurementType = 'weight' | 'height' | 'head';

interface LMSParams {
  L: number;
  M: number;
  S: number;
}

function getWHOData(gender: Gender, measurementType: MeasurementType, ageInMonths: number) {
  const genderKey = gender === 'female' ? 'FEMALE' : 'MALE';
  let measurementKey: string;
  
  switch (measurementType) {
    case 'weight':
      measurementKey = 'WEIGHT_FOR_AGE';
      break;
    case 'height':
      measurementKey = 'heightForAge';
      break;
    case 'head':
      measurementKey = 'circumferenceForAge';
      break;
  }
  
  const data = (whoData as any)[genderKey][measurementKey];
  
  // WHO data is keyed by month (0-12)
  const monthKey = Math.min(Math.floor(ageInMonths), 12).toString();
  
  // Handle nested structure for head circumference month 11
  if (measurementType === 'head' && monthKey === '11' && data[monthKey]?.[monthKey]) {
    return data[monthKey][monthKey];
  }
  
  return data[monthKey];
}

function calculateZScore(value: number, lms: LMSParams): number {
  const { L, M, S } = lms;
  
  if (L === 0) {
    // When L = 0, use the formula: Z = ln(X/M) / S
    return Math.log(value / M) / S;
  } else {
    // Standard formula: Z = [(X/M)^L - 1] / (L * S)
    return (Math.pow(value / M, L) - 1) / (L * S);
  }
}

function calculatePercentileFromValue(value: number, whoDataPoint: any): number {
  // Use the actual percentile values from WHO data for more accuracy
  const percentiles = whoDataPoint.PERCENTILES;
  
  // Check against the percentile thresholds
  if (value <= percentiles.P1) return 1;
  if (value <= percentiles.P3) return interpolate(percentiles.P1, 1, percentiles.P3, 3, value);
  if (value <= percentiles.P5) return interpolate(percentiles.P3, 3, percentiles.P5, 5, value);
  if (value <= percentiles.P15) return interpolate(percentiles.P5, 5, percentiles.P15, 15, value);
  if (value <= percentiles.P25) return interpolate(percentiles.P15, 15, percentiles.P25, 25, value);
  if (value <= percentiles.P50) return interpolate(percentiles.P25, 25, percentiles.P50, 50, value);
  if (value <= percentiles.P75) return interpolate(percentiles.P50, 50, percentiles.P75, 75, value);
  if (value <= percentiles.P85) return interpolate(percentiles.P75, 75, percentiles.P85, 85, value);
  if (value <= percentiles.P95) return interpolate(percentiles.P85, 85, percentiles.P95, 95, value);
  if (value <= percentiles.P97) return interpolate(percentiles.P95, 95, percentiles.P97, 97, value);
  if (value <= percentiles.P99) return interpolate(percentiles.P97, 97, percentiles.P99, 99, value);
  
  return 99;
}

function interpolate(x1: number, y1: number, x2: number, y2: number, x: number): number {
  return y1 + ((x - x1) / (x2 - x1)) * (y2 - y1);
}

function calculatePercentileFromZScore(zScore: number): number {
  // Fallback: Using error function approximation for normal CDF
  // CDF(z) = 0.5 * (1 + erf(z / sqrt(2)))
  const a1 =  0.254829592;
  const a2 = -0.284496736;
  const a3 =  1.421413741;
  const a4 = -1.453152027;
  const a5 =  1.061405429;
  const p  =  0.3275911;
  
  const sign = zScore >= 0 ? 1 : -1;
  const x = Math.abs(zScore) / Math.sqrt(2);
  const t = 1.0 / (1.0 + p * x);
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
  
  const percentile = 50 * (1 + sign * y);
  
  // Clamp between 0.1 and 99.9
  return Math.max(0.1, Math.min(99.9, percentile));
}

export function calculateGrowthPercentiles(
  value: number,
  measurementType: MeasurementType,
  ageInDays: number,
  gender: Gender
): { percentile: number; zScore: number } {
  const ageInMonths = ageInDays / 30.44; // Average days per month
  
  const whoDataPoint = getWHOData(gender, measurementType, ageInMonths);
  
  if (!whoDataPoint?.LMS) {
    // Fallback for missing data
    return {
      percentile: 50,
      zScore: 0
    };
  }
  
  const zScore = calculateZScore(value, whoDataPoint.LMS);
  const percentile = calculatePercentileFromValue(value, whoDataPoint);
  
  return {
    percentile: Math.round(percentile),
    zScore: parseFloat(zScore.toFixed(2))
  };
}

export function calculateAllMeasurements(
  weightInKg: number,
  heightInCm: number,
  headInCm: number,
  ageInDays: number,
  gender: Gender
) {
  const weight = calculateGrowthPercentiles(weightInKg, 'weight', ageInDays, gender);
  const height = calculateGrowthPercentiles(heightInCm, 'height', ageInDays, gender);
  const head = calculateGrowthPercentiles(headInCm, 'head', ageInDays, gender);
  
  return {
    weightPercentile: weight.percentile,
    weightZScore: weight.zScore,
    heightPercentile: height.percentile,
    heightZScore: height.zScore,
    headPercentile: head.percentile,
    headZScore: head.zScore
  };
}