import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AvatarProps } from '../types/avatar';

const Avatar: React.FC<AvatarProps> = React.memo(({ 
  name, 
  size = 60, 
  backgroundColor = '#4A90E2',
  textColor = '#FFFFFF' 
}) => {
  const initials = useMemo(() => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  }, [name]);

  const avatarStyle = useMemo(() => [
    styles.avatar, 
    { 
      width: size, 
      height: size, 
      backgroundColor,
      borderRadius: size / 2
    }
  ], [size, backgroundColor]);

  const textStyle = useMemo(() => [
    styles.initials, 
    { 
      fontSize: size * 0.4,
      color: textColor 
    }
  ], [size, textColor]);

  return (
    <View style={avatarStyle}>
      <Text style={textStyle}>
        {initials}
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  avatar: {
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  initials: {
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});

Avatar.displayName = 'Avatar';

export default Avatar;