import React from 'react';
import { View, Text, StyleSheet, Modal, Switch, TouchableOpacity, ScrollView } from 'react-native';
import { Settings, X, WifiOff, Zap, RefreshCw, Moon, Languages } from 'lucide-react-native';
import { useAppStore } from '../../store/useAppStore';
import { useBookingStore } from '../../store/useBookingStore';
import { lightPalette, darkPalette, spacing, typography } from '../../theme';
import { Button } from './Button';
import { t } from '../../utils/i18n';

interface DevSettingsModalProps {
  visible: boolean;
  onClose: () => void;
}

export const DevSettingsModal: React.FC<DevSettingsModalProps> = ({ visible, onClose }) => {
  const {
    isOffline,
    toggleOfflineMode,
    simulateSlowNetwork,
    toggleSlowNetwork,
    simulateRandomFailures,
    toggleRandomFailures,
    themeMode,
    setThemeMode,
    language,
    setLanguage,
  } = useAppStore();

  const { offlineQueue, syncOfflineQueue } = useBookingStore();

  const theme = themeMode === 'dark' ? darkPalette : lightPalette;

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={[styles.modalContainer, { backgroundColor: theme.cardBg }]}>
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: theme.border }]}>
            <View style={styles.titleRow}>
              <Settings color={theme.primary} size={22} style={{ marginRight: spacing.sm }} />
              <Text style={[styles.title, { color: theme.textPrimary }]}>{t('devSettings', language)}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X color={theme.textMuted} size={20} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            {/* Dark Mode */}
            <View style={[styles.optionRow, { borderBottomColor: theme.border }]}>
              <View style={styles.optionLabelGroup}>
                <Moon color={theme.textPrimary} size={20} style={{ marginRight: spacing.sm }} />
                <View>
                  <Text style={[styles.optionTitle, { color: theme.textPrimary }]}>{t('darkMode', language)}</Text>
                  <Text style={[styles.optionDesc, { color: theme.textSecondary }]}>
                    Toggle dark / light application theme
                  </Text>
                </View>
              </View>
              <Switch
                value={themeMode === 'dark'}
                onValueChange={val => setThemeMode(val ? 'dark' : 'light')}
              />
            </View>

            {/* Language Switcher */}
            <View style={[styles.optionRow, { borderBottomColor: theme.border }]}>
              <View style={styles.optionLabelGroup}>
                <Languages color={theme.textPrimary} size={20} style={{ marginRight: spacing.sm }} />
                <View>
                  <Text style={[styles.optionTitle, { color: theme.textPrimary }]}>{t('language', language)}</Text>
                  <Text style={[styles.optionDesc, { color: theme.textSecondary }]}>
                    Switch application language (EN / HI)
                  </Text>
                </View>
              </View>
              <View style={styles.langPicker}>
                <TouchableOpacity
                  onPress={() => setLanguage('en')}
                  style={[styles.langBtn, language === 'en' && { backgroundColor: theme.primary }]}
                >
                  <Text style={[styles.langText, language === 'en' && { color: '#FFF' }]}>EN</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setLanguage('hi')}
                  style={[styles.langBtn, language === 'hi' && { backgroundColor: theme.primary }]}
                >
                  <Text style={[styles.langText, language === 'hi' && { color: '#FFF' }]}>HI</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Force Offline Mode */}
            <View style={[styles.optionRow, { borderBottomColor: theme.border }]}>
              <View style={styles.optionLabelGroup}>
                <WifiOff color={theme.warning} size={20} style={{ marginRight: spacing.sm }} />
                <View>
                  <Text style={[styles.optionTitle, { color: theme.textPrimary }]}>{t('triggerOfflineMode', language)}</Text>
                  <Text style={[styles.optionDesc, { color: theme.textSecondary }]}>
                    Queue cart and booking actions locally
                  </Text>
                </View>
              </View>
              <Switch value={isOffline} onValueChange={() => toggleOfflineMode()} />
            </View>

            {/* Simulate Slow Network */}
            <View style={[styles.optionRow, { borderBottomColor: theme.border }]}>
              <View style={styles.optionLabelGroup}>
                <Zap color={theme.textPrimary} size={20} style={{ marginRight: spacing.sm }} />
                <View>
                  <Text style={[styles.optionTitle, { color: theme.textPrimary }]}>{t('simulateSlowNetwork', language)}</Text>
                  <Text style={[styles.optionDesc, { color: theme.textSecondary }]}>
                    Inject artificial 1.2s delay to API calls
                  </Text>
                </View>
              </View>
              <Switch value={simulateSlowNetwork} onValueChange={() => toggleSlowNetwork()} />
            </View>

            {/* Simulate Random Failures */}
            <View style={[styles.optionRow, { borderBottomColor: theme.border }]}>
              <View style={styles.optionLabelGroup}>
                <Zap color={theme.danger} size={20} style={{ marginRight: spacing.sm }} />
                <View>
                  <Text style={[styles.optionTitle, { color: theme.textPrimary }]}>{t('simulateRandomFailures', language)}</Text>
                  <Text style={[styles.optionDesc, { color: theme.textSecondary }]}>
                    Trigger 30% API network error retries
                  </Text>
                </View>
              </View>
              <Switch value={simulateRandomFailures} onValueChange={() => toggleRandomFailures()} />
            </View>

            {/* Sync Queue */}
            <View style={styles.queueContainer}>
              <Text style={[styles.queueTitle, { color: theme.textPrimary }]}>
                Pending Offline Queue: {offlineQueue.length} item(s)
              </Text>
              <Button
                disabled={offlineQueue.length === 0}
                style={{ marginTop: spacing.sm }}
                title={t('flushSyncQueue', language)}
                variant="secondary"
                onPress={() => syncOfflineQueue()}
              />
            </View>
          </ScrollView>

          <View style={[styles.footer, { borderTopColor: theme.border }]}>
            <Button title="Done" onPress={onClose} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    borderTopLeftRadius: spacing.borderRadiusLg,
    borderTopRightRadius: spacing.borderRadiusLg,
    maxHeight: '80%',
    paddingBottom: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    borderBottomWidth: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    ...typography.h3,
  },
  closeBtn: {
    padding: spacing.xs,
  },
  content: {
    padding: spacing.lg,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  optionLabelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: spacing.md,
  },
  optionTitle: {
    ...typography.bodyBold,
  },
  optionDesc: {
    ...typography.caption,
    marginTop: 2,
  },
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
  langText: {
    ...typography.captionBold,
    color: '#374151',
  },
  queueContainer: {
    marginVertical: spacing.lg,
    padding: spacing.md,
    borderRadius: spacing.borderRadiusMd,
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
  queueTitle: {
    ...typography.bodyBold,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
  },
});
