import { useBookingStore } from '../src/store/useBookingStore';

describe('Booking Store & Slot Validation Logic', () => {
  beforeEach(() => {
    useBookingStore.setState({
      bookings: [],
      offlineQueue: [],
      isLoading: false,
    });
  });

  test('prevents booking an expired slot', () => {
    const isExpired = useBookingStore.getState().checkExpiredSlot('2020-01-01', '10:00');
    expect(isExpired).toBe(true);

    const res = useBookingStore.getState().createBooking(
      { id: 'doc-1', name: 'Dr. Test', specialization: 'Nadi', fee: 500 },
      { id: 'slot-1', doctorId: 'doc-1', date: '2020-01-01', startTime: '10:00', endTime: '10:30', isBooked: false, isExpired: true },
      { name: 'Patient Test', phone: '9999999999', reason: 'Checkup' }
    );

    expect(res.success).toBe(false);
    expect(res.error).toBe('SLOT_EXPIRED');
  });

  test('prevents double booking / slot conflicts', () => {
    const futureDate = new Date(Date.now() + 86400000).toISOString().split('T')[0];

    // First booking succeeds
    const res1 = useBookingStore.getState().createBooking(
      { id: 'doc-1', name: 'Dr. Test', specialization: 'Nadi', fee: 500 },
      { id: 'slot-1', doctorId: 'doc-1', date: futureDate, startTime: '14:00', endTime: '14:30', isBooked: false, isExpired: false },
      { name: 'Patient One', phone: '9999999999', reason: 'Checkup' }
    );
    expect(res1.success).toBe(true);

    // Second booking for same doctor, date & time fails due to conflict
    const res2 = useBookingStore.getState().createBooking(
      { id: 'doc-1', name: 'Dr. Test', specialization: 'Nadi', fee: 500 },
      { id: 'slot-1', doctorId: 'doc-1', date: futureDate, startTime: '14:00', endTime: '14:30', isBooked: false, isExpired: false },
      { name: 'Patient Two', phone: '8888888888', reason: 'Checkup' }
    );
    expect(res2.success).toBe(false);
    expect(res2.error).toBe('SLOT_CONFLICT');
  });
});
