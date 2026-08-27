import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Plus, Minus, Trash2 } from 'lucide-react-native';
import { CartItem } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import { useCartStore } from '../../store/useCartStore';
import { lightPalette, darkPalette, spacing, typography } from '../../theme';

interface CartItemRowProps {
  item: CartItem;
}

export const CartItemRow: React.FC<CartItemRowProps> = ({ item }) => {
  const { themeMode } = useAppStore();
  const { updateQuantity, removeFromCart } = useCartStore();
  const theme = themeMode === 'dark' ? darkPalette : lightPalette;

  const product = item.product;

  return (
    <View style={[styles.container, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
      <Image source={{ uri: product.imageUrl }} style={styles.image} />

      <View style={styles.info}>
        <Text numberOfLines={1} style={[styles.name, { color: theme.textPrimary }]}>
          {product.name}
        </Text>
        <Text style={[styles.brand, { color: theme.textMuted }]}>{product.brand}</Text>
        <Text style={[styles.price, { color: theme.primary }]}>₹{product.price}</Text>
      </View>

      {/* Quantity Control Buttons */}
      <View style={styles.rightSection}>
        <TouchableOpacity
          accessibilityLabel="Remove item"
          onPress={() => removeFromCart(product.id)}
          style={styles.trashBtn}
        >
          <Trash2 color={theme.danger} size={16} />
        </TouchableOpacity>

        <View style={[styles.qtyRow, { borderColor: theme.border }]}>
          <TouchableOpacity
            accessibilityLabel="Decrease quantity"
            onPress={() => updateQuantity(product.id, item.quantity - 1)}
            style={styles.qtyBtn}
          >
            <Minus color={theme.textPrimary} size={14} />
          </TouchableOpacity>

          <Text style={[styles.qtyText, { color: theme.textPrimary }]}>{item.quantity}</Text>

          <TouchableOpacity
            accessibilityLabel="Increase quantity"
            onPress={() => updateQuantity(product.id, item.quantity + 1)}
            style={styles.qtyBtn}
          >
            <Plus color={theme.textPrimary} size={14} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: spacing.borderRadiusMd,
    borderWidth: 1,
    marginBottom: spacing.md,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: spacing.borderRadiusSm,
    backgroundColor: '#F3F4F6',
  },
  info: {
    flex: 1,
    marginLeft: spacing.md,
  },
  name: {
    ...typography.bodyBold,
    fontSize: 14,
  },
  brand: {
    ...typography.caption,
    marginTop: 2,
  },
  price: {
    ...typography.bodyBold,
    marginTop: 4,
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  trashBtn: {
    padding: spacing.xs,
    marginBottom: spacing.xs,
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: spacing.borderRadiusSm,
  },
  qtyBtn: {
    padding: spacing.xs + 2,
  },
  qtyText: {
    ...typography.captionBold,
    paddingHorizontal: spacing.sm,
  },
});
