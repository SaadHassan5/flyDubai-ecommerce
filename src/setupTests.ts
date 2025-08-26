// Jest setup file for React Native testing

// Mock Dimensions first - this must be done before any components are imported
jest.mock('react-native/Libraries/Utilities/Dimensions', () => ({
  get: jest.fn(() => ({ width: 375, height: 812 })),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
}));

// Mock StyleSheet to avoid Dimensions issues
jest.mock('react-native/Libraries/StyleSheet/StyleSheet', () => ({
  create: (styles: any) => styles,
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock expo-router
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    canGoBack: jest.fn(() => true),
  }),
  useLocalSearchParams: () => ({}),
  Link: 'Link',
}));

// Mock expo-linking
jest.mock('expo-linking', () => ({
  createURL: jest.fn(),
  useURL: jest.fn(),
}));

// Mock expo-font
jest.mock('expo-font', () => ({
  useFonts: jest.fn(() => [true]),
}));

// Mock Image component
jest.mock('react-native/Libraries/Image/Image', () => 'Image');

// Mock FlatList
jest.mock('react-native/Libraries/Lists/FlatList', () => 'FlatList');

// Mock ScrollView
jest.mock('react-native/Libraries/Components/ScrollView/ScrollView', () => 'ScrollView');

// Mock TouchableOpacity
jest.mock('react-native/Libraries/Components/Touchable/TouchableOpacity', () => 'TouchableOpacity');

// Mock TextInput
jest.mock('react-native/Libraries/Components/TextInput/TextInput', () => 'TextInput');

// Mock StatusBar
jest.mock('react-native/Libraries/Components/StatusBar/StatusBar', () => 'StatusBar');

// Mock SafeAreaView
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: 'SafeAreaView',
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
}));

// Global test utilities
global.console = {
  ...console,
  // Uncomment to ignore a specific log level
  // log: jest.fn(),
  // debug: jest.fn(),
  // info: jest.fn(),
  // warn: jest.fn(),
  error: jest.fn(),
};

// Mock fetch globally
global.fetch = jest.fn();

// Setup global test environment
beforeEach(() => {
  jest.clearAllMocks();
  jest.clearAllTimers();
});

afterEach(() => {
  jest.restoreAllMocks();
});
