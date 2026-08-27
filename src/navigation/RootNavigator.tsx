import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { TabNavigator } from './TabNavigator';
import { deepLinkingConfig } from '../utils/deepLinking';
import { useAppStore } from '../store/useAppStore';
import { lightPalette, darkPalette } from '../theme';

export const RootNavigator = () => {
  const { themeMode } = useAppStore();
  const isDark = themeMode === 'dark';
  const palette = isDark ? darkPalette : lightPalette;

  const navTheme = {
    dark: isDark,
    colors: {
      primary: palette.primary,
      background: palette.background,
      card: palette.cardBg,
      text: palette.textPrimary,
      border: palette.border,
      notification: palette.terracotta,
    },
    fonts: {
      regular: { fontFamily: 'System', fontWeight: '400' as const },
      medium: { fontFamily: 'System', fontWeight: '500' as const },
      bold: { fontFamily: 'System', fontWeight: '700' as const },
      heavy: { fontFamily: 'System', fontWeight: '800' as const },
    },
  };

  return (
    <NavigationContainer linking={deepLinkingConfig} theme={navTheme}>
      <TabNavigator />
    </NavigationContainer>
  );
};
