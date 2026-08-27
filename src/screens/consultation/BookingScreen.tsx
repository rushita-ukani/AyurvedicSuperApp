import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { ChevronLeft, Calendar, Clock, User, Phone, FileText, CheckCircle2 } from 'lucide-react-native';
import { Doctor, ConsultationSlot } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import { useBookingStore } from '../../store/useBookingStore';
import { lightPalette, darkPalette, spacing, typography } from '../../theme';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';

export const BookingScreen = ({ route, navigation }: any) => {
  const { doctor, slot }: { doctor: Doctor; slot: ConsultationSlot } = route.params || {};
  const { themeMode } = useAppStore();
  const { createBooking } = useBookingStore();
  const theme = themeMode === 'dark' ? darkPalette : lightPalette;

  const [patientName, setPatientName] = useState('Rahul Verma');
  const [patientPhone, setPatientPhone] = useState('+91 9876543210');
  const [reason, setReason] = useState('Consultation for Vata imbalance & digestive health');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirmBooking = () => {
    if (!patientName.trim() || !patientPhone.trim()) {
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const res = createBooking(
        { id: doctor.id, name: doctor.name, specialization: doctor.specialization, fee: doctor.fee },
        slot,
        { name: patientName, phone: patientPhone, reason }
      );

      setIsSubmitting(false);

      if (res.success) {
        navigation.navigate('UpcomingConsultations');
      }
    }, 400);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.cardBg, borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft color={theme.textPrimary} size={24} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Confirm Booking</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Doctor Summary Card */}
        <Card style={styles.summaryCard}>
          <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>Appointment Summary</Text>
          <Text style={[styles.docName, { color: theme.primary }]}>{doctor.name}</Text>
          <Text style={[styles.spec, { color: theme.textSecondary }]}>{doctor.specialization}</Text>

          <View style={[styles.slotBadge, { backgroundColor: theme.sand }]}>
            <View style={styles.slotRow}>
              <Calendar color={theme.primary} size={16} />
              <Text style={[styles.slotText, { color: theme.textPrimary }]}>{slot.date}</Text>
            </View>
            <View style={styles.slotRow}>
              <Clock color={theme.primary} size={16} />
              <Text style={[styles.slotText, { color: theme.textPrimary }]}>
                {slot.startTime} - {slot.endTime}
              </Text>
            </View>
          </View>
        </Card>

        {/* Patient Details Form */}
        <Card style={styles.formCard}>
          <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>Patient Information</Text>

          <Text style={[styles.label, { color: theme.textSecondary }]}>Full Name</Text>
          <View style={[styles.inputRow, { borderColor: theme.border, backgroundColor: theme.cardBg }]}>
            <User color={theme.textMuted} size={18} />
            <TextInput
              placeholder="Enter patient name"
              placeholderTextColor={theme.textMuted}
              style={[styles.input, { color: theme.textPrimary }]}
              value={patientName}
              onChangeText={setPatientName}
            />
          </View>

          <Text style={[styles.label, { color: theme.textSecondary }]}>Phone Number</Text>
          <View style={[styles.inputRow, { borderColor: theme.border, backgroundColor: theme.cardBg }]}>
            <Phone color={theme.textMuted} size={18} />
            <TextInput
              keyboardType="phone-pad"
              placeholder="Enter mobile number"
              placeholderTextColor={theme.textMuted}
              style={[styles.input, { color: theme.textPrimary }]}
              value={patientPhone}
              onChangeText={setPatientPhone}
            />
          </View>

          <Text style={[styles.label, { color: theme.textSecondary }]}>Reason for Visit (Optional)</Text>
          <View style={[styles.inputRow, { borderColor: theme.border, backgroundColor: theme.cardBg, height: 80, alignItems: 'flex-start', paddingTop: spacing.sm }]}>
            <FileText color={theme.textMuted} size={18} />
            <TextInput
              multiline
              placeholder="Describe symptoms or health concerns..."
              placeholderTextColor={theme.textMuted}
              style={[styles.input, { color: theme.textPrimary, height: 70 }]}
              value={reason}
              onChangeText={setReason}
            />
          </View>
        </Card>
      </ScrollView>

      {/* Footer Payment Bar */}
      <View style={[styles.bottomBar, { backgroundColor: theme.cardBg, borderTopColor: theme.border }]}>
        <View>
          <Text style={[styles.feeLabel, { color: theme.textMuted }]}>Total Payable</Text>
          <Text style={[styles.feeAmount, { color: theme.primary }]}>₹{doctor.fee}</Text>
        </View>
        <Button
          loading={isSubmitting}
          title="Confirm & Book"
          onPress={handleConfirmBooking}
        />
      </View>
    </KeyboardAvoidingView>
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
  summaryCard: { marginBottom: spacing.lg },
  cardTitle: { ...typography.h3, marginBottom: spacing.md },
  docName: { ...typography.h2, fontSize: 18 },
  spec: { ...typography.caption, marginTop: 2 },
  slotBadge: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: spacing.md,
    borderRadius: spacing.borderRadiusSm,
    marginTop: spacing.md,
  },
  slotRow: { flexDirection: 'row', alignItems: 'center' },
  slotText: { ...typography.bodyBold, marginLeft: spacing.xs },
  formCard: { marginBottom: spacing.lg },
  label: { ...typography.captionBold, marginTop: spacing.md, marginBottom: spacing.xs },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: spacing.borderRadiusMd,
    paddingHorizontal: spacing.md,
    height: 48,
  },
  input: { flex: 1, ...typography.body, marginLeft: spacing.sm },
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
