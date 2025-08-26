import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, SPACING } from '../../src/constants/theme';
import { ProductList } from '../../src/components/products/ProductList';
import { DeepLinkTester } from '../../src/components/common/DeepLinkTester';
import { Icon } from '../../src/components/common/Icon';
import { useResponsive } from '../../src/hooks/useResponsive';
import { useSearchHistory } from '../../src/hooks/useStorage';
import { useApp, useProducts, useIsLoading, useError, useCart } from '../../src/store';
import { Product } from '../../src/types';

export default function ProductsScreen() {
  const router = useRouter();
  const { isMobile, gridColumns, dimensions } = useResponsive();
  const { actions } = useApp();
  const products = useProducts();
  const isLoading = useIsLoading();
  const error = useError();
  const cart = useCart();
  const { addToSearchHistory } = useSearchHistory();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [showDeepLinkTester, setShowDeepLinkTester] = useState(__DEV__); // Only show in development

  // Filter products based on search query
  useEffect(() => {
    if (!products) return;
    
    if (!searchQuery.trim()) {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
      
      // Add to search history if query is not empty
      if (searchQuery.trim()) {
        addToSearchHistory(searchQuery.trim());
      }
    }
  }, [products, searchQuery, addToSearchHistory]);

  const handleProductPress = useCallback((product: Product) => {
    // Navigate to product details
    router.push(`/product/${product.id}`);
  }, [router]);

  const handleFavoritePress = useCallback(async (productId: string) => {
    try {
      await actions.toggleFavorite(productId);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  }, [actions]);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleRefresh = useCallback(async () => {
    await actions.fetchProducts();
  }, [actions]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={COLORS.backgroundSecondary}
      />
      
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>FlyDubai Store</Text>
            <Text style={styles.subtitle}>Discover amazing products</Text>
          </View>
        </View>
        
        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => router.push('/cart')}
          activeOpacity={0.7}
        >
          <Icon name="shopping-cart" size={24} color={COLORS.textPrimary} />
          {cart.totalItems > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>
                {cart.totalItems > 99 ? '99+' : cart.totalItems}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ProductList
        products={filteredProducts}
        isLoading={isLoading}
        error={error}
        onProductPress={handleProductPress}
        onFavoritePress={handleFavoritePress}
        onRefresh={handleRefresh}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        showSearch={true}
        variant={isMobile ? 'list' : 'grid'}
        style={styles.productList}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  
  header: {
    backgroundColor: COLORS.backgroundSecondary,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
  },
  
  headerContent: {
    flex: 1,
  },
  
  titleContainer: {
    alignItems: 'flex-start',
    paddingVertical: SPACING.sm,
  },
  
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  
  productList: {
    flex: 1,
  },
  
  cartButton: {
    position: 'relative',
    padding: SPACING.sm,
    borderRadius: SPACING.sm,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  
  cartBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: COLORS.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  
  cartBadgeText: {
    color: COLORS.textInverse,
    fontSize: 12,
    fontWeight: 'bold',
  },
  
  debugText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
});
