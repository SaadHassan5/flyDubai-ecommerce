import { useState, useEffect } from 'react';
import { Dimensions, ScaledSize, Platform } from 'react-native';
import { BREAKPOINTS } from '../constants/theme';

// Hook for responsive design
export function useResponsive() {
  const [dimensions, setDimensions] = useState({
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  });

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', (result: { window: ScaledSize }) => {
      setDimensions({
        width: result.window.width,
        height: result.window.height,
      });
    });

    return () => subscription?.remove();
  }, []);

  // For web, we need to handle window resize events as well
  useEffect(() => {
    if (Platform.OS === 'web') {
      const handleResize = () => {
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      };

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  const isMobile = dimensions.width < BREAKPOINTS.tablet;
  const isTablet = dimensions.width >= BREAKPOINTS.tablet && dimensions.width < BREAKPOINTS.desktop;
  const isDesktop = dimensions.width >= BREAKPOINTS.desktop;
  const isWide = dimensions.width >= BREAKPOINTS.wide;

  // Grid columns based on screen size - ensure 2 columns on tablet/desktop
  const gridColumns = isMobile ? 1 : 2; // Always 2 columns for tablet and above

  // Responsive spacing
  const getResponsiveSpacing = (mobile: number, tablet: number, desktop: number) => {
    if (isMobile) return mobile;
    if (isTablet) return tablet;
    return desktop;
  };

  // Responsive font size
  const getResponsiveFontSize = (mobile: number, tablet: number, desktop: number) => {
    if (isMobile) return mobile;
    if (isTablet) return tablet;
    return desktop;
  };

  // Responsive padding
  const getResponsivePadding = (mobile: number, tablet: number, desktop: number) => {
    if (isMobile) return mobile;
    if (isTablet) return tablet;
    return desktop;
  };

  // Responsive margin
  const getResponsiveMargin = (mobile: number, tablet: number, desktop: number) => {
    if (isMobile) return mobile;
    if (isTablet) return tablet;
    return desktop;
  };

  return {
    dimensions,
    isMobile,
    isTablet,
    isDesktop,
    isWide,
    gridColumns,
    getResponsiveSpacing,
    getResponsiveFontSize,
    getResponsivePadding,
    getResponsiveMargin,
  };
}

// Hook for orientation changes
export function useOrientation() {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>(
    Dimensions.get('window').width < Dimensions.get('window').height ? 'portrait' : 'landscape'
  );

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', (result: { window: ScaledSize }) => {
      const newOrientation = result.window.width < result.window.height ? 'portrait' : 'landscape';
      setOrientation(newOrientation);
    });

    return () => subscription?.remove();
  }, []);

  return orientation;
}

// Hook for safe area insets
export function useSafeArea() {
  const { dimensions } = useResponsive();
  
  // Mock safe area values - in real app, use react-native-safe-area-context
  const safeArea = {
    top: dimensions.width >= BREAKPOINTS.tablet ? 20 : 44,
    bottom: dimensions.width >= BREAKPOINTS.tablet ? 20 : 34,
    left: dimensions.width >= BREAKPOINTS.tablet ? 20 : 0,
    right: dimensions.width >= BREAKPOINTS.tablet ? 20 : 0,
  };

  return safeArea;
}
