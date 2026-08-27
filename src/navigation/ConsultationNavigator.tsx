import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DoctorListScreen } from '../screens/consultation/DoctorListScreen';
import { DoctorDetailScreen } from '../screens/consultation/DoctorDetailScreen';
import { BookingScreen } from '../screens/consultation/BookingScreen';
import { UpcomingConsultationScreen } from '../screens/consultation/UpcomingConsultationScreen';

const Stack = createNativeStackNavigator();

export const ConsultationNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DoctorList" component={DoctorListScreen} />
      <Stack.Screen name="DoctorDetail" component={DoctorDetailScreen} />
      <Stack.Screen name="Booking" component={BookingScreen} />
      <Stack.Screen name="UpcomingConsultations" component={UpcomingConsultationScreen} />
    </Stack.Navigator>
  );
};
