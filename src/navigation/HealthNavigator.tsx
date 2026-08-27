import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TimelineScreen } from '../screens/health/TimelineScreen';
import { RecordDetailScreen } from '../screens/health/RecordDetailScreen';
import { AddRecordScreen } from '../screens/health/AddRecordScreen';

const Stack = createNativeStackNavigator();

export const HealthNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Timeline" component={TimelineScreen} />
      <Stack.Screen name="RecordDetail" component={RecordDetailScreen} />
      <Stack.Screen name="AddRecord" component={AddRecordScreen} />
    </Stack.Navigator>
  );
};
