import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { ChevronLeft, FileText, Calendar, Building, Tag } from 'lucide-react-native';
import { HealthRecordType } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import { useHealthRecordsStore } from '../../store/useHealthRecordsStore';
import { lightPalette, darkPalette, spacing, typography } from '../../theme';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';

const RECORD_TYPES: HealthRecordType[] = [
  'Lab Report',
  'Prescription',
  'Consultation',
  'Vaccination',
  'Allergy',
];

export const AddRecordScreen = ({ navigation }: any) => {
  const { themeMode, addToast } = useAppStore();
  const { addCustomRecord } = useHealthRecordsStore();
  const theme = themeMode === 'dark' ? darkPalette : lightPalette;

  const [title, setTitle] = useState('');
  const [recordType, setRecordType] = useState<HealthRecordType>('Lab Report');
  const [provider, setProvider] = useState('');
  const [description, setDescription] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  const handleSave = () => {
    if (!title.trim() || !provider.trim()) {
      addToast({ type: 'warning', message: 'Required Fields', description: 'Please fill title and provider name.' });
      return;
    }

    const tags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    addCustomRecord({
      title,
      recordType,
      date: new Date().toISOString().split('T')[0],
      doctorOrLab: provider,
      description: description || 'New patient timeline record.',
      tags: tags.length > 0 ? tags : ['Ayurveda', 'Timeline'],
      attachments: [
        {
          id: `att_custom_${Date.now()}`,
          fileName: `${title.replace(/\s+/g, '_')}.pdf`,
          fileType: 'pdf',
          fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          thumbnailUrl: 'https://picsum.photos/seed/attcustom/150/150',
          fileSize: '1.2 MB',
        },
      ],
    });

    addToast({
      type: 'success',
      message: 'Record Created',
      description: `${title} added to your health timeline.`,
    });

    navigation.goBack();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.cardBg, borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft color={theme.textPrimary} size={24} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Add Health Record</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.card}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>Record Type</Text>
          <View style={styles.typeGrid}>
            {RECORD_TYPES.map(type => {
              const isSelected = recordType === type;
              return (
                <TouchableOpacity
                  key={type}
                  onPress={() => setRecordType(type)}
                  style={[
                    styles.typePill,
                    {
                      backgroundColor: isSelected ? theme.primary : theme.sand,
                      borderColor: isSelected ? theme.primary : theme.border,
                    },
                  ]}
                >
                  <Text style={[styles.typeText, { color: isSelected ? '#FFF' : theme.textSecondary }]}>
                    {type}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={[styles.label, { color: theme.textSecondary }]}>Record Title</Text>
          <View style={[styles.inputRow, { borderColor: theme.border, backgroundColor: theme.cardBg }]}>
            <FileText color={theme.textMuted} size={18} />
            <TextInput
              placeholder="e.g. Lipid Profile Test"
              placeholderTextColor={theme.textMuted}
              style={[styles.input, { color: theme.textPrimary }]}
              value={title}
              onChangeText={setTitle}
            />
          </View>

          <Text style={[styles.label, { color: theme.textSecondary }]}>Doctor or Diagnostic Lab</Text>
          <View style={[styles.inputRow, { borderColor: theme.border, backgroundColor: theme.cardBg }]}>
            <Building color={theme.textMuted} size={18} />
            <TextInput
              placeholder="e.g. Patanjali Research Lab"
              placeholderTextColor={theme.textMuted}
              style={[styles.input, { color: theme.textPrimary }]}
              value={provider}
              onChangeText={setProvider}
            />
          </View>

          <Text style={[styles.label, { color: theme.textSecondary }]}>Tags (comma separated)</Text>
          <View style={[styles.inputRow, { borderColor: theme.border, backgroundColor: theme.cardBg }]}>
            <Tag color={theme.textMuted} size={18} />
            <TextInput
              placeholder="e.g. Blood Test, Cholesterol"
              placeholderTextColor={theme.textMuted}
              style={[styles.input, { color: theme.textPrimary }]}
              value={tagsInput}
              onChangeText={setTagsInput}
            />
          </View>

          <Text style={[styles.label, { color: theme.textSecondary }]}>Description / Notes</Text>
          <View style={[styles.inputRow, { borderColor: theme.border, backgroundColor: theme.cardBg, height: 80, alignItems: 'flex-start', paddingTop: spacing.sm }]}>
            <TextInput
              multiline
              placeholder="Enter medical observations..."
              placeholderTextColor={theme.textMuted}
              style={[styles.input, { color: theme.textPrimary, height: 70 }]}
              value={description}
              onChangeText={setDescription}
            />
          </View>

          <Button style={{ marginTop: spacing.xl }} title="Save Record" onPress={handleSave} />
        </Card>
      </ScrollView>
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
  content: { padding: spacing.lg },
  card: { padding: spacing.lg },
  label: { ...typography.captionBold, marginTop: spacing.md, marginBottom: spacing.xs },
  typeGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  typePill: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: spacing.borderRadiusFull,
    borderWidth: 1,
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },
  typeText: { ...typography.captionBold },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: spacing.borderRadiusMd,
    paddingHorizontal: spacing.md,
    height: 48,
  },
  input: { flex: 1, ...typography.body, marginLeft: spacing.sm },
});
