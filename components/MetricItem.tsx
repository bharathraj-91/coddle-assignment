import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface MetricItemProps {
  label: string;
  value: number;
  unit: string;
  percentile: number;
}

const getPercentileColor = (percentile: number): string => {
  if (percentile < 10) return '#E74C3C'; // Red - Low
  if (percentile < 25) return '#F39C12'; // Orange - Below Average
  if (percentile < 75) return '#27AE60'; // Green - Normal
  if (percentile < 90) return '#3498DB'; // Blue - Above Average
  return '#9B59B6'; // Purple - High
};

const getPercentileLabel = (percentile: number): string => {
  if (percentile < 10) return 'Low';
  if (percentile < 25) return 'Below Avg';
  if (percentile < 75) return 'Normal';
  if (percentile < 90) return 'Above Avg';
  return 'High';
};

const MetricItem: React.FC<MetricItemProps> = ({ label, value, unit, percentile }) => {
  return (
    <View style={styles.metricItem}>
      <Text style={styles.metricLabel}>{label}</Text>
      <View style={styles.metricValueContainer}>
        <Text style={styles.metricValue}>
          {value} <Text style={styles.metricUnit}>{unit}</Text>
        </Text>
        <View style={[
          styles.percentileBadge,
          { backgroundColor: getPercentileColor(percentile) }
        ]}>
          <Text style={styles.percentileText}>
            {percentile}% • {getPercentileLabel(percentile)}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  metricItem: {
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
    minWidth: 0, // Ensure flex shrinking works properly
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#34495E',
    marginBottom: 4,
    textAlign: 'center',
  },
  metricValueContainer: {
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 2,
    textAlign: 'center',
  },
  metricUnit: {
    fontSize: 12,
    fontWeight: '500',
    color: '#7F8C8D',
  },
  percentileBadge: {
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 1,
    marginTop: 2,
  },
  percentileText: {
    fontSize: 9,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default MetricItem;