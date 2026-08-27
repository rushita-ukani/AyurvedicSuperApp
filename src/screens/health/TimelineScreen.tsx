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
import { ShieldCheck, Plus, FileText, Lock } from 'lucide-react-native';
import { HealthRecord, HealthRecordType, Attachment } from '../../types';
import { apiClient } from '../../api/apiClient';
import { useAppStore } from '../../store/useAppStore';
import { useHealthRecordsStore } from '../../store/useHealthRecordsStore';
import { lightPalette, darkPalette, spacing, typography } from '../../theme';
import { SearchBar } from '../../components/common/SearchBar';
import { TimelineCard } from '../../components/health/TimelineCard';
import { BiometricLockModal } from '../../components/common/BiometricLockModal';
import { AttachmentPreviewModal } from '../../components/health/AttachmentPreviewModal';
import { t } from '../../utils/i18n';

const RECORD_TYPES: (HealthRecordType | 'All')[] = [
  'All',
  'Lab Report',
  'Prescription',
  'Consultation',
  'Vaccination',
  'Allergy',
];

export const TimelineScreen = ({ navigation }: any) => {
  const { themeMode, language, addToast } = useAppStore();
  const {
    isLocked,
    lockTimeline,
    records,
    selectedRecordType,
    setRecordType,
    activeAttachment,
    setActiveAttachment,
  } = useHealthRecordsStore();

  const theme = themeMode === 'dark' ? darkPalette : lightPalette;

  const [search, setSearch] = useState('');
  const [timelineData, setTimelineData] = useState<HealthRecord[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  const fetchRecords = useCallback(
    async (pageNum: number, isReset = false) => {
      if (isLoading) return;
      setIsLoading(true);

      try {
        const res = await apiClient.fetchHealthRecords({
          page: pageNum,
          limit: 20,
          search,
          recordType: selectedRecordType,
        });

        if (isReset) {
          setTimelineData(res.items);
        } else {
          setTimelineData(prev => [...prev, ...res.items]);
        }

        setHasMore(res.hasMore);
        setTotalCount(res.total);
        setPage(pageNum);
      } catch (err: any) {
        addToast({
          type: 'error',
          message: 'Failed to load timeline',
          description: err.message,
        });
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [search, selectedRecordType, isLoading, addToast]
  );

  useEffect(() => {
    if (!isLocked) {
      fetchRecords(1, true);
    }
  }, [search, selectedRecordType, isLocked]);

  const handleLoadMore = () => {
    if (hasMore && !isLoading && !isLocked) {
      fetchRecords(page + 1, false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchRecords(1, true);
  };

  const renderTimelineItem = useCallback(
    ({ item }: { item: HealthRecord }) => (
      <TimelineCard
        record={item}
        onAttachmentPress={att => setActiveAttachment(att)}
        onPress={() => navigation.navigate('RecordDetail', { recordId: item.id })}
      />
    ),
    [navigation, setActiveAttachment]
  );

  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: 190,
      offset: 190 * index,
      index,
    }),
    []
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Biometric Security Lock Modal */}
      <BiometricLockModal />

      {/* Header */}
      <View style={[styles.headerBanner, { backgroundColor: theme.cardBg, borderBottomColor: theme.border }]}>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>
          {t('patientTimeline', language)}
        </Text>

        <View style={styles.headerRightActions}>
          <TouchableOpacity
            accessibilityLabel="Lock Timeline"
            onPress={lockTimeline}
            style={[styles.lockBtn, { backgroundColor: `${theme.primary}1E` }]}
          >
            <Lock color={theme.primary} size={18} />
          </TouchableOpacity>

          <TouchableOpacity
            accessibilityLabel="Add Health Record"
            onPress={() => navigation.navigate('AddRecord')}
            style={[styles.addBtn, { backgroundColor: theme.primary }]}
          >
            <Plus color="#FFFFFF" size={18} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchSection}>
        <SearchBar
          placeholder={t('searchRecords', language)}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Record Type Filter Pills */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
        {RECORD_TYPES.map(type => {
          const isSelected = selectedRecordType === type;
          return (
            <TouchableOpacity
              key={type}
              onPress={() => setRecordType(type)}
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
                {type}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <Text style={[styles.countLabel, { color: theme.textMuted }]}>
        Showing {timelineData.length} of {totalCount} Patient Timeline Records
      </Text>

      {/* Virtualized Timeline List */}
      <FlatList
        contentContainerStyle={styles.listContainer}
        data={timelineData}
        getItemLayout={getItemLayout}
        initialNumToRender={10}
        keyExtractor={item => item.id}
        maxToRenderPerBatch={10}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        onRefresh={handleRefresh}
        refreshing={isRefreshing}
        removeClippedSubviews
        renderItem={renderTimelineItem}
        windowSize={5}
        ListFooterComponent={
          isLoading && !isRefreshing ? (
            <View style={styles.loadingFooter}>
              <ActivityIndicator color={theme.primary} size="small" />
              <Text style={[styles.loadingText, { color: theme.textMuted }]}>
                Loading timeline dataset...
              </Text>
            </View>
          ) : null
        }
      />

      {/* Attachment Full Preview Modal */}
      <AttachmentPreviewModal
        attachment={activeAttachment}
        onClose={() => setActiveAttachment(null)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  headerTitle: { ...typography.h2, fontSize: 20 },
  headerRightActions: { flexDirection: 'row', alignItems: 'center' },
  lockBtn: {
    padding: spacing.xs + 2,
    borderRadius: spacing.borderRadiusFull,
    marginRight: spacing.xs,
  },
  addBtn: {
    padding: spacing.xs + 2,
    borderRadius: spacing.borderRadiusFull,
  },
  searchSection: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xs,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    marginVertical: spacing.xs,
  },
  filterPill: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: spacing.borderRadiusFull,
    borderWidth: 1,
    marginRight: spacing.xs,
  },
  filterText: { ...typography.captionBold },
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
  loadingText: { ...typography.caption, marginTop: spacing.xs },
});
