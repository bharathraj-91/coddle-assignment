import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BabyProfileProps } from '../types/babyProfile';
import { calculateAgeInDays, toISODateString, formatAge } from '../utils/utils';
import { isSmallDevice, getResponsiveAvatarSize, getResponsivePadding, getResponsiveMargin } from '../utils/responsive';
import Avatar from './Avatar';

const BabyProfileComponent: React.FC<BabyProfileProps> = React.memo(({ baby }) => {
  const isSmall = useMemo(() => isSmallDevice(), []);
  
  const birthDateISO = useMemo(() => toISODateString(baby.dateOfBirth), [baby.dateOfBirth]);
  const ageInDays = useMemo(() => calculateAgeInDays(birthDateISO), [birthDateISO]);
  const formattedAge = useMemo(() => formatAge(ageInDays), [ageInDays]);

  const genderEmoji = useMemo(() => baby.gender === 'female' ? '👧' : '👦', [baby.gender]);
  const genderColor = useMemo(() => baby.gender === 'female' ? '#FF6B9D' : '#4A90E2', [baby.gender]);

  const capitalizedGender = useMemo(() => 
    baby.gender.charAt(0).toUpperCase() + baby.gender.slice(1), 
    [baby.gender]
  );

  const formattedBirthDate = useMemo(() => 
    baby.dateOfBirth.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: isSmall ? undefined : 'numeric'
    }), 
    [baby.dateOfBirth, isSmall]
  );

  const genderValueStyle = useMemo(() => [
    styles.detailValue, 
    { color: genderColor }
  ], [genderColor]);

  const avatarSize = useMemo(() => getResponsiveAvatarSize(), []);
  const containerPadding = useMemo(() => getResponsivePadding(), []);
  const containerMargin = useMemo(() => getResponsiveMargin(), []);
  
  const containerStyle = useMemo(() => [
    styles.container,
    {
      padding: containerPadding,
      marginHorizontal: containerMargin,
      marginVertical: isSmall ? 6 : 8,
    }
  ], [containerPadding, containerMargin, isSmall]);
  
  const detailsContainerStyle = useMemo(() => [
    styles.detailsContainer,
    isSmall && styles.detailsContainerSmall
  ], [isSmall]);

  const avatarSectionStyle = useMemo(() => [
    styles.avatarSection,
    isSmall && { marginRight: 12 }
  ], [isSmall]);

  return (
    <View style={containerStyle}>
      <View style={avatarSectionStyle}>
        <Avatar 
          name={baby.name} 
          size={avatarSize} 
          backgroundColor={genderColor}
        />
        <Text style={styles.genderEmoji}>{genderEmoji}</Text>
      </View>
      
      <View style={styles.infoSection}>
        <View style={styles.mainInfo}>
          <Text style={styles.name}>{baby.name}</Text>
          <Text style={styles.age}>{formattedAge}</Text>
        </View>
        
        <View style={detailsContainerStyle}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Gender</Text>
            <Text style={genderValueStyle}>
              {capitalizedGender}
            </Text>
          </View>
          
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Born</Text>
            <Text style={styles.detailValue}>
              {formattedBirthDate}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginVertical: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarSection: {
    position: 'relative',
    marginRight: 16,
  },
  genderEmoji: {
    position: 'absolute',
    bottom: -3,
    right: -3,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 1,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0.5,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  infoSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mainInfo: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 2,
  },
  age: {
    fontSize: 13,
    color: '#7F8C8D',
    fontWeight: '500',
  },
  detailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailItem: {
    alignItems: 'center',
    marginLeft: 16,
  },
  detailLabel: {
    fontSize: 10,
    color: '#95A5A6',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2C3E50',
  },
  detailsContainerSmall: {
    marginLeft: 8,
  },
});

BabyProfileComponent.displayName = 'BabyProfileComponent';

export default BabyProfileComponent;