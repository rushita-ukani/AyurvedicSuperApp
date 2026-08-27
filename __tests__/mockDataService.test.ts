import { mockDataService } from '../src/api/mockDataService';

describe('MockDataService Performance & Scale', () => {
  beforeAll(() => {
    mockDataService.ensureDataGenerated();
  });

  test('generates 5,000 doctors and performs fast paginated search', () => {
    const res = mockDataService.getDoctors({ page: 1, limit: 20, search: 'Dr' });
    expect(res.items.length).toBe(20);
    expect(res.total).toBeGreaterThanOrEqual(4000);
    expect(res.hasMore).toBe(true);
  });

  test('generates 20,000 products and filters by category & price sorting', () => {
    const res = mockDataService.getProducts({
      page: 1,
      limit: 20,
      category: 'Herbal Supplements',
      sortBy: 'price_low_high',
    });
    expect(res.items.length).toBe(20);
    expect(res.total).toBeGreaterThan(1000);
    expect(res.items[0].price).toBeLessThanOrEqual(res.items[1].price);
  });

  test('generates 10,000 health records and filters by record type', () => {
    const res = mockDataService.getHealthRecords({
      page: 1,
      limit: 20,
      recordType: 'Lab Report',
    });
    expect(res.items.length).toBe(20);
    expect(res.total).toBeGreaterThan(1500);
    expect(res.items[0].recordType).toBe('Lab Report');
  });
});
