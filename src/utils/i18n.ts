import { Language } from '../types';

const translations = {
  en: {
    // Navigation
    consultations: 'Consultations',
    shop: 'Shop',
    healthRecords: 'Health Records',
    settings: 'Settings',

    // Consultations
    findDoctor: 'Find Ayurvedic Doctor',
    searchDoctors: 'Search by doctor name or specialization...',
    bookConsultation: 'Book Consultation',
    availableSlots: 'Available Slots',
    upcomingConsultations: 'Upcoming Consultations',
    noUpcomingConsultations: 'No upcoming consultations booked.',
    cancelBooking: 'Cancel Booking',
    confirmCancel: 'Are you sure you want to cancel this booking?',
    slotConflictError: 'This time slot is already booked or conflicts with an existing appointment.',
    slotExpiredError: 'Selected time slot has expired. Please select a future slot.',
    doubleBookingError: 'You already have an active appointment with this doctor at this time.',
    bookingSuccess: 'Consultation booked successfully!',
    offlineQueuedBooking: 'You are offline. Booking queued and will auto-sync when online.',

    // Shop
    shopProducts: 'Ayurvedic Store',
    searchProducts: 'Search herbs, oils, supplements...',
    addToCart: 'Add to Cart',
    cart: 'Cart',
    checkout: 'Checkout Summary',
    emptyCart: 'Your cart is empty',
    total: 'Total',
    subtotal: 'Subtotal',
    deliveryFee: 'Delivery Fee',
    freeDelivery: 'FREE',
    itemAdded: 'Added to cart',
    outOfStock: 'Out of Stock',
    wishlist: 'Wishlist',
    filterBy: 'Filter By',
    sortBy: 'Sort By',
    priceLowToHigh: 'Price: Low to High',
    priceHighToLow: 'Price: High to Low',
    rating: 'Customer Rating',
    popularity: 'Popularity',

    // Health Records
    patientTimeline: 'Patient Health Timeline',
    searchRecords: 'Search reports, prescriptions, tags...',
    addRecord: 'Add Record',
    allTypes: 'All Types',
    labReport: 'Lab Report',
    prescription: 'Prescription',
    consultation: 'Consultation',
    vaccination: 'Vaccination',
    allergy: 'Allergy',
    biometricLocked: 'Timeline Locked via Biometrics',
    unlockTimeline: 'Authenticate with PIN / Biometrics to view Health Records',
    enterPin: 'Enter 4-digit security PIN',

    // Reliability & Dev Settings
    offlineMode: 'Offline Mode Active',
    networkSimulatedError: 'Network Request Failed. Retrying...',
    devSettings: 'Developer Options',
    simulateSlowNetwork: 'Simulate Slow 3G',
    simulateRandomFailures: 'Simulate API Failures (30%)',
    triggerOfflineMode: 'Force Offline Mode',
    flushSyncQueue: 'Sync Offline Queue Now',
    darkMode: 'Dark Mode',
    language: 'Language',
  },
  hi: {
    // Navigation
    consultations: 'परामर्श (Consultations)',
    shop: 'आयुर्वेदिक दुकान (Shop)',
    healthRecords: 'स्वास्थ्य रिकॉर्ड (Health Records)',
    settings: 'सेटिंग्स (Settings)',

    // Consultations
    findDoctor: 'आयुर्वेदिक डॉक्टर ढूंढें',
    searchDoctors: 'डॉक्टर का नाम या विशेषज्ञता खोजें...',
    bookConsultation: 'अपॉइंटमेंट बुक करें',
    availableSlots: 'उपलब्ध समय स्लॉट',
    upcomingConsultations: 'आगामी अपॉइंटमेंट',
    noUpcomingConsultations: 'कोई आगामी अपॉइंटमेंट नहीं है।',
    cancelBooking: 'अपॉइंटमेंट रद्द करें',
    confirmCancel: 'क्या आप वाकई इस अपॉइंटमेंट को रद्द करना चाहते हैं?',
    slotConflictError: 'यह समय स्लॉट पहले से ही बुक है या किसी अन्य अपॉइंटमेंट से मेल खाता है।',
    slotExpiredError: 'चयनित समय समाप्त हो गया है। कृपया भविष्य का स्लॉट चुनें।',
    doubleBookingError: 'आपके पास पहले से ही इस डॉक्टर के साथ अपॉइंटमेंट है।',
    bookingSuccess: 'अपॉइंटमेंट सफलतापूर्वक बुक हो गया!',
    offlineQueuedBooking: 'आप ऑफ़लाइन हैं। अपॉइंटमेंट कतारबद्ध है और ऑनलाइन होने पर सिंक होगा।',

    // Shop
    shopProducts: 'आयुर्वेदिक स्टोर',
    searchProducts: 'जड़ी-बूटियाँ, तेल, दवाएँ खोजें...',
    addToCart: 'कार्ट में जोड़ें',
    cart: 'कार्ट (Cart)',
    checkout: 'चेकआउट सारांश',
    emptyCart: 'आपकी कार्ट खाली है',
    total: 'कुल राशि',
    subtotal: 'उप-योग',
    deliveryFee: 'डिलीवरी शुल्क',
    freeDelivery: 'मुफ़्त',
    itemAdded: 'कार्ट में जोड़ा गया',
    outOfStock: 'स्टॉक में नहीं है',
    wishlist: 'विशलिस्ट',
    filterBy: 'फ़िल्टर करें',
    sortBy: 'क्रमानुसार छांटें',
    priceLowToHigh: 'मूल्य: कम से अधिक',
    priceHighToLow: 'मूल्य: अधिक से कम',
    rating: 'ग्राहक रेटिंग',
    popularity: 'लोकप्रियता',

    // Health Records
    patientTimeline: 'स्वास्थ्य टाइमलाइन',
    searchRecords: 'रिपोर्ट, पर्चे, टैग खोजें...',
    addRecord: 'रिकॉर्ड जोड़ें',
    allTypes: 'सभी प्रकार',
    labReport: 'लैब रिपोर्ट',
    prescription: 'डॉक्टर का पर्चा',
    consultation: 'परामर्श',
    vaccination: 'टीकाकरण',
    allergy: 'एलर्जी',
    biometricLocked: 'बायोमेट्रिक लॉक चालू है',
    unlockTimeline: 'रिकॉर्ड देखने के लिए पिन या बायोमेट्रिक से अनलॉक करें',
    enterPin: '4-अंकीय पिन दर्ज करें',

    // Reliability & Dev Settings
    offlineMode: 'ऑफ़लाइन मोड सक्रिय',
    networkSimulatedError: 'नेटवर्क अनुरोध विफल। पुनः प्रयास किया जा रहा है...',
    devSettings: 'डेवलपर विकल्प',
    simulateSlowNetwork: 'धीमा नेटवर्क (3G) सिमुलेट करें',
    simulateRandomFailures: 'API विफलता (30%) सिमुलेट करें',
    triggerOfflineMode: 'फ़ोर्स ऑफ़लाइन मोड',
    flushSyncQueue: 'ऑफ़लाइन कतार अभी सिंक करें',
    darkMode: 'डार्क मोड',
    language: 'भाषा',
  },
};

export const t = (key: keyof typeof translations['en'], lang: Language = 'en'): string => {
  const dict = translations[lang] || translations['en'];
  return dict[key] || translations['en'][key] || key;
};
