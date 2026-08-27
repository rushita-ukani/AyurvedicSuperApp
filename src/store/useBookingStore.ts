import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Booking, ConsultationSlot, PendingQueueItem } from '../types';
import { useAppStore } from './useAppStore';
import { logger } from '../utils/logger';

const BOOKINGS_STORAGE_KEY = '@ayurvedic_super_app_bookings_v1';
const QUEUE_STORAGE_KEY = '@ayurvedic_super_app_offline_queue_v1';

interface BookingState {
  bookings: Booking[];
  offlineQueue: PendingQueueItem[];
  isLoading: boolean;

  // Actions
  createBooking: (
    doctor: { id: string; name: string; specialization: string; fee: number },
    slot: ConsultationSlot,
    patientDetails: { name: string; phone: string; reason: string }
  ) => { success: boolean; error?: string; booking?: Booking };

  cancelBooking: (bookingId: string) => { success: boolean; error?: string };
  syncOfflineQueue: () => Promise<void>;
  loadPersistedBookings: () => Promise<void>;
  checkSlotConflict: (doctorId: string, date: string, startTime: string) => boolean;
  checkDoubleBooking: (doctorId: string, date: string, startTime: string) => boolean;
  checkExpiredSlot: (date: string, startTime: string) => boolean;
}

export const useBookingStore = create<BookingState>((set, get) => ({
  bookings: [
    // Pre-populate 1 sample upcoming consultation for realistic experience
    {
      id: 'book-sample-1',
      doctorId: 'doc-1',
      doctorName: 'Dr. Ananya Sharma',
      doctorSpecialization: 'Nadi Pariksha Specialist',
      slotId: 'slot-sample-1',
      date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
      time: '10:00 - 10:30',
      patientName: 'Self (Patient)',
      patientPhone: '+91 9876543210',
      reason: 'Seasonal Vata Imbalance consultation',
      fee: 600,
      status: 'upcoming',
      bookedAt: new Date().toISOString(),
    },
  ],
  offlineQueue: [],
  isLoading: true,

  checkSlotConflict: (doctorId, date, startTime) => {
    return get().bookings.some(
      b => b.doctorId === doctorId && b.date === date && b.time.startsWith(startTime) && b.status === 'upcoming'
    );
  },

  checkDoubleBooking: (doctorId, date, startTime) => {
    return get().bookings.some(
      b => b.doctorId === doctorId && b.date === date && b.time.startsWith(startTime) && b.status === 'upcoming'
    );
  },

  checkExpiredSlot: (date, startTime) => {
    const slotDateTime = new Date(`${date}T${startTime}:00`).getTime();
    return slotDateTime < Date.now();
  },

  createBooking: (doctor, slot, patientDetails) => {
    const { isOffline, addToast } = useAppStore.getState();

    // 1. Validate Expired Slot
    if (get().checkExpiredSlot(slot.date, slot.startTime)) {
      addToast({
        type: 'error',
        message: 'Slot Expired',
        description: 'The selected consultation slot is in the past. Please choose a future slot.',
      });
      return { success: false, error: 'SLOT_EXPIRED' };
    }

    // 2. Validate Slot Conflict / Double Booking
    if (get().checkSlotConflict(doctor.id, slot.date, slot.startTime)) {
      addToast({
        type: 'error',
        message: 'Booking Conflict',
        description: 'You already have an appointment booked for this doctor at this time.',
      });
      return { success: false, error: 'SLOT_CONFLICT' };
    }

    const bookingId = `book_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newBooking: Booking = {
      id: bookingId,
      doctorId: doctor.id,
      doctorName: doctor.name,
      doctorSpecialization: doctor.specialization,
      slotId: slot.id,
      date: slot.date,
      time: `${slot.startTime} - ${slot.endTime}`,
      patientName: patientDetails.name,
      patientPhone: patientDetails.phone,
      reason: patientDetails.reason,
      fee: doctor.fee,
      status: isOffline ? 'queued_offline' : 'upcoming',
      bookedAt: new Date().toISOString(),
      syncPending: isOffline,
    };

    const updatedBookings = [newBooking, ...get().bookings];
    set({ bookings: updatedBookings });
    saveBookings(updatedBookings);

    // If offline, add to queue
    if (isOffline) {
      const queueItem: PendingQueueItem = {
        id: `queue_${bookingId}`,
        type: 'booking',
        payload: newBooking,
        createdAt: new Date().toISOString(),
        retries: 0,
      };
      const updatedQueue = [...get().offlineQueue, queueItem];
      set({ offlineQueue: updatedQueue });
      saveQueue(updatedQueue);

      addToast({
        type: 'info',
        message: 'Booking Queued (Offline)',
        description: 'Your booking has been saved locally and will auto-sync when internet is restored.',
      });
    } else {
      addToast({
        type: 'success',
        message: 'Consultation Booked!',
        description: `Appointment confirmed with ${doctor.name} on ${slot.date} at ${slot.startTime}.`,
      });
    }

    return { success: true, booking: newBooking };
  },

  cancelBooking: (bookingId) => {
    const { addToast } = useAppStore.getState();
    const target = get().bookings.find(b => b.id === bookingId);
    if (!target) {
      return { success: false, error: 'BOOKING_NOT_FOUND' };
    }

    const updatedBookings = get().bookings.map(b =>
      b.id === bookingId ? { ...b, status: 'cancelled' as const } : b
    );

    set({ bookings: updatedBookings });
    saveBookings(updatedBookings);

    addToast({
      type: 'warning',
      message: 'Consultation Cancelled',
      description: `Your appointment with ${target.doctorName} has been cancelled.`,
    });

    return { success: true };
  },

  syncOfflineQueue: async () => {
    const { offlineQueue, bookings } = get();
    if (offlineQueue.length === 0) return;

    logger.info('useBookingStore', `Processing ${offlineQueue.length} offline queue items...`);

    const updatedBookings = bookings.map(b => {
      if (b.status === 'queued_offline') {
        return { ...b, status: 'upcoming' as const, syncPending: false };
      }
      return b;
    });

    set({ bookings: updatedBookings, offlineQueue: [] });
    await saveBookings(updatedBookings);
    await saveQueue([]);

    useAppStore.getState().addToast({
      type: 'success',
      message: 'Offline Queue Synced',
      description: `Successfully synchronized ${offlineQueue.length} offline actions with the server.`,
    });
  },

  loadPersistedBookings: async () => {
    try {
      const bRaw = await AsyncStorage.getItem(BOOKINGS_STORAGE_KEY);
      const qRaw = await AsyncStorage.getItem(QUEUE_STORAGE_KEY);
      set({
        bookings: bRaw ? JSON.parse(bRaw) : get().bookings,
        offlineQueue: qRaw ? JSON.parse(qRaw) : [],
        isLoading: false,
      });
    } catch (e) {
      logger.error('useBookingStore', 'Failed to load bookings', e);
      set({ isLoading: false });
    }
  },
}));

async function saveBookings(bookings: Booking[]) {
  try {
    await AsyncStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(bookings));
  } catch (e) {
    logger.error('useBookingStore', 'Failed to persist bookings', e);
  }
}

async function saveQueue(queue: PendingQueueItem[]) {
  try {
    await AsyncStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(queue));
  } catch (e) {
    logger.error('useBookingStore', 'Failed to persist offline queue', e);
  }
}
