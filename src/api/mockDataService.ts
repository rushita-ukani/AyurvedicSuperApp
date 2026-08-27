import { Doctor, Product, HealthRecord, ConsultationSlot, DoshaType, HealthRecordType, Attachment } from '../types';

// Seeded PRNG for consistent mock generation
function pseudoRandom(seed: number) {
  let value = seed;
  return function () {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

class MockDataService {
  private doctors: Doctor[] = [];
  private products: Product[] = [];
  private healthRecords: HealthRecord[] = [];
  private slotsMap: Map<string, ConsultationSlot[]> = new Map();
  private initialized = false;

  constructor() {
    this.ensureDataGenerated();
  }

  public ensureDataGenerated() {
    if (this.initialized) return;
    const start = Date.now();

    // 1. Generate 5,000 Doctors
    const specializations = [
      'Nadi Pariksha Specialist',
      'Kayachikitsa (Internal Medicine)',
      'Panchakarma Specialist',
      'Shalya Tantra (Surgical Ayurvedic Care)',
      'Dravyaguna (Herbal Pharmacology)',
      'Prasuti & Stri Roga (Gynecology)',
      'Kaumarbhritya (Pediatric Ayurvedic Care)',
      'Rasayana & Vajikarana (Rejuvenation)',
    ];

    const firstNames = [
      'Dr. Ananya', 'Dr. Vikram', 'Dr. Rajesh', 'Dr. Sunita', 'Dr. Amit', 'Dr. Priya',
      'Dr. Siddharth', 'Dr. Kavita', 'Dr. Ramesh', 'Dr. Meera', 'Dr. Arvind', 'Dr. Sneha',
      'Dr. Tarun', 'Dr. Pooja', 'Dr. Harish', 'Dr. Deepa', 'Dr. Sanjay', 'Dr. Neha',
      'Dr. Alok', 'Dr. Gayatri', 'Dr. Vivek', 'Dr. Rekha', 'Dr. Manoj', 'Dr. Swati',
    ];

    const lastNames = [
      'Sharma', 'Verma', 'Joshi', 'Iyer', 'Patel', 'Deshmukh', 'Gupta', 'Banerjee',
      'Nair', 'Kulkarni', 'Rao', 'Chowdhury', 'Tripathi', 'Mehta', 'Mishra', 'Pandey',
      'Bhat', 'Dube', 'Saxena', 'Chatterjee', 'Reddy', 'Agarwal', 'Pillai', 'Acharya',
    ];

    const doshas: DoshaType[] = ['Vata', 'Pitta', 'Kapha', 'Tridoshic'];
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const randDoctor = pseudoRandom(12345);

    this.doctors = Array.from({ length: 5000 }, (_, i) => {
      const fn = firstNames[Math.floor(randDoctor() * firstNames.length)];
      const ln = lastNames[Math.floor(randDoctor() * lastNames.length)];
      const spec = specializations[Math.floor(randDoctor() * specializations.length)];
      const exp = Math.floor(randDoctor() * 25) + 3;
      const rating = Number((4.0 + randDoctor() * 1.0).toFixed(1));
      const reviews = Math.floor(randDoctor() * 450) + 12;
      const fee = Math.floor((randDoctor() * 180 + 30)) * 10;
      const dosha = doshas[Math.floor(randDoctor() * doshas.length)];

      return {
        id: `doc-${i + 1}`,
        name: `${fn} ${ln}`,
        title: 'BAMS, MD (Ayurveda)',
        specialization: spec,
        experienceYears: exp,
        rating,
        reviewsCount: reviews,
        fee,
        availableDays: [days[i % 6], days[(i + 2) % 6], days[(i + 4) % 6]],
        bio: `Experienced Ayurvedic Vaidya with ${exp}+ years specializing in holistic ${spec.toLowerCase()} and ${dosha} balancing therapies.`,
        avatarUrl: `https://picsum.photos/seed/doc-${i + 1}/150/150`,
        doshaSpecialty: dosha,
        clinicAddress: `Ayurveda Wellness Center #${(i % 100) + 1}, Sector ${(i % 40) + 1}, New Delhi`,
        languages: ['English', 'Hindi', 'Sanskrit'],
      };
    });

    // 2. Generate 20,000 Products
    const productCategories = [
      'Herbal Supplements',
      'Keshya Hair Oils',
      'Skin & Radiant Care',
      'Digestive Care',
      'Immunity Boosters',
      'Joint & Muscle Pain Care',
      'Stress & Sleep Oils',
      'Ayurvedic Teas & Kwaths',
    ];

    const productPrefixes = [
      'Pure Ayurvedic', 'Organic', 'Traditional', 'Namboodiri', 'Forest Herbs',
      'Amrutam Gold', 'Vedic Essentials', 'Himalayan Herbal', 'Panchakarma', 'Bhasma Enriched',
    ];

    const productBases = [
      'Ashwagandha Churna', 'Triphala Ghritham', 'Brahmi Vati', 'Kumkumadi Tailam',
      'Bhringraj Hair Serum', 'Shilajit Vitality Resins', 'Giloy Ghanvati', 'Amla Juice Concentrate',
      'Neem Purifying Wash', 'Shatavari Syrup', 'Mahanarayan Oil', 'Chyawanprash Awaleha',
      'Tulsi Drops', 'Haridra Curcumin Capsules', 'Arjuna Heart Care', 'Guggulu Purifier',
    ];

    const randProduct = pseudoRandom(67890);

    this.products = Array.from({ length: 20000 }, (_, i) => {
      const prefix = productPrefixes[Math.floor(randProduct() * productPrefixes.length)];
      const base = productBases[Math.floor(randProduct() * productBases.length)];
      const category = productCategories[Math.floor(randProduct() * productCategories.length)];
      const price = Math.floor((randProduct() * 150 + 15)) * 10;
      const discount = Math.floor(randProduct() * 4) > 1 ? Math.floor(randProduct() * 30 + 10) : 0;
      const originalPrice = discount > 0 ? Math.round(price * (1 + discount / 100)) : undefined;
      const rating = Number((4.1 + randProduct() * 0.9).toFixed(1));
      const reviewsCount = Math.floor(randProduct() * 1200) + 5;
      const doshaTarget = doshas[Math.floor(randProduct() * doshas.length)];
      const inStock = randProduct() > 0.05; // 95% in stock

      return {
        id: `prod-${i + 1}`,
        name: `${prefix} ${base} ${i + 1}`,
        brand: 'Amrutam Vedic',
        category,
        price,
        originalPrice,
        rating,
        reviewsCount,
        doshaTarget,
        description: `Formulated according to classical Ayurvedic texts, this ${category.toLowerCase()} helps restore natural ${doshaTarget} equilibrium and vitality.`,
        benefits: [
          'Balancing authentic Ayurvedic formulation',
          '100% Herbal without synthetic preservatives',
          'Sourced directly from Himalayan herbal gardens',
        ],
        ingredients: ['Organic Ashwagandha', 'Amla', 'Gokshura', 'Pure Cow Ghee', 'Saffron'],
        inStock,
        imageUrl: `https://picsum.photos/seed/prod-${i + 1}/300/300`,
        isPopular: i % 25 === 0,
      };
    });

    // 3. Generate 10,000 Health Records
    const recordTypes: HealthRecordType[] = ['Lab Report', 'Prescription', 'Consultation', 'Vaccination', 'Allergy'];
    const providers = [
      'Amrutam Tele-Vaidya Clinic', 'Metropolis Diagnostic Center', 'Max Healthcare Ayurveda',
      'Dr. Ananya Sharma Clinic', 'Patanjali Research Lab', 'Thyrocare Diagnostics',
    ];
    const tagsList = [
      ['Nadi Pariksha', 'Vata Imbalance', 'Pitta Care'],
      ['Blood Profile', 'CBC', 'Hemoglobin'],
      ['Ayurvedic Prescription', 'Churna', 'Tailam'],
      ['COVID Vaccination', 'Booster'],
      ['Pollen Allergy', 'Dust Allergy', 'Nasya Therapy'],
      ['Liver Function Test', 'SGPT', 'SGOT'],
      ['Kidney Profile', 'Serum Creatinine'],
    ];

    const randRecord = pseudoRandom(54321);

    this.healthRecords = Array.from({ length: 10000 }, (_, i) => {
      const recordType = recordTypes[Math.floor(randRecord() * recordTypes.length)];
      const provider = providers[Math.floor(randRecord() * providers.length)];
      const tags = tagsList[Math.floor(randRecord() * tagsList.length)];
      
      // Dates spread over past 3 years
      const dateObj = new Date(Date.now() - Math.floor(randRecord() * 3 * 365 * 86400 * 1000));
      const isoDate = dateObj.toISOString().split('T')[0];

      const attachmentType = i % 3 === 0 ? 'pdf' : 'image';
      const attachments: Attachment[] = [
        {
          id: `att-${i + 1}-1`,
          fileName: `${recordType.replace(/\s+/g, '_')}_${isoDate}.${attachmentType === 'pdf' ? 'pdf' : 'jpg'}`,
          fileType: attachmentType,
          fileUrl: attachmentType === 'pdf' 
            ? 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
            : `https://picsum.photos/seed/att-${i + 1}/600/800`,
          thumbnailUrl: `https://picsum.photos/seed/att-${i + 1}/150/150`,
          fileSize: `${(Math.floor(randRecord() * 2500) + 200) / 1000} MB`,
        },
      ];

      return {
        id: `rec-${i + 1}`,
        title: `${recordType} #${10000 - i}`,
        recordType,
        date: isoDate,
        doctorOrLab: provider,
        description: `Patient timeline record for ${recordType.toLowerCase()} conducted at ${provider}. Consultation diagnostic summary logged.`,
        tags,
        attachments,
        severity: i % 10 === 0 ? 'severe' : i % 5 === 0 ? 'moderate' : 'mild',
      };
    });

    console.log(`[MockDataService] Generated 5,000 Doctors, 20,000 Products, and 10,000 Health Records in ${Date.now() - start}ms`);
    this.initialized = true;
  }

  // --- Doctor Queries ---
  public getDoctors(params: {
    page?: number;
    limit?: number;
    search?: string;
    specialization?: string;
    doshaTarget?: string;
  }) {
    this.ensureDataGenerated();
    const { page = 1, limit = 20, search, specialization, doshaTarget } = params;

    let filtered = this.doctors;

    if (search && search.trim() !== '') {
      const q = search.toLowerCase().trim();
      filtered = filtered.filter(
        d => d.name.toLowerCase().includes(q) || d.specialization.toLowerCase().includes(q) || d.clinicAddress.toLowerCase().includes(q)
      );
    }

    if (specialization && specialization !== 'All') {
      filtered = filtered.filter(d => d.specialization === specialization);
    }

    if (doshaTarget && doshaTarget !== 'All') {
      filtered = filtered.filter(d => d.doshaSpecialty === doshaTarget);
    }

    const startIndex = (page - 1) * limit;
    const items = filtered.slice(startIndex, startIndex + limit);
    const hasMore = startIndex + limit < filtered.length;

    return {
      items,
      total: filtered.length,
      hasMore,
      page,
    };
  }

  public getDoctorById(id: string): Doctor | undefined {
    this.ensureDataGenerated();
    return this.doctors.find(d => d.id === id);
  }

  public getDoctorSlots(doctorId: string, date: string): ConsultationSlot[] {
    const key = `${doctorId}_${date}`;
    if (!this.slotsMap.has(key)) {
      // Generate 6 default time slots for the day
      const times = [
        { start: '09:00', end: '09:30' },
        { start: '10:00', end: '10:30' },
        { start: '11:30', end: '12:00' },
        { start: '14:00', end: '14:30' },
        { start: '16:00', end: '16:30' },
        { start: '17:30', end: '18:00' },
      ];

      const slots: ConsultationSlot[] = times.map((t, idx) => {
        const slotId = `slot_${doctorId}_${date}_${idx}`;
        // Mark slot 2 as booked for conflict testing
        const isBooked = idx === 2;
        // Check if date is in the past for expired slot testing
        const isExpired = new Date(`${date}T${t.start}:00`).getTime() < Date.now();

        return {
          id: slotId,
          doctorId,
          date,
          startTime: t.start,
          endTime: t.end,
          isBooked,
          isExpired,
        };
      });

      this.slotsMap.set(key, slots);
    }

    return this.slotsMap.get(key) || [];
  }

  // --- Product Queries ---
  public getProducts(params: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    doshaTarget?: string;
    sortBy?: string;
    inStockOnly?: boolean;
    minPrice?: number;
    maxPrice?: number;
  }) {
    this.ensureDataGenerated();
    const {
      page = 1,
      limit = 20,
      search,
      category,
      doshaTarget,
      sortBy = 'popularity',
      inStockOnly,
      minPrice,
      maxPrice,
    } = params;

    let filtered = this.products;

    if (search && search.trim() !== '') {
      const q = search.toLowerCase().trim();
      filtered = filtered.filter(p => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    }

    if (category && category !== 'All') {
      filtered = filtered.filter(p => p.category === category);
    }

    if (doshaTarget && doshaTarget !== 'All') {
      filtered = filtered.filter(p => p.doshaTarget === doshaTarget);
    }

    if (inStockOnly) {
      filtered = filtered.filter(p => p.inStock);
    }

    if (minPrice !== undefined) {
      filtered = filtered.filter(p => p.price >= minPrice);
    }

    if (maxPrice !== undefined) {
      filtered = filtered.filter(p => p.price <= maxPrice);
    }

    // Sort
    if (sortBy === 'price_low_high') {
      filtered = [...filtered].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_high_low') {
      filtered = [...filtered].sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      filtered = [...filtered].sort((a, b) => b.rating - a.rating);
    }

    const startIndex = (page - 1) * limit;
    const items = filtered.slice(startIndex, startIndex + limit);
    const hasMore = startIndex + limit < filtered.length;

    return {
      items,
      total: filtered.length,
      hasMore,
      page,
    };
  }

  public getProductById(id: string): Product | undefined {
    this.ensureDataGenerated();
    return this.products.find(p => p.id === id);
  }

  // --- Health Record Queries ---
  public getHealthRecords(params: {
    page?: number;
    limit?: number;
    search?: string;
    recordType?: string;
    tag?: string;
  }) {
    this.ensureDataGenerated();
    const { page = 1, limit = 20, search, recordType, tag } = params;

    let filtered = this.healthRecords;

    if (search && search.trim() !== '') {
      const q = search.toLowerCase().trim();
      filtered = filtered.filter(
        r => r.title.toLowerCase().includes(q) || r.doctorOrLab.toLowerCase().includes(q) || r.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    if (recordType && recordType !== 'All') {
      filtered = filtered.filter(r => r.recordType === recordType);
    }

    if (tag) {
      filtered = filtered.filter(r => r.tags.includes(tag));
    }

    const startIndex = (page - 1) * limit;
    const items = filtered.slice(startIndex, startIndex + limit);
    const hasMore = startIndex + limit < filtered.length;

    return {
      items,
      total: filtered.length,
      hasMore,
      page,
    };
  }

  public getHealthRecordById(id: string): HealthRecord | undefined {
    this.ensureDataGenerated();
    return this.healthRecords.find(r => r.id === id);
  }
}

export const mockDataService = new MockDataService();
