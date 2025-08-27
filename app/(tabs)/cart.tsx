import React, { useCallback } from 'react';
import { 
  StyleSheet, 
  SafeAreaView, 
  StatusBar, 
  Text, 
  View, 
  FlatList, 
  TouchableOpacity,
  Alert 
} from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '../../src/constants/theme';
import { SPACING, WP, HP } from '../../src/constants/spacing';
import { useCart, useApp } from '../../src/store';
import { Icon } from '../../src/components/common/Icon';
import { useToast } from '../../src/components/common/ToastContext';

export default function CartScreen() {
  const router = useRouter();
  const { actions } = useApp();
  const cart = useCart();
  const { showToast } = useToast();
  
  const handleBackPress = useCallback(() => {
    router.back();
  }, [router]);

  const handleQuantityChange = useCallback((productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      Alert.alert(
        'Remove Item',
        'Would you like to remove this item from your cart?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Remove', style: 'destructive', onPress: () => {
            actions.removeFromCart(productId);
            showToast('Item removed from cart', 'info');
          }}
        ]
      );
    } else {
      actions.updateCartQuantity(productId, newQuantity);
      showToast('Cart updated', 'success');
    }
  }, [actions, showToast]);

  const handleCheckout = useCallback(() => {
    if (cart.items.length === 0) {
      Alert.alert('Empty Cart', 'Please add some items to your cart before checkout.');
      return;
    }
    Alert.alert('Checkout', 'Proceeding to checkout...');
    // TODO: Implement checkout flow
  }, [cart.items.length]);

  const handleClearCart = useCallback(() => {
    Alert.alert(
      'Clear Cart',
      'Are you sure you want to remove all items from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: () => {
          actions.clearCart();
          showToast('Cart cleared', 'info');
        }}
      ]
    );
  }, [actions, showToast]);

  const renderCartItem = useCallback(({ item }: { item: any }) => (
    <View style={styles.cartItem}>
      <View style={styles.itemImageContainer}>
        <Icon name="image" size={40} color={COLORS.textSecondary} />
      </View>
      
      <View style={styles.itemDetails}>
        <Text style={styles.itemName} numberOfLines={2}>
          {item.product.name}
        </Text>
        <Text style={styles.itemPrice}>
          ${item.product.price.toFixed(2)}
        </Text>
        
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => handleQuantityChange(item.productId, item.quantity - 1)}
          >
            <Icon name="minus" size={16} color={COLORS.primary} />
          </TouchableOpacity>
          
          <Text style={styles.quantityText}>{item.quantity}</Text>
          
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => handleQuantityChange(item.productId, item.quantity + 1)}
          >
            <Icon name="plus" size={16} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.itemActions}>
        <Text style={styles.itemTotal}>
          ${(item.product.price * item.quantity).toFixed(2)}
        </Text>
        
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => {
            actions.removeFromCart(item.productId);
            showToast('Item removed from cart', 'info');
          }}
        >
          <Icon name="trash" size={20} color={COLORS.error} />
        </TouchableOpacity>
      </View>
    </View>
  ), [actions, handleQuantityChange]);

  const renderEmptyCart = () => (
    <View style={styles.emptyCart}>
      <Icon name="shopping-cart" size={80} color={COLORS.textSecondary} />
      <Text style={styles.emptyCartTitle}>Your cart is empty</Text>
      <Text style={styles.emptyCartSubtitle}>
        Add some products to get started
      </Text>
      <TouchableOpacity
        style={styles.shopNowButton}
        onPress={() => router.push('/')}
      >
        <Text style={styles.shopNowButtonText}>Shop Now</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={COLORS.backgroundSecondary}
      />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <Text style={styles.title}>Shopping Cart</Text>
          {cart.items.length > 0 && (
            <Text style={styles.itemCount}>
              {cart.totalItems} {cart.totalItems === 1 ? 'item' : 'items'}
            </Text>
          )}
        </View>
        
        {cart.items.length > 0 && (
          <TouchableOpacity onPress={handleClearCart} style={styles.clearButton}>
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      {cart.items.length === 0 ? (
        renderEmptyCart()
      ) : (
        <>
          <FlatList
            data={cart.items}
            renderItem={renderCartItem}
            keyExtractor={(item) => item.productId}
            contentContainerStyle={styles.cartList}
            showsVerticalScrollIndicator={false}
          />
          
          <View style={styles.footer}>
            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalAmount}>
                ${cart.totalPrice.toFixed(2)}
              </Text>
            </View>
            
            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={handleCheckout}
            >
              <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: WP(4),
  },
  
  backButton: {
    padding: WP(2),
    marginRight: WP(2),
  },
  
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: HP(0.5),
  },
  
  itemCount: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  
  clearButton: {
    padding: WP(2),
  },
  
  clearButtonText: {
    color: COLORS.error,
    fontSize: 16,
    fontWeight: '500',
  },
  
  emptyCart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: WP(6),
  },
  
  emptyCartTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginTop: HP(3),
    marginBottom: HP(1),
  },
  
  emptyCartSubtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: HP(6),
  },
  
  shopNowButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: WP(6),
    paddingVertical: HP(2),
    borderRadius: WP(4),
  },
  
  shopNowButtonText: {
    color: COLORS.textInverse,
    fontSize: 16,
    fontWeight: '600',
  },
  
  cartList: {
    padding: WP(4),
    paddingBottom: HP(6),
  },
  
  cartItem: {
    flexDirection: 'row',
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: WP(4),
    padding: WP(4),
    marginBottom: HP(2),
    alignItems: 'center',
  },
  
  itemImageContainer: {
    width: WP(15),
    height: HP(7.5),
    borderRadius: WP(2),
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: WP(4),
  },
  
  itemDetails: {
    flex: 1,
  },
  
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: HP(0.5),
  },
  
  itemPrice: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: HP(1),
  },
  
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginHorizontal: WP(4),
    minWidth: WP(7.5),
    textAlign: 'center',
  },
  
  itemActions: {
    alignItems: 'flex-end',
  },
  
  itemTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: HP(1),
  },
  
  removeButton: {
    padding: WP(2),
  },
  
  footer: {
    backgroundColor: COLORS.backgroundSecondary,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    padding: WP(4),
  },
  
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: HP(2),
  },
  
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  
  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  
  checkoutButton: {
    backgroundColor: COLORS.primary,
    borderRadius: WP(4),
    paddingVertical: HP(2),
    alignItems: 'center',
  },
  
  checkoutButtonText: {
    color: COLORS.textInverse,
    fontSize: 18,
    fontWeight: '600',
  },
});
