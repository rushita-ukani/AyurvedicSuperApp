import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { FileText, FileSpreadsheet, Stethoscope, Syringe, AlertTriangle, Paperclip } from 'lucide-react-native';
import { HealthRecord, Attachment } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import { useHealthRecordsStore } from '../../store/useHealthRecordsStore';
import { lightPalette, darkPalette, spacing, typography } from '../../theme';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';

interface TimelineCardProps {
  record: HealthRecord;
  onPress: () => void;
  onAttachmentPress: (attachment: Attachment) => void;
}

export const TimelineCard = React.memo<TimelineCardProps>(
  ({ record, onPress, onAttachmentPress }) => {
    const { themeMode } = useAppStore();
    const theme = themeMode === 'dark' ? darkPalette : lightPalette;

    let icon = <FileText color={theme.primary} size={20} />;
    let badgeVariant: any = 'default';

    switch (record.recordType) {
      case 'Lab Report':
        icon = <FileSpreadsheet color={theme.vata} size={20} />;
        badgeVariant = 'vata';
        break;
      case 'Prescription':
        icon = <FileText color={theme.pitta} size={20} />;
        badgeVariant = 'pitta';
        break;
      case 'Consultation':
        icon = <Stethoscope color={theme.kapha} size={20} />;
        badgeVariant = 'kapha';
        break;
      case 'Vaccination':
        icon = <Syringe color={theme.tridoshic} size={20} />;
        badgeVariant = 'tridoshic';
        break;
      case 'Allergy':
        icon = <AlertTriangle color={theme.danger} size={20} />;
        badgeVariant = 'danger';
        break;
    }

    return (
      <Card elevated style={styles.card}>
        <TouchableOpacity activeOpacity={0.85} onPress={onPress}>
          <View style={styles.header}>
            <View style={styles.titleGroup}>
              <View style={[styles.iconBox, { backgroundColor: theme.sand }]}>{icon}</View>
              <View style={styles.titleTextContainer}>
                <Text style={[styles.title, { color: theme.textPrimary }]}>{record.title}</Text>
                <Text style={[styles.provider, { color: theme.textSecondary }]}>
                  {record.doctorOrLab}
                </Text>
              </View>
            </View>

            <Badge label={record.recordType} variant={badgeVariant} />
          </View>

          <Text style={[styles.dateText, { color: theme.textMuted }]}>Date: {record.date}</Text>

          <Text numberOfLines={2} style={[styles.desc, { color: theme.textSecondary }]}>
            {record.description}
          </Text>

          {/* Tags */}
          <View style={styles.tagContainer}>
            {record.tags.map((tag, idx) => (
              <View key={idx} style={[styles.tagPill, { backgroundColor: theme.sandDark }]}>
                <Text style={[styles.tagText, { color: theme.textSecondary }]}>#{tag}</Text>
              </View>
            ))}
          </View>

          {/* Attachments Preview Thumbnails */}
          {record.attachments.length > 0 && (
            <View style={[styles.attachmentsContainer, { borderTopColor: theme.border }]}>
              <Text style={[styles.attHeading, { color: theme.textMuted }]}>
                Attachments ({record.attachments.length})
              </Text>
              <View style={styles.attRow}>
                {record.attachments.map(att => (
                  <TouchableOpacity
                    key={att.id}
                    onPress={() => onAttachmentPress(att)}
                    style={[styles.attThumbnailBox, { borderColor: theme.border }]}
                  >
                    {att.fileType === 'image' ? (
                      <Image source={{ uri: att.thumbnailUrl }} style={styles.attImg} />
                    ) : (
                      <View style={[styles.pdfBox, { backgroundColor: theme.sand }]}>
                        <Paperclip color={theme.primary} size={18} />
                        <Text style={[styles.pdfLabel, { color: theme.primary }]}>PDF</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </TouchableOpacity>
      </Card>
    );
  }
);

const styles = StyleSheet.create({
  card: { padding: spacing.md, marginBottom: spacing.md },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  titleGroup: { flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: spacing.xs },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: spacing.borderRadiusSm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleTextContainer: { marginLeft: spacing.sm, flex: 1 },
  title: { ...typography.bodyBold, fontSize: 15 },
  provider: { ...typography.caption, marginTop: 1 },
  dateText: { ...typography.caption, marginTop: spacing.xs },
  desc: { ...typography.body, fontSize: 13, marginTop: spacing.xs, lineHeight: 18 },
  tagContainer: { flexDirection: 'row', flexWrap: 'wrap', marginTop: spacing.xs },
  tagPill: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: spacing.borderRadiusSm,
    marginRight: 4,
    marginBottom: 4,
  },
  tagText: { ...typography.badge, fontSize: 10 },
  attachmentsContainer: { marginTop: spacing.sm, paddingTop: spacing.xs, borderTopWidth: 1 },
  attHeading: { ...typography.badge, fontSize: 10 },
  attRow: { flexDirection: 'row', marginTop: spacing.xs },
  attThumbnailBox: {
    width: 50,
    height: 50,
    borderRadius: spacing.borderRadiusSm,
    borderWidth: 1,
    overflow: 'hidden',
    marginRight: spacing.xs,
  },
  attImg: { width: '100%', height: '100%', resizeMode: 'cover' },
  pdfBox: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' },
  pdfLabel: { ...typography.badge, fontSize: 9 },
});
