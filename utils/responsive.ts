import { Dimensions, ScaledSize } from 'react-native';

// Get current screen dimensions
export const getScreenDimensions = (): ScaledSize => {
  return Dimensions.get('window');
};

export const getScreenWidth = (): number => {
  return getScreenDimensions().width;
};

export const getScreenHeight = (): number => {
  return getScreenDimensions().height;
};

// Breakpoints based on common device sizes
export const BREAKPOINTS = {
  SMALL: 375,    // iPhone SE and smaller Android phones
  MEDIUM: 414,   // iPhone 11 Pro, regular phones
  LARGE: 768,    // iPad Mini, small tablets
  XLARGE: 1024,  // iPad, large tablets
} as const;

// Device type detection
export const isSmallDevice = (): boolean => {
  return getScreenWidth() < BREAKPOINTS.SMALL;
};

export const isMediumDevice = (): boolean => {
  const width = getScreenWidth();
  return width >= BREAKPOINTS.SMALL && width < BREAKPOINTS.MEDIUM;
};

export const isLargeDevice = (): boolean => {
  const width = getScreenWidth();
  return width >= BREAKPOINTS.MEDIUM && width < BREAKPOINTS.LARGE;
};

export const isTablet = (): boolean => {
  return getScreenWidth() >= BREAKPOINTS.LARGE;
};

export const isPhone = (): boolean => {
  return getScreenWidth() < BREAKPOINTS.LARGE;
};

// Responsive value calculator
export const getResponsiveValue = <T>(values: {
  small?: T;
  medium?: T;
  large?: T;
  xlarge?: T;
  default: T;
}): T => {
  const width = getScreenWidth();
  
  if (width >= BREAKPOINTS.XLARGE && values.xlarge !== undefined) {
    return values.xlarge;
  }
  if (width >= BREAKPOINTS.LARGE && values.large !== undefined) {
    return values.large;
  }
  if (width >= BREAKPOINTS.SMALL && values.medium !== undefined) {
    return values.medium;
  }
  if (width < BREAKPOINTS.SMALL && values.small !== undefined) {
    return values.small;
  }
  
  return values.default;
};

// Common responsive utilities
export const getResponsivePadding = (): number => {
  return getResponsiveValue({
    small: 10,
    medium: 12,
    large: 14,
    default: 12,
  });
};

export const getResponsiveMargin = (): number => {
  return getResponsiveValue({
    small: 16,
    medium: 20,
    large: 24,
    default: 20,
  });
};

export const getResponsiveFontSize = (baseFontSize: number): number => {
  const scaleFactor = getResponsiveValue({
    small: 0.9,
    medium: 1,
    large: 1.1,
    default: 1,
  });
  
  return Math.round(baseFontSize * scaleFactor);
};

export const getResponsiveAvatarSize = (): number => {
  return getResponsiveValue({
    small: 40,
    medium: 50,
    large: 60,
    default: 50,
  });
};

// Orientation detection
export const isLandscape = (): boolean => {
  const { width, height } = getScreenDimensions();
  return width > height;
};

export const isPortrait = (): boolean => {
  return !isLandscape();
};

// Device info object for convenience
export const getDeviceInfo = () => {
  const { width, height } = getScreenDimensions();
  
  return {
    width,
    height,
    isSmall: isSmallDevice(),
    isMedium: isMediumDevice(),
    isLarge: isLargeDevice(),
    isTablet: isTablet(),
    isPhone: isPhone(),
    isLandscape: isLandscape(),
    isPortrait: isPortrait(),
  };
};