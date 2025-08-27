import { PixelRatio, Dimensions, Platform } from 'react-native';

// Get screen dimensions
const { width, height } = Dimensions.get('window');
const screenWidth = Math.round(width);
const screenHeight = Math.round(height);

// Base spacing unit
const baseSpacing = 8;

// Platform-specific adjustments
const isWeb = Platform.OS === 'web';
const isMobile = Platform.OS !== 'web';

// Responsive breakpoints
const BREAKPOINTS = {
  mobile: 0,
  tablet: 768,
  desktop: 1024,
  wide: 1440,
} as const;

// Get current breakpoint
const getCurrentBreakpoint = () => {
  if (isWeb) {
    if (typeof window !== 'undefined') {
      const webWidth = window.innerWidth;
      if (webWidth >= BREAKPOINTS.wide) return 'wide';
      if (webWidth >= BREAKPOINTS.desktop) return 'desktop';
      if (webWidth >= BREAKPOINTS.tablet) return 'tablet';
      return 'mobile';
    }
    return 'desktop'; // Default for SSR
  }
  return 'mobile';
};

// Width percentage calculation
export const WP = (widthPercent: number): number => {
  if (isWeb) {
    const webWidth = typeof window !== 'undefined' ? window.innerWidth : 1024;
    return Math.round((webWidth * widthPercent) / 100);
  }
  return PixelRatio.roundToNearestPixel((screenWidth * widthPercent) / 100);
};

// Height percentage calculation
export const HP = (heightPercent: number): number => {
  if (isWeb) {
    const webHeight = typeof window !== 'undefined' ? window.innerHeight : 768;
    return Math.round((webHeight * heightPercent) / 100);
  }
  return PixelRatio.roundToNearestPixel((screenHeight * heightPercent) / 100);
};

// Responsive spacing calculation
export const getResponsiveSpacing = (spacing: number): number => {
  const currentBreakpoint = getCurrentBreakpoint();
  
  if (isWeb) {
    // Web-specific scaling
    const webWidth = typeof window !== 'undefined' ? window.innerWidth : 1024;
    const webHeight = typeof window !== 'undefined' ? window.innerHeight : 768;
    
    // Base scaling factors for web
    let scaleFactor = 1;
    
    switch (currentBreakpoint) {
      case 'wide':
        scaleFactor = 1.2;
        break;
      case 'desktop':
        scaleFactor = 1.0;
        break;
      case 'tablet':
        scaleFactor = 0.9;
        break;
      case 'mobile':
        scaleFactor = 0.8;
        break;
    }
    
    // Additional height-based scaling for web
    const heightFactor = Math.min(webHeight / 768, 1.5);
    const finalSpacing = spacing * scaleFactor * heightFactor;
    
    return Math.round(finalSpacing);
  } else {
    // Mobile-specific scaling (your original logic)
    const shortDimension = width < height ? width : height;
    const longDimension = width < height ? height : width;
    const guidelineBaseWidth = 375;
    const guidelineBaseHeight = 812;
    const scaleFactor = shortDimension / guidelineBaseWidth;
    const vsFactor = longDimension / guidelineBaseHeight;
    const responsiveSpacing = (spacing * scaleFactor * vsFactor) / baseSpacing;
    
    return PixelRatio.roundToNearestPixel(responsiveSpacing);
  }
};

// Vertical scaling for mobile (your original mvs function)
export const mvs = (size: number, factor: number = 0.5): number => {
  if (isWeb) {
    // Web doesn't need vertical scaling like mobile
    return size;
  }
  
  const [shortDimension, longDimension] = width < height ? [width, height] : [height, width];
  const guidelineBaseHeight = 812;
  const vs = (size: number) => longDimension / guidelineBaseHeight * size;
  return size + (vs(size) - size) * factor;
};

// Platform-aware spacing
export const getPlatformSpacing = (mobile: number, web: number): number => {
  return isWeb ? web : mobile;
};

// Responsive spacing with breakpoints
export const getBreakpointSpacing = (
  mobile: number,
  tablet: number,
  desktop: number,
  wide?: number
): number => {
  const currentBreakpoint = getCurrentBreakpoint();
  
  switch (currentBreakpoint) {
    case 'wide':
      return wide || desktop;
    case 'desktop':
      return desktop;
    case 'tablet':
      return tablet;
    case 'mobile':
    default:
      return mobile;
  }
};

// Predefined spacing values
export const SPACING = {
  xs: getResponsiveSpacing(4),
  sm: getResponsiveSpacing(8),
  md: getResponsiveSpacing(16),
  lg: getResponsiveSpacing(24),
  xl: getResponsiveSpacing(32),
  xxl: getResponsiveSpacing(48),
  xxxl: getResponsiveSpacing(64),
} as const;

// Dynamic spacing function
export const spacing = (multiplier: number): number => {
  return getResponsiveSpacing(baseSpacing * multiplier);
};

// Export dimensions for use in components
export { width, height, screenWidth, screenHeight };
export { getCurrentBreakpoint };
