import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { ChevronLeft, ShoppingBag, Trash2 } from 'lucide-react-native';
import { useCartStore } from '../../store/useCartStore';
import { useAppStore } from '../../store/useAppStore';
import { lightPalette, darkPalette, spacing, typography } from '../../theme';
import { CartItemRow } from '../../components/shop/CartItemRow';
import { Button } from '../../components/common/Button';
import { t } from '../../utils/i18n';

export const CartScreen = ({ navigation }: any) => {
  const { cart, getCartTotal, clearCart } = useCartStore();
  const { themeMode, language } = useAppStore();
  const theme = themeMode === 'dark' ? darkPalette : lightPalette;

  const { subtotal, deliveryFee, total, itemCount } = getCartTotal();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.cardBg, borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft color={theme.textPrimary} size={24} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>
          {t('cart', language)} ({itemCount})
        </Text>
        {cart.length > 0 && (
          <TouchableOpacity onPress={clearCart} style={styles.clearBtn}>
            <Trash2 color={theme.danger} size={18} />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        contentContainerStyle={styles.list}
        data={cart}
        keyExtractor={item => item.product.id}
        renderItem={({ item }) => <CartItemRow item={item} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <ShoppingBag color={theme.textMuted} size={54} />
            <Text style={[styles.emptyText, { color: theme.textMuted }]}>
              {t('emptyCart', language)}
            </Text>
            <Button
              style={{ marginTop: spacing.lg }}
              title="Browse Ayurvedic Shop"
              onPress={() => navigation.navigate('ProductList')}
            />
          </View>
        }
        ListFooterComponent={
          cart.length > 0 ? (
            <View style={[styles.summaryCard, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
              <Text style={[styles.summaryTitle, { color: theme.textPrimary }]}>
                {t('checkout', language)}
              </Text>

              <View style={styles.row}>
                <Text style={[styles.label, { color: theme.textSecondary }]}>{t('subtotal', language)}</Text>
                <Text style={[styles.value, { color: theme.textPrimary }]}>₹{subtotal}</Text>
              </View>

              <View style={styles.row}>
                <Text style={[styles.label, { color: theme.textSecondary }]}>{t('deliveryFee', language)}</Text>
                <Text style={[styles.value, { color: deliveryFee === 0 ? theme.success : theme.textPrimary }]}>
                  {deliveryFee === 0 ? t('freeDelivery', language) : `₹${deliveryFee}`}
                </Text>
              </View>

              <View style={[styles.totalRow, { borderTopColor: theme.border }]}>
                <Text style={[styles.totalLabel, { color: theme.textPrimary }]}>{t('total', language)}</Text>
                <Text style={[styles.totalValue, { color: theme.primary }]}>₹{total}</Text>
              </View>
            </View>
          ) : null
        }
      />

      {cart.length > 0 && (
        <View style={[styles.bottomBar, { backgroundColor: theme.cardBg, borderTopColor: theme.border }]}>
          <View>
            <Text style={[styles.feeLabel, { color: theme.textMuted }]}>Grand Total</Text>
            <Text style={[styles.feeAmount, { color: theme.primary }]}>₹{total}</Text>
          </View>
          <Button
            title="Proceed to Checkout"
            onPress={() => navigation.navigate('Checkout')}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  backBtn: { padding: spacing.xs },
  headerTitle: { ...typography.h3 },
  clearBtn: { padding: spacing.xs },
  list: { padding: spacing.lg, paddingBottom: 100 },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', padding: spacing.xxl, marginTop: 40 },
  emptyText: { ...typography.body, marginTop: spacing.md },
  summaryCard: {
    padding: spacing.lg,
    borderRadius: spacing.borderRadiusMd,
    borderWidth: 1,
    marginTop: spacing.md,
  },
  summaryTitle: { ...typography.h3, marginBottom: spacing.md },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.xs },
  label: { ...typography.body },
  value: { ...typography.bodyBold },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
  },
  totalLabel: { ...typography.h3 },
  totalValue: { ...typography.h2 },
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
