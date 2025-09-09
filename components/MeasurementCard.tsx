import React, { useMemo } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { MeasurementCardProps } from '../types/measurementCard';
import { formatAge } from '../utils/utils';
import { getResponsivePadding, getResponsiveMargin, isSmallDevice } from '../utils/responsive';

const SWIPE_THRESHOLD = 100;

const MeasurementCard: React.FC<MeasurementCardProps> = React.memo(({ item, swipeActions }) => {
  const isSmall = useMemo(() => isSmallDevice(), []);
  const responsivePadding = useMemo(() => getResponsivePadding(), []);
  const responsiveMargin = useMemo(() => getResponsiveMargin(), []);
  
  // Animation values
  const translateX = useSharedValue(0);
  
  const formattedAge = useMemo(() => formatAge(item.ageInDays), [item.ageInDays]);
  
  const formattedDate = useMemo(() => {
    const date = new Date(item.date);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: isSmall ? undefined : 'numeric'
    });
  }, [item.date, isSmall]);

  const containerStyle = useMemo(() => [
    styles.container,
    {
      padding: responsivePadding,
      marginHorizontal: responsiveMargin,
      marginVertical: isSmall ? 4 : 6,
    }
  ], [responsivePadding, responsiveMargin, isSmall]);

  // Swipe actions
  const handleEdit = () => {
    // Reset swipe position
    translateX.value = withSpring(0);
    Alert.alert(
      'Edit Measurement',
      `Edit measurement from ${formattedDate}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Edit', 
          onPress: () => swipeActions?.onEdit?.(item)
        }
      ]
    );
  };

  const handleDelete = () => {
    // Reset swipe position
    translateX.value = withSpring(0);
    Alert.alert(
      'Delete Measurement',
      `Are you sure you want to delete the measurement from ${formattedDate}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => swipeActions?.onDelete?.(item)
        }
      ]
    );
  };

  // Gesture handlers
  
  const panGesture = Gesture.Pan()
    .activeOffsetX([-10, 10]) // Only activate after 10px horizontal movement
    .failOffsetY([-10, 10])   // Fail if vertical movement exceeds 10px
    .onUpdate((event) => {
      // Only allow left swipe (negative translation)
      if (event.translationX < 0) {
        translateX.value = event.translationX;
      }
    })
    .onEnd((event) => {
      if (event.translationX < -SWIPE_THRESHOLD) {
        // Keep the card swiped to reveal actions
        translateX.value = withSpring(-160); // Show both buttons
      } else {
        // Reset position if not swiped enough
        translateX.value = withSpring(0);
      }
    });

  const animatedCardStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value }, // Full movement, no scaling
      ],
    };
  });


  const actionsStyle = useAnimatedStyle(() => ({
    opacity: Math.max(0, Math.min(1, -translateX.value / SWIPE_THRESHOLD)),
  }));

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

  const MetricItem = ({ label, value, unit, percentile }: {
    label: string;
    value: number;
    unit: string;
    percentile: number;
  }) => (
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

  return (
    <View style={[containerStyle, { backgroundColor: 'transparent' }]}>
      {/* Background Actions */}
      <Animated.View style={[styles.actionsContainer, actionsStyle]}>
        <TouchableOpacity onPress={handleEdit} style={styles.editButton}>
          <Text style={styles.editButtonText}>✏️ Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
          <Text style={styles.deleteButtonText}>🗑️ Delete</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Main Card */}
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.container, {
          padding: responsivePadding,
          marginHorizontal: responsiveMargin,
          marginVertical: isSmall ? 4 : 6,
        }, animatedCardStyle]}>
          <View style={styles.header}>
            <View style={styles.dateContainer}>
              <Text style={styles.date}>{formattedDate}</Text>
              <Text style={styles.age}>{formattedAge}</Text>
            </View>
            <View style={styles.dayBadge}>
              <Text style={styles.dayText}>Day {item.ageInDays}</Text>
            </View>
          </View>

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
        </Animated.View>
      </GestureDetector>
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
    marginBottom: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F8F9FA',
  },
  dateContainer: {
    flex: 1,
  },
  date: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 2,
  },
  age: {
    fontSize: 13,
    color: '#7F8C8D',
    fontWeight: '500',
  },
  dayBadge: {
    backgroundColor: '#E8F4FD',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  dayText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3498DB',
  },
  metricsContainer: {
    gap: 8,
  },
  metricItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#34495E',
    flex: 1,
  },
  metricValueContainer: {
    alignItems: 'flex-end',
    flex: 2,
  },
  metricValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 3,
  },
  metricUnit: {
    fontSize: 14,
    fontWeight: '500',
    color: '#7F8C8D',
  },
  percentileBadge: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  percentileText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  actionsContainer: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 160,
    flexDirection: 'row',
    borderRadius: 16,
  },
  editButton: {
    flex: 1,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#FFEBEE',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
  },
  editButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3498DB',
    textAlign: 'center',
  },
  deleteButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#E74C3C',
    textAlign: 'center',
  },
});

MeasurementCard.displayName = 'MeasurementCard';

export default MeasurementCard;