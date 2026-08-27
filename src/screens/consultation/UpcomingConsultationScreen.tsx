import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { ChevronLeft, Calendar } from 'lucide-react-native';
import { useBookingStore } from '../../store/useBookingStore';
import { useAppStore } from '../../store/useAppStore';
import { lightPalette, darkPalette, spacing, typography } from '../../theme';
import { UpcomingConsultationCard } from '../../components/consultation/UpcomingConsultationCard';
import { t } from '../../utils/i18n';

export const UpcomingConsultationScreen = ({ navigation }: any) => {
  const { bookings, cancelBooking } = useBookingStore();
  const { themeMode, language } = useAppStore();
  const theme = themeMode === 'dark' ? darkPalette : lightPalette;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.cardBg, borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft color={theme.textPrimary} size={24} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>
          {t('upcomingConsultations', language)}
        </Text>
      </View>

      <FlatList
        contentContainerStyle={styles.list}
        data={bookings}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <UpcomingConsultationCard booking={item} onCancel={cancelBooking} />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Calendar color={theme.textMuted} size={48} />
            <Text style={[styles.emptyText, { color: theme.textMuted }]}>
              {t('noUpcomingConsultations', language)}
            </Text>
          </View>
        }
      />
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
  list: { padding: spacing.lg },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', padding: spacing.xxl, marginTop: 40 },
  emptyText: { ...typography.body, marginTop: spacing.md, textAlign: 'center' },
});
