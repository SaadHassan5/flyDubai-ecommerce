import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Text,
} from 'react-native';
import { COLORS, SPACING } from '../constants/theme';
import { Product } from '../types';
import { ProductList } from '../components/products/ProductList';
import { useProducts } from '../hooks/useApi';
import { useSearchHistory } from '../hooks/useStorage';
import { useResponsive } from '../hooks/useResponsive';

interface HomeScreenProps {
  navigation: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { products, isLoading, error, fetchProducts, searchProducts } = useProducts();
  const { addToSearchHistory } = useSearchHistory();
  const { isMobile } = useResponsive();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  // Fetch products on mount
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Filter products based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredProducts(products || []);
    } else {
      const filtered = (products || []).filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchQuery, products]);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      addToSearchHistory(query);
    }
  }, [addToSearchHistory]);

  const handleProductPress = useCallback((product: Product) => {
    navigation.navigate('ProductDetails', { productId: product.id });
  }, [navigation]);

  const handleFavoritePress = useCallback((productId: string) => {
    // This will be handled by the ProductCard component
    // We can add additional logic here if needed
  }, []);

  const handleRefresh = useCallback(async () => {
    await fetchProducts();
  }, [fetchProducts]);

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

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
};

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
});
