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
import { Star, Award, MapPin, Calendar, Clock, ChevronLeft } from 'lucide-react-native';
import { Doctor, ConsultationSlot } from '../../types';
import { apiClient } from '../../api/apiClient';
import { useAppStore } from '../../store/useAppStore';
import { lightPalette, darkPalette, spacing, typography } from '../../theme';
import { Badge } from '../../components/common/Badge';
import { SlotPicker } from '../../components/consultation/SlotPicker';
import { Button } from '../../components/common/Button';

export const DoctorDetailScreen = ({ route, navigation }: any) => {
  const { doctorId } = route.params || {};
  const { themeMode, addToast } = useAppStore();
  const theme = themeMode === 'dark' ? darkPalette : lightPalette;

  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [slots, setSlots] = useState<ConsultationSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<ConsultationSlot | null>(null);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDoctorDetails();
  }, [doctorId, selectedDate]);

  const loadDoctorDetails = async () => {
    setIsLoading(true);
    try {
      const doc = await apiClient.fetchDoctorById(doctorId);
      if (doc) {
        setDoctor(doc);
        const slotList = await apiClient.fetchDoctorSlots(doctorId, selectedDate);
        setSlots(slotList);
      }
    } catch (err: any) {
      addToast({
        type: 'error',
        message: 'Failed to load doctor details',
        description: err.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !doctor) {
    return (
      <View style={[styles.loadingCenter, { backgroundColor: theme.background }]}>
        <ActivityIndicator color={theme.primary} size="large" />
      </View>
    );
  }

  const handleProceedToBooking = () => {
    if (!selectedSlot) {
      addToast({
        type: 'warning',
        message: 'Select a Slot',
        description: 'Please select an available consultation slot to proceed.',
      });
      return;
    }
    navigation.navigate('Booking', { doctor, slot: selectedSlot });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Top Header Navigation */}
      <View style={[styles.header, { backgroundColor: theme.cardBg, borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft color={theme.textPrimary} size={24} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Doctor Details</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Main Info Card */}
        <View style={[styles.profileCard, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
          <Image source={{ uri: doctor.avatarUrl }} style={styles.avatar} />
          <Text style={[styles.name, { color: theme.textPrimary }]}>{doctor.name}</Text>
          <Text style={[styles.titleText, { color: theme.textSecondary }]}>
            {doctor.title} • {doctor.specialization}
          </Text>

          <View style={styles.badgeRow}>
            <Badge label={`Dosha: ${doctor.doshaSpecialty}`} variant={doctor.doshaSpecialty.toLowerCase() as any} />
          </View>

          <View style={[styles.statsRow, { backgroundColor: theme.sand }]}>
            <View style={styles.statBox}>
              <Award color={theme.primary} size={20} />
              <Text style={[styles.statValue, { color: theme.textPrimary }]}>
                {doctor.experienceYears}+ Yrs
              </Text>
              <Text style={[styles.statLabel, { color: theme.textMuted }]}>Experience</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statBox}>
              <Star color={theme.accent} size={20} fill={theme.accent} />
              <Text style={[styles.statValue, { color: theme.textPrimary }]}>{doctor.rating}</Text>
              <Text style={[styles.statLabel, { color: theme.textMuted }]}>
                {doctor.reviewsCount} Reviews
              </Text>
            </View>
          </View>

          <Text style={[styles.sectionHeading, { color: theme.textPrimary }]}>About Vaidya</Text>
          <Text style={[styles.bio, { color: theme.textSecondary }]}>{doctor.bio}</Text>

          <View style={styles.addressRow}>
            <MapPin color={theme.primary} size={16} style={{ marginTop: 2 }} />
            <Text style={[styles.addressText, { color: theme.textSecondary }]}>
              {doctor.clinicAddress}
            </Text>
          </View>
        </View>

        {/* Slot Selector Card */}
        <View style={[styles.slotContainer, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
          <SlotPicker
            selectedSlotId={selectedSlot?.id || null}
            slots={slots}
            onSelectSlot={setSelectedSlot}
          />
        </View>
      </ScrollView>

      {/* Fixed Bottom Booking Bar */}
      <View style={[styles.bottomBar, { backgroundColor: theme.cardBg, borderTopColor: theme.border }]}>
        <View>
          <Text style={[styles.feeLabel, { color: theme.textMuted }]}>Consultation Fee</Text>
          <Text style={[styles.feeAmount, { color: theme.primary }]}>₹{doctor.fee}</Text>
        </View>
        <Button
          disabled={!selectedSlot}
          title="Proceed to Book"
          onPress={handleProceedToBooking}
        />
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
  content: { padding: spacing.lg, paddingBottom: 100 },
  profileCard: {
    padding: spacing.lg,
    borderRadius: spacing.borderRadiusMd,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  avatar: { width: 90, height: 90, borderRadius: 45, marginBottom: spacing.sm },
  name: { ...typography.h2, textAlign: 'center' },
  titleText: { ...typography.body, textAlign: 'center', marginTop: 2 },
  badgeRow: { marginTop: spacing.sm },
  statsRow: {
    flexDirection: 'row',
    borderRadius: spacing.borderRadiusMd,
    paddingVertical: spacing.md,
    width: '100%',
    marginVertical: spacing.lg,
  },
  statBox: { flex: 1, alignItems: 'center' },
  statValue: { ...typography.bodyBold, marginTop: 4 },
  statLabel: { ...typography.caption },
  divider: { width: 1, backgroundColor: '#D1D5DB' },
  sectionHeading: { ...typography.h3, alignSelf: 'flex-start', marginBottom: spacing.xs },
  bio: { ...typography.body, lineHeight: 22 },
  addressRow: { flexDirection: 'row', alignSelf: 'flex-start', marginTop: spacing.md },
  addressText: { ...typography.caption, marginLeft: 6, flex: 1 },
  slotContainer: {
    padding: spacing.lg,
    borderRadius: spacing.borderRadiusMd,
    borderWidth: 1,
  },
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
