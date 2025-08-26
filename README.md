# FlyDubai E-Commerce Mobile App

A cross-platform e-commerce mobile application built with React Native/Expo and TypeScript, designed to work seamlessly on iOS, Android, and Web platforms.

## 🚀 Features

### Core Features
- **Product List Screen**: Display products in responsive grid/list layout
- **Product Details Screen**: Detailed product view with favorite toggle
- **Favorites Screen**: Manage and view favorited products
- **Search Functionality**: Client-side product search with history
- **Responsive Design**: Adaptive layout for mobile, tablet, and desktop
- **Cross-platform**: Single codebase for iOS, Android, and Web

### Technical Features
- **TypeScript**: Full type safety throughout the codebase
- **State Management**: Context API with useReducer for app state
- **Custom Hooks**: Reusable hooks for API calls, storage, and responsive design
- **Axios Interceptors**: Centralized API error handling and logging
- **AsyncStorage**: Persistent favorites and user preferences
- **Responsive Design**: Breakpoint-based responsive utilities
- **Component Architecture**: Reusable, composable components

## 🛠 Tech Stack

- **Framework**: React Native 0.79.6
- **Language**: TypeScript 5.8.3
- **Navigation**: Expo Router 5.1.5
- **State Management**: React Context API + useReducer
- **HTTP Client**: Axios with interceptors
- **Storage**: @react-native-async-storage/async-storage
- **Testing**: Jest + @testing-library/react-native
- **Styling**: React Native StyleSheet
- **Platform**: Expo SDK 53

## 📱 Screenshots

*Screenshots will be added here showing the app running on different platforms*

## 🏗 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── common/         # Basic components (Button, Input, etc.)
│   └── products/       # Product-specific components
├── constants/          # App constants and configuration
│   ├── api.ts         # API endpoints and HTTP constants
│   └── theme.ts       # Colors, typography, spacing, breakpoints
├── hooks/              # Custom React hooks
│   ├── useApi.ts      # API operation hooks
│   ├── useStorage.ts  # Storage operation hooks
│   └── useResponsive.ts # Responsive design hooks
├── services/           # Business logic and external services
│   ├── api.ts         # API service with axios interceptors
│   └── storage.ts     # AsyncStorage service
├── store/              # State management
│   └── index.ts       # Context provider and reducer
├── types/              # TypeScript type definitions
│   └── index.ts       # App-wide types and interfaces
└── utils/              # Utility functions
    ├── validation.ts  # Form validation helpers
    └── helpers.ts     # General utility functions
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v22 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS testing)
- Android Studio/Emulator (for Android testing)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd flyDubai-ecommerce
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Install additional required packages**
   ```bash
   npm install axios @react-native-async-storage/async-storage
   # or
   yarn add axios @react-native-async-storage/async-storage
   ```

4. **Start the development server**
   ```bash
   npm start
   # or
   yarn start
   ```

### Running on Different Platforms

```bash
# Run on iOS
npm run ios

# Run on Android
npm run android

# Run on Web
npm run web
```

### Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

## 🏗 Technical Decisions & Architecture

### State Management Approach
- **Context API + useReducer**: Chosen for simplicity and built-in React support
- **Rationale**: For this app size, Context API provides sufficient state management without external dependencies
- **Benefits**: Lightweight, no additional packages, easy testing, predictable state updates

### Component Architecture
- **Atomic Design**: Components organized by complexity (common → products → screens)
- **Composition over Inheritance**: Components designed to be composable and reusable
- **Props Interface**: Strong TypeScript interfaces for all component props
- **Separation of Concerns**: UI components separate from business logic

### Data Persistence Strategy
- **AsyncStorage**: Cross-platform storage solution
- **Service Layer**: Abstracted storage operations in dedicated service
- **Error Handling**: Graceful fallbacks for storage failures
- **Data Validation**: Type-safe storage operations

### Performance Considerations
- **Memoization**: useCallback and useMemo for expensive operations
- **Lazy Loading**: FlatList with optimized rendering
- **Image Optimization**: Proper image sizing and caching
- **State Updates**: Minimal re-renders through proper state structure

### Security Considerations
- **Input Validation**: Client-side validation for user inputs
- **API Security**: Axios interceptors for request/response handling
- **Data Sanitization**: Utility functions for data cleaning
- **Error Boundaries**: Graceful error handling without exposing sensitive data

### Testing Strategy
- **Component Testing**: React Native Testing Library for component tests
- **Hook Testing**: Custom hook testing with renderHook
- **Mock Strategy**: Service layer mocking for isolated testing
- **Coverage Goals**: Focus on critical user paths and business logic

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:
```env
API_BASE_URL=https://mocki.io/v1
API_TIMEOUT=10000
```

### Theme Customization
Modify `src/constants/theme.ts` to customize:
- Color palette
- Typography scales
- Spacing system
- Breakpoints
- Shadows and borders

### API Configuration
Update `src/constants/api.ts` for:
- API endpoints
- Timeout settings
- Retry configurations

## 📱 Platform-Specific Considerations

### iOS
- Safe area handling
- iOS-specific navigation patterns
- Platform-specific icons and styling

### Android
- Material Design guidelines
- Android navigation patterns
- Platform-specific components

### Web
- Responsive breakpoints
- Keyboard navigation support
- Web-specific optimizations

## 🧪 Testing

### Test Structure
- **Unit Tests**: Individual component and utility function tests
- **Integration Tests**: Hook and service integration tests
- **Component Tests**: User interaction and rendering tests

