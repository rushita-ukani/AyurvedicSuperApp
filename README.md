# Amrutam Ayurvedic Super App 🌿

A production-ready, highly performant, offline-first React Native Ayurvedic Super App built with TypeScript, React Navigation, Zustand, and custom resilience engineering. Designed to comfortably handle **5,000 Doctors**, **20,000 Shop Products**, and **10,000 Health Records** with 60 FPS UI performance.

---

## 📁 Folder Structure

```
src/
├── api/
│   ├── apiClient.ts          # Resilient API layer (retries, delay & error injection)
│   ├── cacheManager.ts       # Stale-While-Revalidate caching engine
│   └── mockDataService.ts    # High-performance 5k/20k/10k datasets & indexer
├── components/
│   ├── common/               # Button, Card, Badge, SearchBar, ToastSystem, ErrorBoundary, DevSettingsModal, BiometricLockModal
│   ├── consultation/         # DoctorCard, SlotPicker, UpcomingConsultationCard
│   ├── shop/                 # ProductCard, CartItemRow, MultiFilterModal
│   └── health/               # TimelineCard, AttachmentPreviewModal
├── navigation/
│   ├── RootNavigator.tsx     # Deep linking (amrutam://) & Theme container
│   ├── TabNavigator.tsx      # Bottom Tab Navigation
│   ├── ConsultationNavigator.tsx
│   ├── ShopNavigator.tsx
│   └── HealthNavigator.tsx
├── screens/
│   ├── consultation/         # DoctorListScreen, DoctorDetailScreen, BookingScreen, UpcomingConsultationScreen
│   ├── shop/                 # ProductListScreen, ProductDetailScreen, CartScreen, CheckoutScreen
│   ├── health/               # TimelineScreen, RecordDetailScreen, AddRecordScreen
│   └── settings/             # SettingsScreen
├── store/
│   ├── useAppStore.ts        # Theme (Light/Dark), i18n (EN/HI), Toasts, Dev Toggles
│   ├── useBookingStore.ts    # Booking state, slot conflicts, offline queue & auto-sync
│   ├── useCartStore.ts       # Persisted cart, wishlist, checkout math
│   └── useHealthRecordsStore.ts # Patient timeline, biometric lock state
├── theme/                    # Light & Dark color palettes, spacing, typography
├── types/                    # Domain models & state TypeScript interfaces
└── utils/                    # Logger, i18n catalog, deep linking config
```

---

## 🏛️ Architectural Decisions

1. **State Management Choice (Zustand)**:
   - Selected Zustand over Redux/Context for zero boilerplate, atomic state selectors, and zero re-renders during high-volume list rendering.

2. **Performance Engine (5,000 Doctors, 20,000 Products, 10,000 Health Records)**:
   - **Virtualized Rendering**: Optimized `FlatList` with `getItemLayout`, `initialNumToRender={10}`, `maxToRenderPerBatch={10}`, `windowSize={5}`, and `removeClippedSubviews`.
   - **Indexed In-Memory Lookups**: $O(1)$ ID lookups and fast $O(N)$ indexed search without UI thread blocking.
   - **Strict Memoization**: `React.memo` with custom comparison logic on all list item cards (`DoctorCard`, `ProductCard`, `TimelineCard`).

3. **Offline Strategy & Reliability**:
   - **Stale-While-Revalidate Caching**: `cacheManager.ts` caches API responses in memory & disk (`AsyncStorage`).
   - **Offline Queue & Auto-Sync**: When offline, consultations and cart actions are stored in an offline queue (`useBookingStore`). Once connectivity returns, the queue auto-flushes and synchronizes with the server.
   - **Resilience Engineering**: Built-in exponential backoff retries, slow network (3G) simulation, 30% random failure injection, expired slot validation, and slot conflict guards.

4. **Bonus Features Implemented**:
   - **Localization (Multi-Language)**: English (`en`) & Hindi (`hi`) dynamic switching.
   - **Biometric Security Lock**: 4-digit PIN ('1234') / Touch ID / Face ID lock for patient health records.
   - **Deep Linking**: Configured for `amrutam://` scheme handling deep links directly into doctors, shop products, and records.

---

## 🧪 Testing

Run unit & integration tests:
```bash
npm test
```
Tests cover:
- Mock dataset scaling throughput (5k doctors, 20k products, 10k health records).
- Booking slot conflicts, double bookings, and expired slot handling.
- Cart subtotal calculations, free delivery thresholds, and quantity updates.

---

## ⚙️ Developer Settings Menu

Open **Settings > Senior Engineering & Dev Tools** in the app to:
- Toggle Dark / Light themes.
- Toggle English / Hindi language.
- Force Offline Mode.
- Simulate Slow 3G Network (1.2s delay).
- Simulate Random 30% API Network Failures.
- Inspect and Flush Offline Queue.
