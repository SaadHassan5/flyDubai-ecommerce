import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, SPACING } from '../../src/constants/theme';
import { ProductList } from '../../src/components/products/ProductList';
import { DeepLinkTester } from '../../src/components/common/DeepLinkTester';
import { useResponsive } from '../../src/hooks/useResponsive';
import { useSearchHistory } from '../../src/hooks/useStorage';
import { useApp, useProducts, useIsLoading, useError } from '../../src/store';
import { Product } from '../../src/types';

export default function ProductsScreen() {
  const router = useRouter();
  const { isMobile, gridColumns, dimensions } = useResponsive();
  const { actions } = useApp();
  const products = useProducts();
  const isLoading = useIsLoading();
  const error = useError();
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
  },
  
  headerContent: {
    paddingHorizontal: SPACING.md,
  },
  
  titleContainer: {
    alignItems: 'center',
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
  
  debugText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
});
