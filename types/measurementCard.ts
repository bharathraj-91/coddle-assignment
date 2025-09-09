import { GrowthMeasurement } from './growthMeasurements';

export interface SwipeActions {
  onEdit?: (item: GrowthMeasurement) => void;
  onDelete?: (item: GrowthMeasurement) => void;
  onShare?: (item: GrowthMeasurement) => void;
}

export interface MeasurementCardProps {
  item: GrowthMeasurement;
  swipeActions?: SwipeActions;
}