import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { AppProvider } from '../src/store';
import * as Linking from 'expo-linking';
import { handleDeepLink } from '../src/utils/deepLinks';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  // Handle deep links
  useEffect(() => {
    const handleIncomingDeepLink = (url: string) => {
      const handled = handleDeepLink(url);
      if (handled) {
      } else {
      }
    };

    Linking.getInitialURL().then((url) => {
      if (url) {
        handleIncomingDeepLink(url);
      }
    });

    // Listen for incoming deep links when app is already running
    const subscription = Linking.addEventListener('url', (event) => {
      handleIncomingDeepLink(event.url);
    });

    return () => {
      subscription?.remove();
    };
  }, []);

  return (
    <AppProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
          <Stack.Screen 
            name="product/[id]" 
            options={{ 
              headerShown: false,
              presentation: 'card',
            }} 
          />
        </Stack>
      </ThemeProvider>
    </AppProvider>
  );
}
