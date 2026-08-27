import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { useAppStore } from '../../store/useAppStore';
import { lightPalette, darkPalette, spacing } from '../../theme';

interface CardProps extends ViewProps {
  elevated?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, style, elevated = true, ...props }) => {
  const { themeMode } = useAppStore();
  const theme = themeMode === 'dark' ? darkPalette : lightPalette;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.cardBg,
          borderColor: theme.border,
        },
        elevated && styles.shadow,
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: spacing.borderRadiusMd,
    padding: spacing.lg,
    borderWidth: 1,
    marginVertical: spacing.xs,
  },
  shadow: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
});
