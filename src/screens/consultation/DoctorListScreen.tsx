import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Calendar } from 'lucide-react-native';
import { Doctor } from '../../types';
import { apiClient } from '../../api/apiClient';
import { useAppStore } from '../../store/useAppStore';
import { useBookingStore } from '../../store/useBookingStore';
import { lightPalette, darkPalette, spacing, typography } from '../../theme';
import { SearchBar } from '../../components/common/SearchBar';
import { DoctorCard } from '../../components/consultation/DoctorCard';
import { Badge } from '../../components/common/Badge';
import { t } from '../../utils/i18n';

const SPECIALIZATIONS = [
  'All',
  'Nadi Pariksha Specialist',
  'Kayachikitsa (Internal Medicine)',
  'Panchakarma Specialist',
  'Shalya Tantra (Surgical Ayurvedic Care)',
  'Dravyaguna (Herbal Pharmacology)',
];

const DOSHA_FILTERS = ['All', 'Vata', 'Pitta', 'Kapha', 'Tridoshic'];

export const DoctorListScreen = ({ navigation }: any) => {
  const { themeMode, language, addToast } = useAppStore();
  const { bookings } = useBookingStore();
  const theme = themeMode === 'dark' ? darkPalette : lightPalette;

  const [search, setSearch] = useState('');
  const [selectedSpec, setSelectedSpec] = useState('All');
  const [selectedDosha, setSelectedDosha] = useState('All');

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  const activeUpcomingCount = useMemo(
    () => bookings.filter(b => b.status === 'upcoming' || b.status === 'queued_offline').length,
    [bookings]
  );

  const fetchDoctors = useCallback(
    async (pageNum: number, isReset = false) => {
      if (isLoading) return;
      setIsLoading(true);

      try {
        const res = await apiClient.fetchDoctors({
          page: pageNum,
          limit: 20,
          search,
          specialization: selectedSpec,
          doshaTarget: selectedDosha,
        });

        if (isReset) {
          setDoctors(res.items);
        } else {
          setDoctors(prev => [...prev, ...res.items]);
        }

        setHasMore(res.hasMore);
        setTotalCount(res.total);
        setPage(pageNum);
      } catch (err: any) {
        addToast({
          type: 'error',
          message: 'Failed to load doctors',
          description: err.message || 'Please check your connection and try again.',
        });
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [search, selectedSpec, selectedDosha, isLoading, addToast]
  );

  useEffect(() => {
    fetchDoctors(1, true);
  }, [search, selectedSpec, selectedDosha]);

  const handleLoadMore = () => {
    if (hasMore && !isLoading) {
      fetchDoctors(page + 1, false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchDoctors(1, true);
  };

  const renderDoctorItem = useCallback(
    ({ item }: { item: Doctor }) => (
      <DoctorCard
        doctor={item}
        onBookPress={() => navigation.navigate('DoctorDetail', { doctorId: item.id })}
        onPress={() => navigation.navigate('DoctorDetail', { doctorId: item.id })}
      />
    ),
    [navigation]
  );

  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: 160,
      offset: 160 * index,
      index,
    }),
    []
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Top Banner for Upcoming Consultations */}
      <View style={[styles.headerBanner, { backgroundColor: theme.cardBg, borderBottomColor: theme.border }]}>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>{t('findDoctor', language)}</Text>
        <TouchableOpacity
          accessibilityRole="button"
          onPress={() => navigation.navigate('UpcomingConsultations')}
          style={[styles.upcomingBadgeBtn, { backgroundColor: `${theme.primary}1E` }]}
        >
          <Calendar color={theme.primary} size={16} />
          <Text style={[styles.upcomingBadgeText, { color: theme.primary }]}>
            Upcoming ({activeUpcomingCount})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchSection}>
        <SearchBar
          placeholder={t('searchDoctors', language)}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Filters Horizontal Scroll */}
      <View style={styles.filterSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
          {SPECIALIZATIONS.map(spec => {
            const isSelected = selectedSpec === spec;
            return (
              <TouchableOpacity
                key={spec}
                onPress={() => setSelectedSpec(spec)}
                style={[
                  styles.filterPill,
                  {
                    backgroundColor: isSelected ? theme.primary : theme.cardBg,
                    borderColor: isSelected ? theme.primary : theme.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.filterText,
                    { color: isSelected ? '#FFFFFF' : theme.textSecondary },
                  ]}
                >
                  {spec}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
          <Text style={[styles.filterLabel, { color: theme.textMuted }]}>Dosha:</Text>
          {DOSHA_FILTERS.map(dosha => {
            const isSelected = selectedDosha === dosha;
            return (
              <TouchableOpacity
                key={dosha}
                onPress={() => setSelectedDosha(dosha)}
                style={[
                  styles.filterPillSmall,
                  {
                    backgroundColor: isSelected ? theme.accent : theme.cardBg,
                    borderColor: isSelected ? theme.accent : theme.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.filterTextSmall,
                    { color: isSelected ? '#1E2923' : theme.textSecondary },
                  ]}
                >
                  {dosha}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <Text style={[styles.countLabel, { color: theme.textMuted }]}>
        Showing {doctors.length} of {totalCount} Ayurvedic Doctors
      </Text>

      {/* Virtualized Doctor List */}
      <FlatList
        contentContainerStyle={styles.listContainer}
        data={doctors}
        getItemLayout={getItemLayout}
        initialNumToRender={10}
        keyExtractor={item => item.id}
        maxToRenderPerBatch={10}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        onRefresh={handleRefresh}
        refreshing={isRefreshing}
        removeClippedSubviews
        renderItem={renderDoctorItem}
        windowSize={5}
        ListFooterComponent={
          isLoading && !isRefreshing ? (
            <View style={styles.loadingFooter}>
              <ActivityIndicator color={theme.primary} size="small" />
              <Text style={[styles.loadingText, { color: theme.textMuted }]}>
                Loading doctors dataset...
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  headerTitle: {
    ...typography.h2,
    fontSize: 20,
  },
  upcomingBadgeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: spacing.borderRadiusFull,
  },
  upcomingBadgeText: {
    ...typography.captionBold,
    marginLeft: 6,
  },
  searchSection: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  filterSection: {
    paddingHorizontal: spacing.lg,
    marginVertical: spacing.xs,
  },
  filterRow: {
    flexDirection: 'row',
    marginBottom: spacing.xs,
  },
  filterPill: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: spacing.borderRadiusFull,
    borderWidth: 1,
    marginRight: spacing.xs,
  },
  filterPillSmall: {
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 3,
    borderRadius: spacing.borderRadiusFull,
    borderWidth: 1,
    marginRight: spacing.xs,
  },
  filterText: {
    ...typography.captionBold,
  },
  filterTextSmall: {
    ...typography.badge,
  },
  filterLabel: {
    ...typography.caption,
    alignSelf: 'center',
    marginRight: spacing.xs,
  },
  countLabel: {
    ...typography.caption,
    paddingHorizontal: spacing.lg,
    marginVertical: spacing.xs,
  },
  listContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  loadingFooter: {
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  loadingText: {
    ...typography.caption,
    marginTop: spacing.xs,
  },
});
