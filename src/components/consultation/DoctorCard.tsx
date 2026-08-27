import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Star, Award, Calendar, ChevronRight } from 'lucide-react-native';
import { Doctor } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import { lightPalette, darkPalette, spacing, typography } from '../../theme';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';

interface DoctorCardProps {
  doctor: Doctor;
  onPress: () => void;
  onBookPress?: () => void;
}

export const DoctorCard = React.memo<DoctorCardProps>(({ doctor, onPress, onBookPress }) => {
  const { themeMode } = useAppStore();
  const theme = themeMode === 'dark' ? darkPalette : lightPalette;

  const doshaVariant = doctor.doshaSpecialty.toLowerCase() as any;

  return (
    <Card elevated style={styles.card}>
      <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
        <View style={styles.headerRow}>
          <Image source={{ uri: doctor.avatarUrl }} style={styles.avatar} />
          <View style={styles.headerInfo}>
            <View style={styles.nameRow}>
              <Text numberOfLines={1} style={[styles.name, { color: theme.textPrimary }]}>
                {doctor.name}
              </Text>
              <Badge label={doctor.doshaSpecialty} variant={doshaVariant} />
            </View>
            <Text numberOfLines={1} style={[styles.spec, { color: theme.textSecondary }]}>
              {doctor.specialization}
            </Text>
            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <Award color={theme.primary} size={14} />
                <Text style={[styles.metaText, { color: theme.textSecondary }]}>
                  {doctor.experienceYears} yrs exp
                </Text>
              </View>
              <View style={styles.metaItem}>
                <Star color={theme.accent} size={14} fill={theme.accent} />
                <Text style={[styles.metaText, { color: theme.textPrimary, fontWeight: '700' }]}>
                  {doctor.rating}
                </Text>
                <Text style={[styles.metaText, { color: theme.textMuted }]}>
                  ({doctor.reviewsCount})
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={[styles.footerRow, { borderTopColor: theme.border }]}>
          <View>
            <Text style={[styles.feeLabel, { color: theme.textMuted }]}>Consultation Fee</Text>
            <Text style={[styles.fee, { color: theme.primary }]}>₹{doctor.fee}</Text>
          </View>

          <TouchableOpacity
            accessibilityRole="button"
            activeOpacity={0.8}
            onPress={onBookPress || onPress}
            style={[styles.bookBtn, { backgroundColor: theme.primary }]}
          >
            <Text style={styles.bookBtnText}>Book Slot</Text>
            <ChevronRight color="#FFFFFF" size={16} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Card>
  );
});

const styles = StyleSheet.create({
  card: {
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E5E7EB',
  },
  headerInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: {
    ...typography.h3,
    fontSize: 16,
    flex: 1,
    marginRight: spacing.xs,
  },
  spec: {
    ...typography.caption,
    marginTop: 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  metaText: {
    ...typography.caption,
    marginLeft: 4,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
  },
  feeLabel: {
    ...typography.caption,
    fontSize: 11,
  },
  fee: {
    ...typography.h3,
    fontSize: 18,
  },
  bookBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md,
    borderRadius: spacing.borderRadiusSm,
  },
  bookBtnText: {
    ...typography.captionBold,
    color: '#FFFFFF',
    marginRight: 2,
  },
});
