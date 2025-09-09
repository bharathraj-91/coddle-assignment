import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { isSmallDevice } from '../utils/responsive';

interface MeasurementCardHeaderProps {
  formattedDate: string;
  formattedAge: string;
  ageInDays: number;
}

const MeasurementCardHeader: React.FC<MeasurementCardHeaderProps> = ({ 
  formattedDate, 
  formattedAge, 
  ageInDays 
}) => {
  return (
    <View style={styles.header}>
      <View style={styles.dateContainer}>
        <Text style={styles.date}>{formattedDate}</Text>
        <Text style={styles.age}>{formattedAge}</Text>
      </View>
      <View style={styles.dayBadge}>
        <Text style={styles.dayText}>Day {ageInDays}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingBottom: 6,
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
});

export default MeasurementCardHeader;