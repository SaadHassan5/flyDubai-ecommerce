import React, { useState, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  Dimensions,
  ScrollView,
} from 'react-native';
import { COLORS, SPACING, BREAKPOINTS } from '../../constants/theme';
import { Product } from '../../types';
import { ProductCard } from './ProductCard';
import { Input } from '../common/Input';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { useResponsive } from '../../hooks/useResponsive';

interface ProductListProps {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  onProductPress: (product: Product) => void;
  onFavoritePress?: (productId: string) => void;
  onRefresh?: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  showSearch?: boolean;
  variant?: 'grid' | 'list';
  style?: any;
}

export const ProductList: React.FC<ProductListProps> = ({
  products,
  isLoading,
  error,
  onProductPress,
  onFavoritePress,
  onRefresh,
  searchQuery = '',
  onSearchChange,
  showSearch = true,
  variant = 'grid',
  style,
}) => {
  const { isMobile, gridColumns } = useResponsive();
  const [refreshing, setRefreshing] = useState(false);
  
  // Ensure we use the correct number of columns
  const actualGridColumns = variant === 'grid' ? gridColumns : 1;

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    if (onRefresh) {
      await onRefresh();
    }
    setRefreshing(false);
  }, [onRefresh]);

  const renderProduct = useCallback(({ item }: { item: Product }) => (
    <ProductCard
      product={item}
      onPress={onProductPress}
      onFavoritePress={onFavoritePress}
      variant={variant}
    />
  ), [onProductPress, onFavoritePress, variant]);

  const keyExtractor = useCallback((item: Product) => item.id, []);

  const getItemLayout = useCallback((data: ArrayLike<Product> | null | undefined, index: number) => {
    const itemHeight = variant === 'grid' ? 280 : 160;
    return {
      length: itemHeight,
      offset: itemHeight * index,
      index,
    };
  }, [variant]);

  const renderEmptyState = () => {
    if (isLoading) {
      return (
        <View style={styles.emptyState}>
          <LoadingSpinner text="Loading products..." />
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.emptyState}>
          <LoadingSpinner text={error} />
        </View>
      );
    }

    if (searchQuery && products.length === 0) {
      return (
        <View style={styles.emptyState}>
          <LoadingSpinner text="No products found" />
        </View>
      );
    }

    return (
      <View style={styles.emptyState}>
        <LoadingSpinner text="No products available" />
      </View>
    );
  };

  const renderFooter = () => {
    if (!isLoading || products.length === 0) return null;
    
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color={COLORS.primary} />
      </View>
    );
  };

  const renderGridItem = useCallback(({ item, index }: { item: Product; index: number }) => (
    <View style={styles.gridItem}>
      <ProductCard
        product={item}
        onPress={onProductPress}
        onFavoritePress={onFavoritePress}
        variant="grid"
      />
    </View>
  ), [onProductPress, onFavoritePress]);

  const renderGridLayout = () => {
    if (variant !== 'grid' || actualGridColumns <= 1) return null;

    const rows = [];
    for (let i = 0; i < products.length; i += actualGridColumns) {
      const row = products.slice(i, i + actualGridColumns);
      rows.push(
        <View key={`row-${i}`} style={styles.gridRow}>
          {row.map((product, index) => (
            <View key={product.id} style={styles.gridItem}>
              <ProductCard
                product={product}
                onPress={onProductPress}
                onFavoritePress={onFavoritePress}
                variant="grid"
              />
            </View>
          ))}
          {/* Fill empty spaces in the last row if needed */}
          {row.length < actualGridColumns && 
            Array.from({ length: actualGridColumns - row.length }).map((_, index) => (
              <View key={`empty-${index}`} style={styles.gridItem} />
            ))
          }
        </View>
      );
    }

    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
        contentContainerStyle={styles.listContent}
      >
        {rows}
      </ScrollView>
    );
  };

  const renderListLayout = () => (
    <FlatList
      data={products}
      renderItem={renderProduct}
      keyExtractor={keyExtractor}
      getItemLayout={getItemLayout}
      numColumns={1}
      key="list-layout"
      contentContainerStyle={[
        styles.listContent,
        products.length === 0 && styles.emptyListContent,
      ]}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          colors={[COLORS.primary]}
          tintColor={COLORS.primary}
        />
      }
      onEndReachedThreshold={0.1}
      ListEmptyComponent={renderEmptyState}
      ListFooterComponent={renderFooter}
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      windowSize={10}
      initialNumToRender={10}
    />
  );

  return (
    <View style={[styles.container, style]}>
      {showSearch && onSearchChange && (
        <View style={styles.searchContainer}>
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChangeText={onSearchChange}
            style={styles.searchInput}
          />
        </View>
      )}

      {variant === 'grid' && actualGridColumns > 1 ? renderGridLayout() : renderListLayout()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  
  searchContainer: {
    padding: SPACING.md,
    backgroundColor: COLORS.backgroundSecondary,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  
  searchInput: {
    marginBottom: 0,
  },
  
  listContent: {
    padding: SPACING.md,
    paddingBottom: SPACING.xxl,
  },
  
  emptyListContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
    gap: SPACING.md, // Add gap between columns
  },
  
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.xxxl,
  },
  
  footer: {
    paddingVertical: SPACING.lg,
    alignItems: 'center',
  },

  gridItem: {
    width: '50%', // For a 2-column grid
    padding: SPACING.md,
  },

  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
});
