import React from 'react';
import { StyleSheet, View } from 'react-native';
import MetricItem from './MetricItem';
import { GrowthMeasurement } from '../types/growthMeasurements';

interface MetricsContainerProps {
  item: GrowthMeasurement;
}

const MetricsContainer: React.FC<MetricsContainerProps> = ({ item }) => {
  return (
    <View style={styles.metricsContainer}>
      <MetricItem
        label="Weight"
        value={item.weightInKg}
        unit="kg"
        percentile={item.weightPercentile}
      />
      
      <MetricItem
        label="Height"
        value={item.heightInCm}
        unit="cm"
        percentile={item.heightPercentile}
      />
      
      <MetricItem
        label="Head"
        value={item.headInCm}
        unit="cm"
        percentile={item.headPercentile}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
  },
});

export default MetricsContainer;