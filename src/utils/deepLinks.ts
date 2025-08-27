import * as Linking from 'expo-linking';
import { router } from 'expo-router';

// Deep link patterns
export const DEEP_LINK_PATTERNS = {
  PRODUCT: '/product/:id',
  CATEGORY: '/category/:name',
  SEARCH: '/search?q=:query',
  FAVORITES: '/favorites',
  HOME: '/',
} as const;

// Simple URL parser for deep links
function parseDeepLinkUrl(url: string) {
  try {
    // Remove the scheme part
    const cleanUrl = url.replace(/^[^:]+:\/\//, '');
    
    // Split by '/' to get path segments
    const segments = cleanUrl.split('/').filter(Boolean);
    
    // Extract query parameters if they exist
    const queryParams: Record<string, string> = {};
    const pathSegments = segments.filter(segment => !segment.includes('='));
    
    segments.forEach(segment => {
      if (segment.includes('=')) {
        const [key, value] = segment.split('=');
        if (key && value) {
          queryParams[key] = decodeURIComponent(value);
        }
      }
    });
    
    return {
      path: '/' + pathSegments.join('/'),
      queryParams,
      segments: pathSegments
    };
  } catch (error) {
    console.error('Error parsing deep link URL:', error);
    return null;
  }
}

// Parse deep link URL and navigate accordingly
export function handleDeepLink(url: string) {
  try {
    // Use custom parser for reliability
    const parsedUrl = parseDeepLinkUrl(url);
    
    if (!parsedUrl) {
      return false;
    }

    // Handle product links
    if (parsedUrl.path?.startsWith('/product/')) {
      const productId = parsedUrl.path.split('/product/')[1];
      if (productId) {
        router.push(`/product/${productId}`);
        return true;
      }
    }

    // Handle category links
    if (parsedUrl.path?.startsWith('/category/')) {
      const categoryName = parsedUrl.path.split('/category/')[1];
      if (categoryName) {
        // You can implement category navigation here
        return true;
      }
    }

    // Handle search links
    if (parsedUrl.path === '/search' && parsedUrl.queryParams?.q) {
      const query = parsedUrl.queryParams.q;
      // You can implement search navigation here
      return true;
    }

    // Handle favorites link
    if (parsedUrl.path === '/favorites') {
      router.push('/(tabs)/favorites');
      return true;
    }

    // Handle home link
    if (parsedUrl.path === '/') {
      router.push('/(tabs)');
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error handling deep link:', error);
    return false;
  }
}

// Generate deep link URL for a product
export function generateProductLink(productId: string): string {
  return `flydubaiecommerceapp://product/${productId}`;
}

// Generate universal link URL for a product (for sharing)
export function generateUniversalProductLink(productId: string, domain: string = 'flydubaiecommerceapp.com'): string {
  return `https://${domain}/product/${productId}`;
}

// Share product via deep link
export async function shareProduct(productId: string, productName: string) {
  try {
    const deepLink = generateProductLink(productId);
    const universalLink = generateUniversalProductLink(productId);
    
    // You can implement sharing logic here
    // For example, using expo-sharing or react-native-share
    
    return { deepLink, universalLink };
  } catch (error) {
    console.error('Error sharing product:', error);
    return null;
  }
}

// Test deep link functionality
export function testDeepLinks() {
  // Test product link
  const productLink = generateProductLink('123');
  
  // Test universal link
  const universalLink = generateUniversalProductLink('123');
  
  // Test parsing without navigation
  try {
    const parsedUrl = parseDeepLinkUrl(productLink);
    
    if (parsedUrl) {
      // URL parsing successful
    } else {
      // URL parsing failed
    }
  } catch (error) {
    console.error('Error testing URL parsing:', error);
  }
  
  // Test full deep link handling
  try {
    const result = handleDeepLink(productLink);
    // Deep link test completed
  } catch (error) {
    console.error('Error testing deep link:', error);
  }
}

// Simple test function that doesn't rely on navigation
export function testDeepLinkParsing() {
  const testUrls = [
    'flydubaiecommerceapp://product/123',
    'flydubaiecommerceapp://favorites',
    'flydubaiecommerceapp://',
    'flydubaiecommerceapp://search?q=test'
  ];
  
  testUrls.forEach((url, index) => {
    try {
      const parsed = parseDeepLinkUrl(url);
      if (parsed) {
        // Success
      } else {
        // Failed to parse
      }
    } catch (error) {
      // Error occurred
    }
  });
}
