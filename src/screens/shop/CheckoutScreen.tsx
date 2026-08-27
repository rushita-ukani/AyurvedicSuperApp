import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { ChevronLeft, MapPin, CreditCard, ShieldCheck, CheckCircle2 } from 'lucide-react-native';
import { useCartStore } from '../../store/useCartStore';
import { useAppStore } from '../../store/useAppStore';
import { lightPalette, darkPalette, spacing, typography } from '../../theme';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';

export const CheckoutScreen = ({ navigation }: any) => {
  const { getCartTotal, clearCart } = useCartStore();
  const { themeMode, addToast } = useAppStore();
  const theme = themeMode === 'dark' ? darkPalette : lightPalette;

  const { subtotal, deliveryFee, total, itemCount } = getCartTotal();

  const [address, setAddress] = useState('Flat 402, Green Meadows, Sector 45, Gurgaon, HR - 122003');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'cod' | 'card'>('upi');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const handlePlaceOrder = () => {
    setIsPlacingOrder(true);
    setTimeout(() => {
      clearCart();
      setIsPlacingOrder(false);
      addToast({
        type: 'success',
        message: 'Order Placed Successfully!',
        description: 'Your Ayurvedic products will be dispatched shortly.',
      });
      navigation.navigate('ProductList');
    }, 800);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.cardBg, borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft color={theme.textPrimary} size={24} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Checkout</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Shipping Address */}
        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <MapPin color={theme.primary} size={20} />
            <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>Delivery Address</Text>
          </View>
          <TextInput
            multiline
            style={[styles.addressInput, { color: theme.textPrimary, borderColor: theme.border }]}
            value={address}
            onChangeText={setAddress}
          />
        </Card>

        {/* Payment Method */}
        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <CreditCard color={theme.primary} size={20} />
            <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>Payment Method</Text>
          </View>

          <TouchableOpacity
            onPress={() => setPaymentMethod('upi')}
            style={[
              styles.methodRow,
              {
                borderColor: paymentMethod === 'upi' ? theme.primary : theme.border,
                backgroundColor: paymentMethod === 'upi' ? `${theme.primary}12` : theme.cardBg,
              },
            ]}
          >
            <View style={styles.methodInfo}>
              <Text style={[styles.methodName, { color: theme.textPrimary }]}>UPI / GPay / PhonePe</Text>
              <Text style={[styles.methodDesc, { color: theme.textMuted }]}>Instant zero-fee payment</Text>
            </View>
            {paymentMethod === 'upi' && <CheckCircle2 color={theme.primary} size={20} />}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setPaymentMethod('cod')}
            style={[
              styles.methodRow,
              {
                borderColor: paymentMethod === 'cod' ? theme.primary : theme.border,
                backgroundColor: paymentMethod === 'cod' ? `${theme.primary}12` : theme.cardBg,
              },
            ]}
          >
            <View style={styles.methodInfo}>
              <Text style={[styles.methodName, { color: theme.textPrimary }]}>Cash on Delivery (COD)</Text>
              <Text style={[styles.methodDesc, { color: theme.textMuted }]}>Pay on delivery</Text>
            </View>
            {paymentMethod === 'cod' && <CheckCircle2 color={theme.primary} size={20} />}
          </TouchableOpacity>
        </Card>

        {/* Order Summary */}
        <Card style={styles.card}>
          <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>
            Order Summary ({itemCount} Items)
          </Text>

          <View style={styles.row}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>Subtotal</Text>
            <Text style={[styles.value, { color: theme.textPrimary }]}>₹{subtotal}</Text>
          </View>

          <View style={styles.row}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>Delivery Fee</Text>
            <Text style={[styles.value, { color: deliveryFee === 0 ? theme.success : theme.textPrimary }]}>
              {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
            </Text>
          </View>

          <View style={[styles.totalRow, { borderTopColor: theme.border }]}>
            <Text style={[styles.totalLabel, { color: theme.textPrimary }]}>Total Payable</Text>
            <Text style={[styles.totalValue, { color: theme.primary }]}>₹{total}</Text>
          </View>
        </Card>
      </ScrollView>

      {/* Bottom Place Order Bar */}
      <View style={[styles.bottomBar, { backgroundColor: theme.cardBg, borderTopColor: theme.border }]}>
        <View>
          <Text style={[styles.feeLabel, { color: theme.textMuted }]}>Total Amount</Text>
          <Text style={[styles.feeAmount, { color: theme.primary }]}>₹{total}</Text>
        </View>
        <Button
          loading={isPlacingOrder}
          title="Place Order"
          onPress={handlePlaceOrder}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  backBtn: { padding: spacing.xs, marginRight: spacing.sm },
  headerTitle: { ...typography.h3 },
  content: { padding: spacing.lg, paddingBottom: 100 },
  card: { marginBottom: spacing.lg },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  cardTitle: { ...typography.h3, marginLeft: spacing.xs },
  addressInput: {
    borderWidth: 1,
    borderRadius: spacing.borderRadiusSm,
    padding: spacing.md,
    ...typography.body,
    height: 70,
  },
  methodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderWidth: 1,
    borderRadius: spacing.borderRadiusSm,
    marginBottom: spacing.sm,
  },
  methodInfo: { flex: 1 },
  methodName: { ...typography.bodyBold },
  methodDesc: { ...typography.caption, marginTop: 2 },
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
