import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, TouchableOpacity } from 'react-native';
import { ShieldCheck, Fingerprint, Lock, KeyRound } from 'lucide-react-native';
import { useHealthRecordsStore } from '../../store/useHealthRecordsStore';
import { useAppStore } from '../../store/useAppStore';
import { lightPalette, darkPalette, spacing, typography } from '../../theme';
import { Button } from './Button';
import { t } from '../../utils/i18n';

export const BiometricLockModal: React.FC = () => {
  const { isLocked, unlockWithPin } = useHealthRecordsStore();
  const { themeMode, language, addToast } = useAppStore();
  const [pinInput, setPinInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const theme = themeMode === 'dark' ? darkPalette : lightPalette;

  if (!isLocked) return null;

  const handleUnlock = () => {
    if (unlockWithPin(pinInput)) {
      setPinInput('');
      setErrorMsg('');
      addToast({
        type: 'success',
        message: 'Authenticated Successfully',
        description: 'Health Records unlocked.',
      });
    } else {
      setErrorMsg('Incorrect PIN. Default PIN is 1234');
    }
  };

  const handleBiometricSimulate = () => {
    unlockWithPin('1234');
    addToast({
      type: 'success',
      message: 'Biometric Authenticated',
      description: 'Face ID / Touch ID verified successfully.',
    });
  };

  return (
    <Modal animationType="fade" transparent visible={isLocked}>
      <View style={styles.backdrop}>
        <View style={[styles.card, { backgroundColor: theme.cardBg }]}>
          <View style={[styles.iconCircle, { backgroundColor: `${theme.primary}1E` }]}>
            <ShieldCheck color={theme.primary} size={40} />
          </View>

          <Text style={[styles.title, { color: theme.textPrimary }]}>
            {t('biometricLocked', language)}
          </Text>

          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            {t('unlockTimeline', language)}
          </Text>

          {/* PIN Input */}
          <View style={styles.pinContainer}>
            <KeyRound color={theme.textMuted} size={20} style={{ marginRight: spacing.sm }} />
            <TextInput
              autoFocus
              keyboardType="numeric"
              maxLength={4}
              placeholder="Enter 1234"
              placeholderTextColor={theme.textMuted}
              secureTextEntry
              style={[styles.pinInput, { color: theme.textPrimary, borderColor: theme.border }]}
              value={pinInput}
              onChangeText={val => {
                setPinInput(val);
                if (errorMsg) setErrorMsg('');
              }}
            />
          </View>

          {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

          <Button
            style={{ marginTop: spacing.md, width: '100%' }}
            title="Unlock with PIN"
            onPress={handleUnlock}
          />

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleBiometricSimulate}
            style={styles.biometricBtn}
          >
            <Fingerprint color={theme.primary} size={28} />
            <Text style={[styles.biometricText, { color: theme.primary }]}>
              Use Face ID / Touch ID
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    borderRadius: spacing.borderRadiusLg,
    padding: spacing.xl,
    alignItems: 'center',
    elevation: 10,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h2,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    textAlign: 'center',
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  pinContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  pinInput: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderRadius: spacing.borderRadiusMd,
    paddingHorizontal: spacing.md,
    ...typography.h2,
    letterSpacing: 8,
    textAlign: 'center',
  },
  errorText: {
    ...typography.caption,
    color: '#D32F2F',
    marginTop: spacing.xs,
  },
  biometricBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.lg,
    padding: spacing.sm,
  },
  biometricText: {
    ...typography.bodyBold,
    marginLeft: spacing.sm,
  },
});
