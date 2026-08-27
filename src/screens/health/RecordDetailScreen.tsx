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
import { ChevronLeft, Calendar, User, FileText, Paperclip } from 'lucide-react-native';
import { HealthRecord, Attachment } from '../../types';
import { apiClient } from '../../api/apiClient';
import { useAppStore } from '../../store/useAppStore';
import { useHealthRecordsStore } from '../../store/useHealthRecordsStore';
import { lightPalette, darkPalette, spacing, typography } from '../../theme';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';

export const RecordDetailScreen = ({ route, navigation }: any) => {
  const { recordId } = route.params || {};
  const { themeMode, addToast } = useAppStore();
  const { setActiveAttachment } = useHealthRecordsStore();
  const theme = themeMode === 'dark' ? darkPalette : lightPalette;

  const [record, setRecord] = useState<HealthRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadRecord();
  }, [recordId]);

  const loadRecord = async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.fetchHealthRecordById(recordId);
      if (res) setRecord(res);
    } catch (e: any) {
      addToast({ type: 'error', message: 'Failed to load record', description: e.message });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !record) {
    return (
      <View style={[styles.loadingCenter, { backgroundColor: theme.background }]}>
        <ActivityIndicator color={theme.primary} size="large" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.cardBg, borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft color={theme.textPrimary} size={24} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Record Details</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.card}>
          <Badge label={record.recordType} variant="vata" />
          <Text style={[styles.title, { color: theme.textPrimary }]}>{record.title}</Text>
          <Text style={[styles.provider, { color: theme.textSecondary }]}>
            Issued by: {record.doctorOrLab}
          </Text>
          <Text style={[styles.date, { color: theme.textMuted }]}>Logged on: {record.date}</Text>

          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Clinical Notes</Text>
          <Text style={[styles.desc, { color: theme.textSecondary }]}>{record.description}</Text>

          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Tags</Text>
          <View style={styles.tagContainer}>
            {record.tags.map((tag, idx) => (
              <View key={idx} style={[styles.tagPill, { backgroundColor: theme.sand }]}>
                <Text style={[styles.tagText, { color: theme.textPrimary }]}>#{tag}</Text>
              </View>
            ))}
          </View>

          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
            Attached Files ({record.attachments.length})
          </Text>
          <View style={styles.attGrid}>
            {record.attachments.map(att => (
              <TouchableOpacity
                key={att.id}
                onPress={() => setActiveAttachment(att)}
                style={[styles.attCard, { backgroundColor: theme.sand, borderColor: theme.border }]}
              >
                {att.fileType === 'image' ? (
                  <Image source={{ uri: att.thumbnailUrl }} style={styles.attThumb} />
                ) : (
                  <View style={styles.pdfCenter}>
                    <Paperclip color={theme.primary} size={24} />
                  </View>
                )}
                <View style={styles.attInfo}>
                  <Text numberOfLines={1} style={[styles.attName, { color: theme.textPrimary }]}>
                    {att.fileName}
                  </Text>
                  <Text style={[styles.attSize, { color: theme.textMuted }]}>{att.fileSize}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </Card>
      </ScrollView>
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
  content: { padding: spacing.lg },
  card: { padding: spacing.lg },
  title: { ...typography.h2, marginTop: spacing.xs },
  provider: { ...typography.body, marginTop: 2 },
  date: { ...typography.caption, marginTop: 4 },
  sectionTitle: { ...typography.h3, marginTop: spacing.lg, marginBottom: spacing.xs },
  desc: { ...typography.body, lineHeight: 22 },
  tagContainer: { flexDirection: 'row', flexWrap: 'wrap', marginTop: spacing.xs },
  tagPill: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: spacing.borderRadiusFull,
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },
  tagText: { ...typography.captionBold },
  attGrid: { marginTop: spacing.xs },
  attCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    borderRadius: spacing.borderRadiusMd,
    borderWidth: 1,
    marginBottom: spacing.sm,
  },
  attThumb: { width: 44, height: 44, borderRadius: spacing.borderRadiusSm },
  pdfCenter: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  attInfo: { marginLeft: spacing.md, flex: 1 },
  attName: { ...typography.bodyBold },
  attSize: { ...typography.caption, marginTop: 2 },
});
