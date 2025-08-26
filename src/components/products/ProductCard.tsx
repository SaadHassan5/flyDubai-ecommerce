import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import { Product } from '../../types';
import { useResponsive } from '../../hooks/useResponsive';
import { useFavorites, useApp } from '../../store';
import { Icon } from '../common/Icon';
import { useToast } from '../common/ToastContext';

interface ProductCardProps {
  product: Product;
  onPress: (product: Product) => void;
  onFavoritePress?: (productId: string) => void;
  variant?: 'grid' | 'list';
  style?: any;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onPress,
  onFavoritePress,
  variant = 'grid',
  style,
}) => {
  const { isMobile } = useResponsive();
  const favorites = useFavorites();
  const { actions } = useApp();
  const { showToast } = useToast();

  const handleFavoritePress = () => {
    if (onFavoritePress) {
      onFavoritePress(product.id);
    }
  };

  const handleAddToCart = () => {
    actions.addToCart(product, 1);
    showToast(`${product.name} added to cart!`, 'success');
  };

  // Debug favorite state
  const favoriteState = favorites.includes(product.id);

  const cardStyle = [
    styles.card,
    variant === 'grid' ? styles.gridCard : styles.listCard,
    isMobile && styles.mobileCard,
    style,
  ];

  const imageStyle = [
    styles.image,
    variant === 'grid' ? styles.gridImage : styles.listImage,
  ];

  const contentStyle = [
    styles.content,
    variant === 'grid' ? styles.gridContent : styles.listContent,
  ];

  const favoriteButtonStyle = [
    styles.favoriteButton,
    favoriteState && styles.favoriteButtonActive,
  ];

  return (
    <TouchableOpacity
      style={cardStyle}
      onPress={() => onPress(product)}
      activeOpacity={0.8}
      testID="product-card"
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: product.image }}
          style={imageStyle}
          resizeMode="cover"
        />
        <TouchableOpacity
          style={favoriteButtonStyle}
          onPress={handleFavoritePress}
          activeOpacity={0.7}
          testID="favorite-button"
        >
          <Icon
            name={favoriteState ? 'heart' : 'heart-o'}
            size={20}
            color={favoriteState ? COLORS.error : COLORS.textSecondary}
          />
        </TouchableOpacity>
      </View>
      
      <View style={contentStyle}>
        <Text style={styles.productName} numberOfLines={2}>
          {product.name}
        </Text>
        
        <Text style={styles.productDescription} numberOfLines={variant === 'grid' ? 1 : 2}>
          {product.description}
        </Text>
        
        <View style={styles.priceContainer}>
          <Text style={styles.price}>
            ${product.price.toFixed(2)}
          </Text>
          {product.rating && (
            <View style={styles.ratingContainer}>
              <Text style={styles.rating}>⭐ {product.rating}</Text>
              {product.reviews && (
                <Text style={styles.reviews}>({product.reviews})</Text>
              )}
            </View>
          )}
        </View>
        
        <TouchableOpacity
          style={styles.addToCartButton}
          onPress={handleAddToCart}
          activeOpacity={0.7}
          testID="add-to-cart-button"
        >
          <Icon name="shopping-cart" size={16} color={COLORS.textInverse} />
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: BORDER_RADIUS.lg,
    ...SHADOWS.medium,
    overflow: 'hidden',
    width: '100%', // Always take full width of container
  },
  
  gridCard: {
    width: '100%',
    marginBottom: SPACING.md,
  },
  
  listCard: {
    width: '100%',
    marginBottom: SPACING.md,
  },
  
  mobileCard: {
    width: '100%',
  },
  
  imageContainer: {
    position: 'relative',
  },
  
  image: {
    width: '100%',
    height: 200,
  },
  
  gridImage: {
    height: 150,
  },
  
  listImage: {
    height: 120,
  },
  
  favoriteButton: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: BORDER_RADIUS.round,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.small,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  
  favoriteButtonActive: {
    backgroundColor: COLORS.errorLight,
    borderWidth: 2,
    borderColor: COLORS.error,
    ...SHADOWS.medium,
  },
  
  content: {
    padding: SPACING.md,
  },
  
  gridContent: {
    padding: SPACING.sm,
  },
  
  listContent: {
    padding: SPACING.md,
  },
  
  productName: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  
  productDescription: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  price: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.primary,
  },
  
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  rating: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    marginRight: SPACING.xs,
  },
  
  reviews: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textTertiary,
  },

  addToCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.sm,
    marginTop: SPACING.md,
    ...SHADOWS.small,
  },

  addToCartText: {
    color: COLORS.textInverse,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    marginLeft: SPACING.xs,
  },
});
