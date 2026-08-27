import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { Settings as SettingsIcon, Moon, Languages, Sliders, Shield, Trash2 } from 'lucide-react-native';
import { useAppStore } from '../../store/useAppStore';
import { lightPalette, darkPalette, spacing, typography } from '../../theme';
import { Card } from '../../components/common/Card';
import { DevSettingsModal } from '../../components/common/DevSettingsModal';
import { cacheManager } from '../../api/cacheManager';
import { t } from '../../utils/i18n';

export const SettingsScreen = () => {
  const { themeMode, setThemeMode, language, setLanguage, addToast } = useAppStore();
  const theme = themeMode === 'dark' ? darkPalette : lightPalette;
  const [isDevMenuVisible, setIsDevMenuVisible] = useState(false);

  const handleClearCache = async () => {
    await cacheManager.clear();
    addToast({
      type: 'success',
      message: 'Cache Cleared',
      description: 'Local API response cache has been purged.',
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.headerBanner, { backgroundColor: theme.cardBg, borderBottomColor: theme.border }]}>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>{t('settings', language)}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.card}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Preferences</Text>

          {/* Dark Mode */}
          <View style={[styles.row, { borderBottomColor: theme.border }]}>
            <View style={styles.rowLabel}>
              <Moon color={theme.textPrimary} size={20} style={{ marginRight: spacing.sm }} />
              <Text style={[styles.label, { color: theme.textPrimary }]}>{t('darkMode', language)}</Text>
            </View>
            <Switch
              value={themeMode === 'dark'}
              onValueChange={val => setThemeMode(val ? 'dark' : 'light')}
            />
          </View>

          {/* Language Switcher */}
          <View style={[styles.row, { borderBottomColor: theme.border }]}>
            <View style={styles.rowLabel}>
              <Languages color={theme.textPrimary} size={20} style={{ marginRight: spacing.sm }} />
              <Text style={[styles.label, { color: theme.textPrimary }]}>{t('language', language)}</Text>
            </View>
            <View style={styles.langPicker}>
              <TouchableOpacity
                onPress={() => setLanguage('en')}
                style={[styles.langBtn, language === 'en' && { backgroundColor: theme.primary }]}
              >
                <Text style={[styles.langText, language === 'en' && { color: '#FFF' }]}>English</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setLanguage('hi')}
                style={[styles.langBtn, language === 'hi' && { backgroundColor: theme.primary }]}
              >
                <Text style={[styles.langText, language === 'hi' && { color: '#FFF' }]}>हिंदी</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Card>

        {/* Engineering & Dev Tools Card */}
        <Card style={styles.card}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
            Senior Engineering & Dev Tools
          </Text>

          <TouchableOpacity
            onPress={() => setIsDevMenuVisible(true)}
            style={[styles.row, { borderBottomColor: theme.border }]}
          >
            <View style={styles.rowLabel}>
              <Sliders color={theme.primary} size={20} style={{ marginRight: spacing.sm }} />
              <View>
                <Text style={[styles.label, { color: theme.textPrimary }]}>{t('devSettings', language)}</Text>
                <Text style={[styles.desc, { color: theme.textMuted }]}>
                  Network Latency, Failures, Offline Mode & Queue
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleClearCache} style={styles.row}>
            <View style={styles.rowLabel}>
              <Trash2 color={theme.danger} size={20} style={{ marginRight: spacing.sm }} />
              <View>
                <Text style={[styles.label, { color: theme.danger }]}>Clear Local API Cache</Text>
                <Text style={[styles.desc, { color: theme.textMuted }]}>Purge stored responses</Text>
              </View>
            </View>
          </TouchableOpacity>
        </Card>

        {/* App Info Card */}
        <Card style={styles.card}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Application Info</Text>
          <Text style={[styles.infoText, { color: theme.textSecondary }]}>Amrutam Ayurvedic Super App</Text>
          <Text style={[styles.infoText, { color: theme.textMuted }]}>Version 1.0.0 (Senior Assignment Build)</Text>
          <Text style={[styles.infoText, { color: theme.textMuted }]}>React Native 0.87.0 • TypeScript • Zustand</Text>
        </Card>
      </ScrollView>

      <DevSettingsModal visible={isDevMenuVisible} onClose={() => setIsDevMenuVisible(false)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerBanner: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  headerTitle: { ...typography.h2, fontSize: 20 },
  content: { padding: spacing.lg },
  card: { marginBottom: spacing.lg },
  sectionTitle: { ...typography.h3, marginBottom: spacing.md },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  rowLabel: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  label: { ...typography.bodyBold },
  desc: { ...typography.caption, marginTop: 2 },
  langPicker: {
    flexDirection: 'row',
    borderRadius: spacing.borderRadiusSm,
    backgroundColor: '#E5E7EB',
    padding: 2,
  },
  langBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: spacing.borderRadiusSm,
  },
  langText: { ...typography.captionBold, color: '#374151' },
  infoText: { ...typography.caption, marginBottom: 2 },
});
