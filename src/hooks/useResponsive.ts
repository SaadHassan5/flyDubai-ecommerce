import { useState, useEffect } from 'react';
import { Dimensions, ScaledSize, Platform } from 'react-native';

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

  // Mock safe area values - in real app, use react-native-safe-area-context
  const safeArea = {
    top: dimensions.width >= 768 ? 20 : 44,
    bottom: dimensions.width >= 768 ? 20 : 34,
    left: dimensions.width >= 768 ? 20 : 0,
    right: dimensions.width >= 768 ? 20 : 0,
  };

  return safeArea;
}

// Hook for screen dimensions (if needed elsewhere)
export function useDimensions() {
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

    // For web, handle window resize events as well
    if (Platform.OS === 'web') {
      const handleResize = () => {
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      };

      window.addEventListener('resize', handleResize);
      return () => {
        subscription?.remove();
        window.removeEventListener('resize', handleResize);
      };
    }

    return () => subscription?.remove();
  }, []);

  return dimensions;
}
