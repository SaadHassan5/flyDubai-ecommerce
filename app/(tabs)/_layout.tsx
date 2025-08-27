import React from 'react';
import { Tabs } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { Icon } from '../../src/components/common/Icon';
import { COLORS } from '../../src/constants/theme';
import { SPACING, WP, HP } from '../../src/constants/spacing';
import { useCart } from '../../src/store';

function CartTabIcon({ color, size }: { color: string; size: number }) {
  const cart = useCart();
  
  return (
    <View style={{ position: 'relative' }}>
      <Icon name="shopping-cart" size={size} color={color} />
      {cart.totalItems > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {cart.totalItems > 99 ? '99+' : cart.totalItems}
          </Text>
        </View>
      )}
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarStyle: {
          backgroundColor: COLORS.backgroundSecondary,
          borderTopColor: COLORS.borderLight,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favorites',
          tabBarIcon: ({ color, size }) => (
            <Icon name="heart" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          tabBarIcon: ({ color, size }) => (
            <CartTabIcon color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: -HP(0.6),
    right: -WP(2),
    backgroundColor: COLORS.error,
    borderRadius: WP(2.5),
    minWidth: WP(5),
    height: HP(2.5),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: WP(1),
  },
  badgeText: {
    color: COLORS.textInverse,
    fontSize: 12,
    fontWeight: 'bold',
  },
});
