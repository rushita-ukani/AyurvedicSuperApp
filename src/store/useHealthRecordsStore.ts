import { create } from 'zustand';
import { HealthRecord, HealthRecordType, Attachment } from '../types';
import { mockDataService } from '../api/mockDataService';
import { logger } from '../utils/logger';

interface HealthRecordsState {
  records: HealthRecord[];
  isLocked: boolean; // Biometric PIN security lock
  pin: string;
  selectedRecordType: HealthRecordType | 'All';
  selectedTag: string | null;
  searchQuery: string;
  activeAttachment: Attachment | null;
  isLoading: boolean;

  // Actions
  unlockWithPin: (inputPin: string) => boolean;
  lockTimeline: () => void;
  setSearchQuery: (query: string) => void;
  setRecordType: (type: HealthRecordType | 'All') => void;
  setTagFilter: (tag: string | null) => void;
  setActiveAttachment: (attachment: Attachment | null) => void;
  addCustomRecord: (record: Omit<HealthRecord, 'id'>) => void;
}

export const useHealthRecordsStore = create<HealthRecordsState>((set, get) => ({
  records: [],
  isLocked: true, // Lock timeline by default for security demonstration
  pin: '1234', // Default PIN for demo
  selectedRecordType: 'All',
  selectedTag: null,
  searchQuery: '',
  activeAttachment: null,
  isLoading: false,

  unlockWithPin: (inputPin: string) => {
    if (inputPin === get().pin) {
      set({ isLocked: false });
      logger.info('useHealthRecordsStore', 'Biometric/PIN unlock successful');
      return true;
    }
    return false;
  },

  lockTimeline: () => {
    set({ isLocked: true });
  },

  setSearchQuery: (query: string) => set({ searchQuery: query }),

  setRecordType: (type) => set({ selectedRecordType: type }),

  setTagFilter: (tag) => set({ selectedTag: tag }),

  setActiveAttachment: (attachment) => set({ activeAttachment: attachment }),

  addCustomRecord: (newRec) => {
    const id = `rec_custom_${Date.now()}`;
    const fullRec: HealthRecord = { id, ...newRec };
    set(state => ({ records: [fullRec, ...state.records] }));
  },
}));
