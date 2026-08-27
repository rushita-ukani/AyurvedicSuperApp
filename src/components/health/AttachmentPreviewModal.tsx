import React from 'react';
import { View, Text, StyleSheet, Modal, Image, TouchableOpacity } from 'react-native';
import { X, FileText, Download, Share2 } from 'lucide-react-native';
import { Attachment } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import { lightPalette, darkPalette, spacing, typography } from '../../theme';
import { Button } from '../common/Button';

interface AttachmentPreviewModalProps {
  attachment: Attachment | null;
  onClose: () => void;
}

export const AttachmentPreviewModal: React.FC<AttachmentPreviewModalProps> = ({
  attachment,
  onClose,
}) => {
  const { themeMode, addToast } = useAppStore();
  const theme = themeMode === 'dark' ? darkPalette : lightPalette;

  if (!attachment) return null;

  const handleDownload = () => {
    addToast({
      type: 'success',
      message: 'Attachment Downloaded',
      description: `${attachment.fileName} saved to device documents.`,
    });
  };

  return (
    <Modal animationType="fade" transparent visible={!!attachment} onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={[styles.container, { backgroundColor: theme.cardBg }]}>
          <View style={[styles.header, { borderBottomColor: theme.border }]}>
            <View style={styles.titleRow}>
              <FileText color={theme.primary} size={20} style={{ marginRight: 8 }} />
              <Text numberOfLines={1} style={[styles.title, { color: theme.textPrimary }]}>
                {attachment.fileName}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <X color={theme.textMuted} size={20} />
            </TouchableOpacity>
          </View>

          <View style={styles.previewBox}>
            {attachment.fileType === 'image' ? (
              <Image source={{ uri: attachment.fileUrl }} style={styles.fullImage} />
            ) : (
              <View style={[styles.pdfPlaceholder, { backgroundColor: theme.sand }]}>
                <FileText color={theme.primary} size={64} />
                <Text style={[styles.pdfName, { color: theme.textPrimary }]}>
                  {attachment.fileName}
                </Text>
                <Text style={[styles.pdfSize, { color: theme.textMuted }]}>
                  {attachment.fileSize} • Portable Document Format
                </Text>
              </View>
            )}
          </View>

          <View style={[styles.footer, { borderTopColor: theme.border }]}>
            <Button title="Download Document" onPress={handleDownload} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  container: {
    borderRadius: spacing.borderRadiusLg,
    maxHeight: '80%',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderBottomWidth: 1,
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: spacing.md },
  title: { ...typography.bodyBold, fontSize: 15 },
  previewBox: { height: 350, width: '100%', backgroundColor: '#000' },
  fullImage: { width: '100%', height: '100%', resizeMode: 'contain' },
  pdfPlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  pdfName: { ...typography.h3, marginTop: spacing.md, textAlign: 'center' },
  pdfSize: { ...typography.caption, marginTop: 4 },
  footer: { padding: spacing.md, borderTopWidth: 1 },
});
