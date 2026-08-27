import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { ChevronLeft, Star, Heart, CheckCircle2, ShieldAlert } from 'lucide-react-native';
import { Product } from '../../types';
import { apiClient } from '../../api/apiClient';
import { useAppStore } from '../../store/useAppStore';
import { useCartStore } from '../../store/useCartStore';
import { lightPalette, darkPalette, spacing, typography } from '../../theme';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';

export const ProductDetailScreen = ({ route, navigation }: any) => {
  const { productId } = route.params || {};
  const { themeMode, addToast } = useAppStore();
  const { addToCart, toggleWishlist, isInWishlist } = useCartStore();
  const theme = themeMode === 'dark' ? darkPalette : lightPalette;

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProduct();
  }, [productId]);

  const loadProduct = async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.fetchProductById(productId);
      if (res) setProduct(res);
    } catch (e: any) {
      addToast({ type: 'error', message: 'Failed to load product', description: e.message });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !product) {
    return (
      <View style={[styles.loadingCenter, { backgroundColor: theme.background }]}>
        <ActivityIndicator color={theme.primary} size="large" />
      </View>
    );
  }

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
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.cardBg, borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft color={theme.textPrimary} size={24} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Product Details</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.imageBox}>
          <Image source={{ uri: product.imageUrl }} style={styles.image} />
          <TouchableOpacity
            onPress={() => toggleWishlist(product)}
            style={[styles.wishlistBtn, { backgroundColor: theme.cardBg }]}
          >
            <Heart
              color={isWishlisted ? theme.terracotta : theme.textMuted}
              fill={isWishlisted ? theme.terracotta : 'transparent'}
              size={22}
            />
          </TouchableOpacity>
        </View>

        <View style={[styles.infoCard, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
          <Badge label={`Dosha: ${product.doshaTarget}`} variant={product.doshaTarget.toLowerCase() as any} />
          <Text style={[styles.name, { color: theme.textPrimary }]}>{product.name}</Text>
          <Text style={[styles.brand, { color: theme.textMuted }]}>By {product.brand}</Text>

          <View style={styles.ratingRow}>
            <Star color={theme.accent} size={18} fill={theme.accent} />
            <Text style={[styles.ratingText, { color: theme.textPrimary }]}>{product.rating}</Text>
            <Text style={[styles.reviewsCount, { color: theme.textMuted }]}>
              ({product.reviewsCount} customer reviews)
            </Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={[styles.price, { color: theme.primary }]}>₹{product.price}</Text>
            {product.originalPrice && (
              <Text style={[styles.originalPrice, { color: theme.textMuted }]}>
                ₹{product.originalPrice}
              </Text>
            )}
          </View>

          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Description</Text>
          <Text style={[styles.desc, { color: theme.textSecondary }]}>{product.description}</Text>

          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Key Benefits</Text>
          {product.benefits.map((benefit, i) => (
            <View key={i} style={styles.benefitRow}>
              <CheckCircle2 color={theme.primary} size={16} style={{ marginTop: 2 }} />
              <Text style={[styles.benefitText, { color: theme.textSecondary }]}>{benefit}</Text>
            </View>
          ))}

          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Herbal Ingredients</Text>
          <View style={styles.ingredientsPills}>
            {product.ingredients.map((ing, i) => (
              <View key={i} style={[styles.ingPill, { backgroundColor: theme.sand }]}>
                <Text style={[styles.ingText, { color: theme.textPrimary }]}>{ing}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Bar */}
      <View style={[styles.bottomBar, { backgroundColor: theme.cardBg, borderTopColor: theme.border }]}>
        <View>
          <Text style={[styles.feeLabel, { color: theme.textMuted }]}>Price</Text>
          <Text style={[styles.feeAmount, { color: theme.primary }]}>₹{product.price}</Text>
        </View>
        <Button title="Add to Cart" onPress={handleAddToCart} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingCenter: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  backBtn: { padding: spacing.xs, marginRight: spacing.sm },
  headerTitle: { ...typography.h3 },
  content: { paddingBottom: 100 },
  imageBox: { height: 260, width: '100%', backgroundColor: '#F3F4F6', position: 'relative' },
  image: { width: '100%', height: '100%', resizeMode: 'cover' },
  wishlistBtn: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  infoCard: {
    padding: spacing.lg,
    borderTopLeftRadius: spacing.borderRadiusLg,
    borderTopRightRadius: spacing.borderRadiusLg,
    marginTop: -spacing.lg,
  },
  name: { ...typography.h2, marginTop: spacing.xs },
  brand: { ...typography.caption, marginTop: 2 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.sm },
  ratingText: { ...typography.bodyBold, marginLeft: 4 },
  reviewsCount: { ...typography.caption, marginLeft: 4 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', marginVertical: spacing.md },
  price: { ...typography.h1, fontSize: 26 },
  originalPrice: { ...typography.body, textDecorationLine: 'line-through', marginLeft: spacing.sm },
  sectionTitle: { ...typography.h3, marginTop: spacing.lg, marginBottom: spacing.xs },
  desc: { ...typography.body, lineHeight: 22 },
  benefitRow: { flexDirection: 'row', marginTop: spacing.xs },
  benefitText: { ...typography.body, marginLeft: spacing.xs, flex: 1 },
  ingredientsPills: { flexDirection: 'row', flexWrap: 'wrap', marginTop: spacing.xs },
  ingPill: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: spacing.borderRadiusFull,
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },
  ingText: { ...typography.captionBold },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
  },
  feeLabel: { ...typography.caption },
  feeAmount: { ...typography.h2 },
});