### Running Tests
```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- ProductCard.test.tsx
```

### Test Examples
- Component rendering and user interactions
- Hook state management and side effects
- Service layer error handling
- Utility function edge cases

## 🚀 Deployment

### Building for Production
```bash
# Build for iOS
expo build:ios

# Build for Android
expo build:android

# Build for Web
expo build:web
```

### App Store Deployment
- Configure app.json with proper metadata
- Set up code signing certificates
- Follow platform-specific deployment guides

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the code examples

## 🔮 Future Enhancements

- **User Authentication**: Login/signup system
- **Payment Integration**: Stripe or similar payment processor
- **Offline Support**: Service worker for web, offline storage for mobile
- **Push Notifications**: Product updates and promotions
- **Analytics**: User behavior tracking
- **Performance Monitoring**: Crash reporting and performance metrics

## 🔗 Deep Linking

The app supports both custom scheme deep links and universal links for seamless navigation and sharing.

### **Supported Deep Link Patterns:**

#### **Custom Scheme Links:**
- **Product Details**: `flydubaiecommerceapp://product/123`
- **Favorites**: `flydubaiecommerceapp://favorites`
- **Home**: `flydubaiecommerceapp://`
- **Search**: `flydubaiecommerceapp://search?q=keyword`

#### **Universal Links (Web URLs):**
- **Product Details**: `https://yourdomain.com/product/123`
- **Favorites**: `https://yourdomain.com/favorites`
- **Home**: `https://yourdomain.com/`

### **Testing Deep Links:**

#### **1. Development Testing:**
- Use the **Deep Link Tester** component (visible only in development)
- Test button generates sample deep links
- Check console for parsing results

#### **2. Manual Testing:**
```bash
# Test product deep link
npx uri-scheme open "flydubaiecommerceapp://product/123" --ios
npx uri-scheme open "flydubaiecommerceapp://product/123" --android

# Test favorites deep link
npx uri-scheme open "flydubaiecommerceapp://favorites" --ios
npx uri-scheme open "flydubaiecommerceapp://favorites" --android
```

#### **3. Browser Testing:**
- Open deep link URLs in mobile browser
- Should redirect to app if installed
- Falls back to app store if not installed

#### **4. Cross-App Testing:**
- Send deep links via messaging apps
- Share links from other apps
- Test universal link fallbacks

### **Deep Link Implementation:**

#### **File Structure:**
```
app/
├── product/[id].tsx          # Product detail route
├── _layout.tsx               # Root layout with deep link handling
└── (tabs)/
    ├── index.tsx             # Products tab with navigation
    ├── favorites.tsx         # Favorites tab with navigation
    └── _layout.tsx           # Tab navigator layout

src/
├── utils/
│   └── deepLinks.ts          # Deep link utilities
└── components/
    └── common/
        └── DeepLinkTester.tsx # Development testing component
```

#### **Key Features:**
- **Automatic Parsing**: Incoming deep links are automatically parsed and routed
- **Universal Support**: Works with both custom schemes and web URLs
- **Fallback Handling**: Graceful fallbacks for unsupported links
- **Development Tools**: Built-in testing and debugging tools

### **Configuration:**

#### **app.json:**
```json
{
  "expo": {
    "scheme": "flydubaiecommerceapp",
    "ios": {
      "associatedDomains": ["applinks:yourdomain.com"]
    },
    "android": {
      "intentFilters": [
        {
          "action": "VIEW",
          "autoVerify": true,
          "data": [
            {
              "scheme": "https",
              "host": "yourdomain.com",
              "pathPrefix": "/product"
            }
          ],
          "category": ["BROWSABLE", "DEFAULT"]
        }
      ]
    }
  }
}
```

#### **Customization:**
- Update `yourdomain.com` with your actual domain
- Add more path patterns as needed
- Configure additional intent filters for Android
- Set up associated domains for iOS

### **Usage Examples:**

#### **Sharing Products:**
```typescript
import { shareProduct } from '../utils/deepLinks';

// Share a product
const result = await shareProduct('123', 'Product Name');
```

#### **Generating Links:**
```typescript
import { generateProductLink, generateUniversalProductLink } from '../utils/deepLinks';

// Generate custom scheme link
const deepLink = generateProductLink('123');
// Result: flydubaiecommerceapp://product/123

// Generate universal link
const universalLink = generateUniversalProductLink('123');
// Result: https://yourdomain.com/product/123
```

#### **Custom Deep Link Handling:**
```typescript
import { handleDeepLink } from '../utils/deepLinks';

// Handle custom deep link
const handled = handleDeepLink('flydubaiecommerceapp://product/123');
if (handled) {
  // Deep link handled successfully
}
```

### **Troubleshooting:**

#### **Common Issues:**
1. **Deep links not working**: Check scheme configuration in app.json
2. **Universal links failing**: Verify associated domains and intent filters
3. **Navigation not working**: Ensure routes are properly configured
4. **Testing issues**: Use Deep Link Tester component for debugging

#### **Debug Steps:**
1. Check console logs for deep link events
2. Verify URL parsing in deep link utilities
3. Test with simple deep links first
4. Ensure proper route configuration
5. Check platform-specific settings

### **Production Considerations:**

- **Domain Verification**: Set up proper domain verification for universal links
- **Fallback URLs**: Configure fallback URLs for web users
- **Analytics**: Track deep link usage and conversion rates
- **Security**: Validate deep link parameters and prevent abuse
- **Testing**: Test deep links across different platforms and scenarios
