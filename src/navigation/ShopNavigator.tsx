import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProductListScreen } from '../screens/shop/ProductListScreen';
import { ProductDetailScreen } from '../screens/shop/ProductDetailScreen';
import { CartScreen } from '../screens/shop/CartScreen';
import { CheckoutScreen } from '../screens/shop/CheckoutScreen';

const Stack = createNativeStackNavigator();

export const ShopNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProductList" component={ProductListScreen} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
    </Stack.Navigator>
  );
};
