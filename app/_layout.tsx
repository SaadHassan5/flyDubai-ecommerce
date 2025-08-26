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
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

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
