import { GrowthMeasurement } from './growthMeasurements';

export interface AddMeasurementModalProps {
  visible: boolean;
  onClose: () => void;
  editingMeasurement?: GrowthMeasurement | null;
}