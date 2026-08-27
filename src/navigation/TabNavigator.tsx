import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Stethoscope, ShoppingBag, Activity, Settings } from 'lucide-react-native';
import { ConsultationNavigator } from './ConsultationNavigator';
import { ShopNavigator } from './ShopNavigator';
import { HealthNavigator } from './HealthNavigator';
import { SettingsScreen } from '../screens/settings/SettingsScreen';
import { useAppStore } from '../store/useAppStore';
import { useCartStore } from '../store/useCartStore';
import { lightPalette, darkPalette, spacing, typography } from '../theme';
import { t } from '../utils/i18n';

const Tab = createBottomTabNavigator();

export const TabNavigator = () => {
  const { themeMode, language } = useAppStore();
  const { getCartTotal } = useCartStore();
  const theme = themeMode === 'dark' ? darkPalette : lightPalette;

  const { itemCount } = getCartTotal();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textMuted,
        tabBarStyle: {
          backgroundColor: theme.cardBg,
          borderTopColor: theme.border,
          height: 60,
          paddingBottom: spacing.xs,
          paddingTop: spacing.xs,
        },
        tabBarLabelStyle: {
          ...typography.captionBold,
          fontSize: 11,
        },
      }}
    >
      <Tab.Screen
        component={ConsultationNavigator}
        name="ConsultationTab"
        options={{
          tabBarLabel: t('consultations', language),
          tabBarIcon: ({ color, size }) => <Stethoscope color={color} size={size} />,
        }}
      />
      <Tab.Screen
        component={ShopNavigator}
        name="ShopTab"
        options={{
          tabBarLabel: t('shop', language),
          tabBarBadge: itemCount > 0 ? itemCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: theme.terracotta,
            color: '#FFFFFF',
            fontSize: 10,
          },
          tabBarIcon: ({ color, size }) => <ShoppingBag color={color} size={size} />,
        }}
      />
      <Tab.Screen
        component={HealthNavigator}
        name="HealthTab"
        options={{
          tabBarLabel: t('healthRecords', language),
          tabBarIcon: ({ color, size }) => <Activity color={color} size={size} />,
        }}
      />
      <Tab.Screen
        component={SettingsScreen}
        name="SettingsTab"
        options={{
          tabBarLabel: t('settings', language),
          tabBarIcon: ({ color, size }) => <Settings color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
};
