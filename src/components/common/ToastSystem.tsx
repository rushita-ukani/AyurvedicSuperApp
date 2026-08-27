import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react-native';
import { useAppStore } from '../../store/useAppStore';
import { lightPalette, darkPalette, spacing, typography } from '../../theme';

export const ToastSystem: React.FC = () => {
  const { toasts, removeToast, themeMode } = useAppStore();
  const theme = themeMode === 'dark' ? darkPalette : lightPalette;

  if (toasts.length === 0) return null;

  return (
    <View pointerEvents="box-none" style={styles.container}>
      {toasts.map(toast => {
        let icon = <CheckCircle2 color={theme.success} size={20} />;
        let borderLeftColor = theme.success;

        if (toast.type === 'error') {
          icon = <AlertCircle color={theme.danger} size={20} />;
          borderLeftColor = theme.danger;
        } else if (toast.type === 'warning') {
          icon = <AlertTriangle color={theme.warning} size={20} />;
          borderLeftColor = theme.warning;
        } else if (toast.type === 'info') {
          icon = <Info color={theme.info} size={20} />;
          borderLeftColor = theme.info;
        }

        return (
          <View
            key={toast.id}
            accessibilityLiveRegion="assertive"
            accessibilityRole="alert"
            style={[
              styles.toast,
              {
                backgroundColor: theme.cardBg,
                borderColor: theme.border,
                borderLeftColor,
              },
            ]}
          >
            <View style={styles.iconContainer}>{icon}</View>
            <View style={styles.textContainer}>
              <Text style={[styles.message, { color: theme.textPrimary }]}>{toast.message}</Text>
              {toast.description && (
                <Text style={[styles.description, { color: theme.textSecondary }]}>
                  {toast.description}
                </Text>
              )}
            </View>
            <TouchableOpacity onPress={() => removeToast(toast.id)} style={styles.closeBtn}>
              <X color={theme.textMuted} size={16} />
            </TouchableOpacity>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: spacing.lg,
    right: spacing.lg,
    zIndex: 9999,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: spacing.borderRadiusMd,
    borderWidth: 1,
    borderLeftWidth: 5,
    marginBottom: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  iconContainer: {
    marginRight: spacing.sm,
  },
  textContainer: {
    flex: 1,
  },
  message: {
    ...typography.bodyBold,
    fontSize: 14,
  },
  description: {
    ...typography.caption,
    marginTop: 2,
  },
  closeBtn: {
    padding: spacing.xs,
  },
});
