import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Star, Heart, ShoppingBag } from 'lucide-react-native';
import { Product } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import { useCartStore } from '../../store/useCartStore';
import { lightPalette, darkPalette, spacing, typography } from '../../theme';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';

interface ProductCardProps {
  product: Product;
  onPress: () => void;
}

export const ProductCard = React.memo<ProductCardProps>(({ product, onPress }) => {
  const { themeMode, addToast } = useAppStore();
  const { addToCart, toggleWishlist, isInWishlist } = useCartStore();
  const theme = themeMode === 'dark' ? darkPalette : lightPalette;

  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, 1);
    addToast({
      type: 'success',
      message: 'Added to Cart',
      description: `${product.name} added to your cart.`,
    });
  };

  return (
    <Card elevated style={styles.card}>
      <TouchableOpacity activeOpacity={0.85} onPress={onPress}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: product.imageUrl }} style={styles.image} />

          <TouchableOpacity
            accessibilityLabel="Add to wishlist"
            onPress={() => toggleWishlist(product)}
            style={[styles.wishlistBtn, { backgroundColor: theme.cardBg }]}
          >
            <Heart
              color={isWishlisted ? theme.terracotta : theme.textMuted}
              fill={isWishlisted ? theme.terracotta : 'transparent'}
              size={18}
            />
          </TouchableOpacity>

          <View style={styles.badgeContainer}>
            <Badge
              label={product.doshaTarget}
              variant={product.doshaTarget.toLowerCase() as any}
            />
          </View>
        </View>

        <View style={styles.infoContainer}>
          <Text numberOfLines={1} style={[styles.brand, { color: theme.textMuted }]}>
            {product.brand}
          </Text>
          <Text numberOfLines={2} style={[styles.name, { color: theme.textPrimary }]}>
            {product.name}
          </Text>

          <View style={styles.ratingRow}>
            <Star color={theme.accent} size={14} fill={theme.accent} />
            <Text style={[styles.ratingText, { color: theme.textPrimary }]}>
              {product.rating}
            </Text>
            <Text style={[styles.reviewsCount, { color: theme.textMuted }]}>
              ({product.reviewsCount})
            </Text>
          </View>

          <View style={styles.priceRow}>
            <View style={styles.priceGroup}>
              <Text style={[styles.price, { color: theme.primary }]}>₹{product.price}</Text>
              {product.originalPrice && (
                <Text style={[styles.originalPrice, { color: theme.textMuted }]}>
                  ₹{product.originalPrice}
                </Text>
              )}
            </View>

            <TouchableOpacity
              accessibilityRole="button"
              activeOpacity={0.8}
              onPress={handleAddToCart}
              style={[styles.addBtn, { backgroundColor: theme.primary }]}
            >
              <ShoppingBag color="#FFFFFF" size={14} />
              <Text style={styles.addBtnText}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Card>
  );
});

const styles = StyleSheet.create({
  card: {
    padding: 0,
    overflow: 'hidden',
    marginBottom: spacing.md,
    width: '100%',
  },
  imageContainer: {
    height: 160,
    width: '100%',
    backgroundColor: '#F3F4F6',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  wishlistBtn: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  badgeContainer: {
    position: 'absolute',
    bottom: spacing.xs,
    left: spacing.xs,
  },
  infoContainer: {
    padding: spacing.md,
  },
  brand: {
    ...typography.badge,
    fontSize: 10,
  },
  name: {
    ...typography.bodyBold,
    fontSize: 14,
    marginTop: 2,
    height: 38,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  ratingText: {
    ...typography.captionBold,
    marginLeft: 4,
  },
  reviewsCount: {
    ...typography.caption,
    marginLeft: 2,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  priceGroup: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    ...typography.h3,
    fontSize: 16,
  },
  originalPrice: {
    ...typography.caption,
    textDecorationLine: 'line-through',
    marginLeft: spacing.xs,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm + 2,
    borderRadius: spacing.borderRadiusSm,
  },
  addBtnText: {
    ...typography.captionBold,
    color: '#FFFFFF',
    marginLeft: 4,
  },
});
