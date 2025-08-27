import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { COLORS, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../../src/constants/theme';
import { SPACING, WP, HP, getResponsiveSpacing } from '../../src/constants/spacing';
import { Product } from '../../src/types';
import { useProducts, useFavorites, useApp } from '../../src/store';
import { Icon } from '../../src/components/common/Icon';
import { useToast } from '../../src/components/common/ToastContext';
import { shareProduct } from '../../src/utils/deepLinks';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { actions } = useApp();
  const products = useProducts();
  const favorites = useFavorites();
  const { showToast } = useToast();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  // Find product by ID
  useEffect(() => {
    if (id && products) {
      const foundProduct = products.find(p => p.id === id);
      if (foundProduct) {
        setProduct(foundProduct);
        setIsFavorite(favorites.includes(id));
      }
    }
  }, [id, products, favorites]);

  const handleFavoriteToggle = async () => {
    if (id) {
      try {
        await actions.toggleFavorite(id);
        setIsFavorite(!isFavorite);
      } catch (error) {
        console.error('Error toggling favorite:', error);
      }
    }
  };

  const handleBackPress = () => {
    router.back();
  };

  const handleSharePress = async () => {
    if (id && product) {
      try {
        const result = await shareProduct(id, product.name);
        if (result) {
          Alert.alert(
            'Share Product',
            `Share this product using:\n\nDeep Link: ${result.deepLink}\n\nUniversal Link: ${result.universalLink}`,
            [{ text: 'OK' }]
          );
        }
      } catch (error) {
        console.error('Error sharing product:', error);
        Alert.alert('Error', 'Failed to share product');
      }
    }
  };

  if (!product) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.backgroundSecondary} />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading product...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.backgroundSecondary} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={handleFavoriteToggle}
            activeOpacity={0.7}
          >
            <Icon
              name={isFavorite ? 'heart' : 'heart-o'}
              size={20}
              color={isFavorite ? COLORS.error : COLORS.textSecondary}
            />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.shareButton}
            onPress={handleSharePress}
            activeOpacity={0.7}
          >
            <Icon name="share" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: product.image }} style={styles.productImage} resizeMode="cover" />
        </View>

        {/* Product Info */}
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productDescription}>{product.description}</Text>
          
          <View style={styles.priceContainer}>
            <Text style={styles.price}>${product.price.toFixed(2)}</Text>
            {product.rating && (
              <View style={styles.ratingContainer}>
                <Text style={styles.rating}>⭐ {product.rating}</Text>
                {product.reviews && (
                  <Text style={styles.reviews}>({product.reviews} reviews)</Text>
                )}
              </View>
            )}
          </View>
          
          <TouchableOpacity
            style={styles.addToCartButton}
            onPress={() => {
              actions.addToCart(product, 1);
              showToast(`${product.name} added to cart!`, 'success');
            }}
            activeOpacity={0.8}
          >
            <Icon name="shopping-cart" size={20} color={COLORS.textInverse} />
            <Text style={styles.addToCartText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: WP(4),
    paddingVertical: HP(1),
    backgroundColor: COLORS.backgroundSecondary,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  
  backButton: {
    padding: WP(2),
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.background,
    ...SHADOWS.small,
  },
  
  favoriteButton: {
    padding: WP(2),
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.small,
  },
  
  favoriteButtonActive: {
    backgroundColor: COLORS.errorLight,
    borderColor: COLORS.error,
  },
  
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap:10
  },

  shareButton: {
    padding: WP(2),
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: WP(2),
    ...SHADOWS.small,
  },
  
  content: {
    flex: 1,
  },
  
  imageContainer: {
    width: width,
    height: width * 0.8,
    backgroundColor: COLORS.backgroundSecondary,
  },
  
  productImage: {
    width: '100%',
    height: '100%',
  },
  
  productInfo: {
    padding: WP(6),
  },
  
  productName: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: HP(1),
  },
  
  productDescription: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textSecondary,
    lineHeight: 24,
    marginBottom: HP(3),
  },
  
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: HP(4),
  },
  
  price: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  rating: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textSecondary,
    marginRight: WP(1),
  },
  
  reviews: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textTertiary,
  },
  
  addToCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: HP(2),
    paddingHorizontal: WP(6),
    borderRadius: BORDER_RADIUS.lg,
    ...SHADOWS.medium,
  },
  
  addToCartText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: '600',
    color: COLORS.background,
    marginLeft: WP(2),
  },
  
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  loadingText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textSecondary,
  },
});
