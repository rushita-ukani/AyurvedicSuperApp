import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Calendar, Clock, User, Phone, XCircle, WifiOff } from 'lucide-react-native';
import { Booking } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import { lightPalette, darkPalette, spacing, typography } from '../../theme';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';

interface UpcomingConsultationCardProps {
  booking: Booking;
  onCancel: (bookingId: string) => void;
}

export const UpcomingConsultationCard: React.FC<UpcomingConsultationCardProps> = ({
  booking,
  onCancel,
}) => {
  const { themeMode } = useAppStore();
  const theme = themeMode === 'dark' ? darkPalette : lightPalette;

  const handleCancelPrompt = () => {
    Alert.alert(
      'Cancel Booking',
      `Are you sure you want to cancel your appointment with ${booking.doctorName}?`,
      [
        { text: 'Keep Booking', style: 'cancel' },
        { text: 'Cancel Appointment', style: 'destructive', onPress: () => onCancel(booking.id) },
      ]
    );
  };

  let badgeVariant: any = 'success';
  let badgeLabel = 'UPCOMING';

  if (booking.status === 'queued_offline') {
    badgeVariant = 'warning';
    badgeLabel = 'QUEUED OFFLINE';
  } else if (booking.status === 'cancelled') {
    badgeVariant = 'danger';
    badgeLabel = 'CANCELLED';
  } else if (booking.status === 'completed') {
    badgeVariant = 'default';
    badgeLabel = 'COMPLETED';
  }

  return (
    <Card elevated style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.docName, { color: theme.textPrimary }]}>{booking.doctorName}</Text>
          <Text style={[styles.spec, { color: theme.textSecondary }]}>
            {booking.doctorSpecialization}
          </Text>
        </View>
        <Badge label={badgeLabel} variant={badgeVariant} />
      </View>

      <View style={[styles.infoContainer, { backgroundColor: theme.sand }]}>
        <View style={styles.infoRow}>
          <Calendar color={theme.primary} size={16} />
          <Text style={[styles.infoText, { color: theme.textPrimary }]}>{booking.date}</Text>
        </View>
        <View style={styles.infoRow}>
          <Clock color={theme.primary} size={16} />
          <Text style={[styles.infoText, { color: theme.textPrimary }]}>{booking.time}</Text>
        </View>
        <View style={styles.infoRow}>
          <User color={theme.textMuted} size={16} />
          <Text style={[styles.infoText, { color: theme.textSecondary }]}>
            Patient: {booking.patientName}
          </Text>
        </View>
        {booking.reason ? (
          <Text style={[styles.reasonText, { color: theme.textSecondary }]}>
            Reason: {booking.reason}
          </Text>
        ) : null}
      </View>

      {booking.status === 'queued_offline' && (
        <View style={styles.offlineNotice}>
          <WifiOff color={theme.warning} size={14} style={{ marginRight: 6 }} />
          <Text style={[styles.offlineText, { color: theme.warning }]}>
            Pending sync once internet is restored.
          </Text>
        </View>
      )}

      {booking.status === 'upcoming' && (
        <TouchableOpacity onPress={handleCancelPrompt} style={styles.cancelBtn}>
          <XCircle color={theme.danger} size={16} style={{ marginRight: 6 }} />
          <Text style={[styles.cancelText, { color: theme.danger }]}>Cancel Appointment</Text>
        </TouchableOpacity>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  docName: {
    ...typography.h3,
    fontSize: 17,
  },
  spec: {
    ...typography.caption,
    marginTop: 2,
  },
  infoContainer: {
    padding: spacing.md,
    borderRadius: spacing.borderRadiusSm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  infoText: {
    ...typography.bodyBold,
    fontSize: 14,
    marginLeft: spacing.xs + 2,
  },
  reasonText: {
    ...typography.caption,
    marginTop: spacing.xs,
    fontStyle: 'italic',
  },
  offlineNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  offlineText: {
    ...typography.captionBold,
  },
  cancelBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
    paddingVertical: spacing.xs,
  },
  cancelText: {
    ...typography.captionBold,
  },
});
