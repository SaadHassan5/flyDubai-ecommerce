import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, SafeAreaView, StatusBar, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '../../src/constants/theme';
import { SPACING, WP, HP } from '../../src/constants/spacing';
import { Product } from '../../src/types';
import { ProductList } from '../../src/components/products/ProductList';
import { useProducts, useFavorites, useIsLoading, useError, useApp } from '../../src/store';
import { getCurrentBreakpoint } from '../../src/constants/spacing';

export default function FavoritesScreen() {
  const router = useRouter();
  const { actions } = useApp();
  const products = useProducts();
  const favorites = useFavorites();
  const isLoading = useIsLoading();
  const error = useError();
  const currentBreakpoint = getCurrentBreakpoint();
  const isMobile = currentBreakpoint === 'mobile';
  
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);

  // Filter products to show only favorites
  useEffect(() => {
    if (products && favorites) {
      const filtered = products.filter(product => favorites.includes(product.id));
      setFavoriteProducts(filtered);
    }
  }, [products, favorites]);

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
            <Text style={styles.title}>My Favorites</Text>
            <Text style={styles.subtitle}>
              {favoriteProducts.length > 0 
                ? `${favoriteProducts.length} saved products` 
                : 'No favorites yet'
              }
            </Text>
          </View>
        </View>
      </View>

      <ProductList
        products={favoriteProducts}
        isLoading={false}
        error={error}
        onProductPress={handleProductPress}
        onFavoritePress={handleFavoritePress}
        onRefresh={handleRefresh}
        showSearch={false}
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
    paddingTop: HP(2),
    paddingBottom: HP(1),
  },
  
  headerContent: {
    paddingHorizontal: WP(4),
  },
  
  titleContainer: {
    alignItems: 'center',
    paddingVertical: HP(1),
  },
  
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: HP(0.5),
  },
  
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  
  productList: {
    flex: 1,
  },
});
