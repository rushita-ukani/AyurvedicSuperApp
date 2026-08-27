import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Clock, AlertCircle } from 'lucide-react-native';
import { ConsultationSlot } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import { lightPalette, darkPalette, spacing, typography } from '../../theme';

interface SlotPickerProps {
  slots: ConsultationSlot[];
  selectedSlotId: string | null;
  onSelectSlot: (slot: ConsultationSlot) => void;
}

export const SlotPicker: React.FC<SlotPickerProps> = ({
  slots,
  selectedSlotId,
  onSelectSlot,
}) => {
  const { themeMode } = useAppStore();
  const theme = themeMode === 'dark' ? darkPalette : lightPalette;

  if (slots.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, { color: theme.textMuted }]}>
          No slots available for the selected date.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.textPrimary }]}>Available Slots</Text>
      <View style={styles.grid}>
        {slots.map(slot => {
          const isSelected = selectedSlotId === slot.id;
          const isBooked = slot.isBooked;
          const isExpired = slot.isExpired;
          const isDisabled = isBooked || isExpired;

          let badgeText = 'Available';
          let borderCol = theme.border;
          let bgCol = theme.cardBg;

          if (isSelected) {
            borderCol = theme.primary;
            bgCol = `${theme.primary}1A`;
          } else if (isBooked) {
            badgeText = 'Conflict / Booked';
            bgCol = theme.sandDark;
          } else if (isExpired) {
            badgeText = 'Expired Slot';
            bgCol = theme.sandDark;
          }

          return (
            <TouchableOpacity
              key={slot.id}
              accessibilityRole="button"
              accessibilityState={{ disabled: isDisabled, selected: isSelected }}
              activeOpacity={0.7}
              disabled={isDisabled}
              onPress={() => onSelectSlot(slot)}
              style={[
                styles.slotCard,
                {
                  backgroundColor: bgCol,
                  borderColor: borderCol,
                  borderWidth: isSelected ? 2 : 1,
                  opacity: isDisabled ? 0.55 : 1,
                },
              ]}
            >
              <Clock color={isSelected ? theme.primary : theme.textMuted} size={14} />
              <Text
                style={[
                  styles.slotTime,
                  { color: isSelected ? theme.primary : theme.textPrimary },
                ]}
              >
                {slot.startTime}
              </Text>
              {isDisabled && (
                <Text style={[styles.disabledLabel, { color: theme.danger }]}>{badgeText}</Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.md,
  },
  title: {
    ...typography.h3,
    marginBottom: spacing.sm,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  slotCard: {
    width: '48%',
    padding: spacing.md,
    borderRadius: spacing.borderRadiusMd,
    marginBottom: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotTime: {
    ...typography.bodyBold,
    marginTop: spacing.xs,
  },
  disabledLabel: {
    ...typography.badge,
    marginTop: 4,
  },
  emptyContainer: {
    padding: spacing.lg,
    alignItems: 'center',
  },
  emptyText: {
    ...typography.body,
  },
});
