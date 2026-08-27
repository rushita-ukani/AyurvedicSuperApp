import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppStore } from '../../store/useAppStore';
import { lightPalette, darkPalette, spacing, typography } from '../../theme';
import { DoshaType } from '../../types';

interface BadgeProps {
  label: string;
  variant?: 'default' | 'vata' | 'pitta' | 'kapha' | 'tridoshic' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({ label, variant = 'default', size = 'sm' }) => {
  const { themeMode } = useAppStore();
  const theme = themeMode === 'dark' ? darkPalette : lightPalette;

  const getBadgeStyle = () => {
    switch (variant) {
      case 'vata':
        return { bg: `${theme.vata}1E`, text: theme.vata };
      case 'pitta':
        return { bg: `${theme.pitta}1E`, text: theme.pitta };
      case 'kapha':
        return { bg: `${theme.kapha}1E`, text: theme.kapha };
      case 'tridoshic':
        return { bg: `${theme.tridoshic}1E`, text: theme.tridoshic };
      case 'success':
        return { bg: `${theme.success}1E`, text: theme.success };
      case 'warning':
        return { bg: `${theme.warning}1E`, text: theme.warning };
      case 'danger':
        return { bg: `${theme.danger}1E`, text: theme.danger };
      default:
        return { bg: theme.sandDark, text: theme.textSecondary };
    }
  };

  const styleConfig = getBadgeStyle();

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: styleConfig.bg,
          paddingVertical: size === 'sm' ? 2 : 4,
          paddingHorizontal: size === 'sm' ? spacing.xs + 2 : spacing.sm + 2,
        },
      ]}
    >
      <Text style={[styles.text, { color: styleConfig.text }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: spacing.borderRadiusFull,
    alignSelf: 'flex-start',
  },
  text: {
    ...typography.badge,
    textTransform: 'uppercase',
  },
});
