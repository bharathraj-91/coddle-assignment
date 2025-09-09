import React, { useMemo, memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { GrowthMeasurement } from '../types/growthMeasurements';
import { GrowthChartProps } from '../types/growthChart';
import { isSmallDevice } from '../utils/responsive';
import { getWHOPercentileData, interpolatePercentileValue } from '../utils/whoGrowthData';
import useBabyProfileStore from '../stores/babyProfileStore';

const GrowthChart: React.FC<GrowthChartProps> = memo(({ measurements }) => {
  // Only re-render when baby's name or gender changes, not the whole baby object
  const babyName = useBabyProfileStore((state) => state.baby?.name);
  const babyGender = useBabyProfileStore((state) => state.baby?.gender);
  
  const isSmall = useMemo(() => isSmallDevice(), []);

  // Sort measurements by age for proper chart display
  const sortedMeasurements = useMemo(() => 
    [...measurements].sort((a, b) => a.ageInDays - b.ageInDays),
    [measurements]
  );

  // Calculate chart width first
  const chartWidth = useMemo(() => {
    const screenWidth = isSmall ? 320 : 380;
    const minimalPadding = 16; // Very small padding on both sides
    return screenWidth - minimalPadding;
  }, [isSmall]);

  // Get WHO percentile data for weight-for-age
  const whoPercentileData = useMemo(() => {
    if (!babyGender) return [];
    return getWHOPercentileData(babyGender.toUpperCase() as 'MALE' | 'FEMALE', 'WEIGHT_FOR_AGE');
  }, [babyGender]);

  // Prepare chart data with WHO percentiles and baby's data
  const chartData = useMemo(() => {
    if (!whoPercentileData.length || !sortedMeasurements.length) return null;

    const maxAge = Math.max(...sortedMeasurements.map(m => m.ageInDays));
    const minAge = Math.min(...sortedMeasurements.map(m => m.ageInDays));
    const ageRange = maxAge - minAge;
    
    // Determine optimal grouping interval based on data density
    const availableWidth = chartWidth - 60; // Account for margins
    const targetDataPoints = Math.floor(availableWidth / 15); // ~15px per data point
    const groupingInterval = Math.max(1, Math.ceil(ageRange / targetDataPoints));
    
    // Generate percentile curve data points with adaptive spacing
    const generateCurveData = (percentile: 'P3' | 'P10' | 'P25' | 'P50' | 'P75' | 'P90' | 'P97') => {
      const curveData = [];
      for (let days = minAge; days <= maxAge; days += groupingInterval) {
        const value = interpolatePercentileValue(days, whoPercentileData, percentile);
        curveData.push({
          value,
          label: days % Math.max(30, groupingInterval * 2) === 0 ? `${days}d` : '', // Days labels
        });
      }
      return curveData;
    };

    // Group baby's measurements by interval to prevent overcrowding
    const groupedMeasurements = sortedMeasurements.reduce((groups: { [key: number]: GrowthMeasurement[] }, measurement) => {
      const groupKey = Math.floor((measurement.ageInDays - minAge) / groupingInterval);
      if (!groups[groupKey]) groups[groupKey] = [];
      groups[groupKey].push(measurement);
      return groups;
    }, {});

    // Create data points from grouped measurements (average if multiple in same group)
    const babyWeightData = Object.keys(groupedMeasurements).map((groupKey) => {
      const group = groupedMeasurements[parseInt(groupKey)];
      // Use the latest measurement in each group or average if needed
      const representative = group[group.length - 1];
      const avgWeight = group.reduce((sum, m) => sum + m.weightInKg, 0) / group.length;
      
      return {
        value: avgWeight,
        label: representative.ageInDays % Math.max(30, groupingInterval * 2) === 0 ? `${representative.ageInDays}d` : '',
        dataPointText: '',
      };
    });

    return {
      P3: generateCurveData('P3'),
      P10: generateCurveData('P10'),
      P25: generateCurveData('P25'),
      P50: generateCurveData('P50'),
      P75: generateCurveData('P75'),
      P90: generateCurveData('P90'),
      P97: generateCurveData('P97'),
      babyWeight: babyWeightData,
      groupingInterval,
    };
  }, [whoPercentileData, sortedMeasurements, babyGender, chartWidth]);

  const containerStyle = useMemo(() => [
    styles.container,
    {
      padding: 8, // Minimal padding
      marginHorizontal: 4, // Very small horizontal margin
      marginVertical: isSmall ? 8 : 12,
    }
  ], [isSmall]);

  const LegendItem = ({ color, label }: { color: string; label: string }) => (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Text style={styles.legendText}>{label}</Text>
    </View>
  );

  if (!chartData) {
    return (
      <View style={containerStyle}>
        <Text style={styles.chartTitle}>WHO Weight-for-Age Chart</Text>
        <Text style={styles.noDataText}>Loading chart data...</Text>
      </View>
    );
  }

  return (
    <View style={containerStyle}>
      <Text style={styles.chartTitle}>Weight for age chart</Text>
      
      {/* Legend */}
      <View style={styles.legend}>
        <LegendItem color="#FF6B6B" label="3rd %" />
        <LegendItem color="#4ECDC4" label="50th %" />
        <LegendItem color="#45B7D1" label="97th %" />
        <LegendItem color="#96CEB4" label={babyName || 'Baby'} />
      </View>

      <View style={styles.chartContainer}>
        {/* Y-axis label */}
        <View style={styles.yAxisLabel}>
          <Text style={styles.axisLabelText}>Weight (kg)</Text>
        </View>
        
        <LineChart
          // Baby's actual data - primary line
          data={chartData.babyWeight}
          // WHO Percentile curves
          data2={chartData.P3}
          data3={chartData.P50}
          data4={chartData.P97}
          
          width={chartWidth - 20} // Reduce width to account for internal margins
          height={250}
          spacing={Math.max(1, Math.floor((chartWidth - 80) / Math.max(1, chartData.babyWeight.length - 1)))}
          initialSpacing={15}
          endSpacing={15}
          
          // Baby's data styling
          thickness1={3}
          color1="#96CEB4"
          dataPointsColor1="#96CEB4"
          dataPointsRadius={4}
          
          // WHO percentile lines styling
          thickness2={1.5}
          thickness3={2}
          thickness4={1.5}
          color2="#FF6B6B" // P3
          color3="#4ECDC4" // P50
          color4="#45B7D1" // P97
          hideDataPoints2={true}
          hideDataPoints3={true}
          hideDataPoints4={true}
          
          showVerticalLines={false}
          rulesColor="#E8E8E8"
          rulesType="dashed"
          xAxisColor="#BDC3C7"
          yAxisColor="#BDC3C7"
          xAxisThickness={1}
          yAxisThickness={1}
          xAxisLabelTextStyle={{
            color: '#7F8C8D',
            fontSize: 9,
            fontWeight: '500',
          }}
          yAxisTextStyle={{
            color: '#7F8C8D',
            fontSize: 9,
            fontWeight: '500',
          }}
          hideDataPoints1={false}
          curved={false}
          animationDuration={800}
          isAnimated={true}
        />
        
        {/* X-axis label */}
        <View style={styles.xAxisLabel}>
          <Text style={styles.axisLabelText}>Age (days)</Text>
        </View>
      </View>
      
      <Text style={styles.chartSubtitle}>
        {measurements.length} measurements • WHO Growth Standards
      </Text>
      
      {chartData.groupingInterval > 1 && (
        <Text style={styles.groupingInfo}>
          Data grouped by {chartData.groupingInterval}-day intervals for optimal display
        </Text>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    marginBottom: 8,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 12,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#34495E',
  },
  chartContainer: {
    paddingVertical: 10,
    paddingHorizontal: 10, // Add horizontal padding to contain the chart
    overflow: 'hidden', // Prevent any overflow
  },
  chartSubtitle: {
    fontSize: 12,
    color: '#7F8C8D',
    textAlign: 'center',
    marginTop: 12,
    fontStyle: 'italic',
  },
  noDataText: {
    fontSize: 14,
    color: '#7F8C8D',
    textAlign: 'center',
    marginTop: 20,
  },
  groupingInfo: {
    fontSize: 10,
    color: '#95A5A6',
    textAlign: 'center',
    marginTop: 4,
    fontStyle: 'italic',
  },
  yAxisLabel: {
    position: 'absolute',
    left: 12,
    zIndex: 1,
  },
  xAxisLabel: {
    alignItems: 'center',
  },
  axisLabelText: {
    fontSize: 8,
    fontWeight: '600',
    color: '#34495E',
  },
});

export default GrowthChart;