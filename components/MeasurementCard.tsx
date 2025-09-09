import React, { useMemo } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { MeasurementCardProps } from '../types/measurementCard';
import { formatAge } from '../utils/utils';
import { getResponsivePadding, getResponsiveMargin, isSmallDevice } from '../utils/responsive';
import MeasurementCardHeader from './MeasurementCardHeader';
import MetricsContainer from './MetricsContainer';
import SwipeActions from './SwipeActions';

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
    swipeActions?.onEdit?.(item);
  };

  const handleDelete = () => {
    // Reset swipe position
    translateX.value = withSpring(0);
    swipeActions?.onDelete?.(item);
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



  return (
    <View style={[containerStyle, { backgroundColor: 'transparent' }]}>
      {/* Background Actions */}
      <SwipeActions 
        translateX={translateX}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Main Card */}
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.container, {
          padding: responsivePadding,
          marginHorizontal: responsiveMargin,
          marginVertical: isSmall ? 4 : 6,
        }, animatedCardStyle]}>
          <MeasurementCardHeader 
            formattedDate={formattedDate}
            formattedAge={formattedAge}
            ageInDays={item.ageInDays}
          />
          <MetricsContainer item={item} />
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
});

MeasurementCard.displayName = 'MeasurementCard';

export default MeasurementCard;