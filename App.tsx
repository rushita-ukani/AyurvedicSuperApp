import React, { useEffect } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './src/navigation/RootNavigator';
import { ToastSystem } from './src/components/common/ToastSystem';
import { ErrorBoundary } from './src/components/common/ErrorBoundary';
import { useAppStore } from './src/store/useAppStore';
import { useCartStore } from './src/store/useCartStore';
import { useBookingStore } from './src/store/useBookingStore';
import { lightPalette, darkPalette } from './src/theme';

function App() {
  const { themeMode } = useAppStore();
  const { loadPersistedCart } = useCartStore();
  const { loadPersistedBookings } = useBookingStore();

  const isDarkMode = themeMode === 'dark';
  const theme = isDarkMode ? darkPalette : lightPalette;

  useEffect(() => {
    loadPersistedCart();
    loadPersistedBookings();
  }, []);

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <View style={[styles.container, { backgroundColor: theme.background }]}>
          <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
          <ToastSystem />
          <RootNavigator />
        </View>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
