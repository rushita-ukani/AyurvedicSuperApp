import { mockDataService } from './mockDataService';
import { cacheManager } from './cacheManager';
import { logger } from '../utils/logger';

export interface ApiClientConfig {
  simulateSlowNetwork: boolean; // Add 1.5s delay
  simulateRandomFailures: boolean; // 30% failure rate
  simulateOffline: boolean;
  maxRetries: number;
}

class ApiClient {
  private config: ApiClientConfig = {
    simulateSlowNetwork: false,
    simulateRandomFailures: false,
    simulateOffline: false,
    maxRetries: 2,
  };

  public updateConfig(newConfig: Partial<ApiClientConfig>) {
    this.config = { ...this.config, ...newConfig };
    logger.info('ApiClient', 'Updated configuration', this.config);
  }

  public getConfig(): ApiClientConfig {
    return { ...this.config };
  }

  private async executeWithRetry<T>(
    cacheKey: string,
    fetcher: () => T,
    useCache: boolean = true
  ): Promise<T> {
    // 1. Check Offline mode
    if (this.config.simulateOffline) {
      if (useCache) {
        const cached = await cacheManager.get<T>(cacheKey);
        if (cached) {
          logger.info('ApiClient', `Serving cached response for offline request: ${cacheKey}`);
          return cached;
        }
      }
      throw new Error('OFFLINE_NO_CACHE');
    }

    // 2. Retry loop with exponential backoff
    let attempt = 0;
    while (attempt <= this.config.maxRetries) {
      try {
        attempt++;

        // Simulate network latency if enabled
        if (this.config.simulateSlowNetwork) {
          await new Promise(res => setTimeout(res, 1200));
        } else {
          await new Promise(res => setTimeout(res, 150));
        }

        // Simulate random 30% failures if enabled
        if (this.config.simulateRandomFailures && Math.random() < 0.3) {
          logger.warn('ApiClient', `Simulated random failure on attempt ${attempt}/${this.config.maxRetries + 1}`);
          throw new Error('SIMULATED_NETWORK_FAILURE');
        }

        const data = fetcher();

        // Save to cache
        if (useCache) {
          cacheManager.set(cacheKey, data);
        }

        return data;
      } catch (err: any) {
        if (attempt > this.config.maxRetries) {
          logger.error('ApiClient', `Request failed after ${attempt} attempts`, err);
          // Fallback to cache if available
          if (useCache) {
            const cached = await cacheManager.get<T>(cacheKey);
            if (cached) {
              logger.info('ApiClient', `Served fallback cached response for ${cacheKey}`);
              return cached;
            }
          }
          throw err;
        }
        // Exponential backoff delay
        const backoffMs = Math.pow(2, attempt) * 200;
        logger.info('ApiClient', `Retrying request in ${backoffMs}ms...`);
        await new Promise(res => setTimeout(res, backoffMs));
      }
    }

    throw new Error('UNEXPECTED_API_ERROR');
  }

  // --- API Methods ---
  public async fetchDoctors(params: Parameters<typeof mockDataService.getDoctors>[0]) {
    const cacheKey = `doctors_${JSON.stringify(params)}`;
    return this.executeWithRetry(cacheKey, () => mockDataService.getDoctors(params));
  }

  public async fetchDoctorById(id: string) {
    const cacheKey = `doctor_${id}`;
    return this.executeWithRetry(cacheKey, () => mockDataService.getDoctorById(id));
  }

  public async fetchDoctorSlots(doctorId: string, date: string) {
    const cacheKey = `slots_${doctorId}_${date}`;
    return this.executeWithRetry(cacheKey, () => mockDataService.getDoctorSlots(doctorId, date), false);
  }

  public async fetchProducts(params: Parameters<typeof mockDataService.getProducts>[0]) {
    const cacheKey = `products_${JSON.stringify(params)}`;
    return this.executeWithRetry(cacheKey, () => mockDataService.getProducts(params));
  }

  public async fetchProductById(id: string) {
    const cacheKey = `product_${id}`;
    return this.executeWithRetry(cacheKey, () => mockDataService.getProductById(id));
  }

  public async fetchHealthRecords(params: Parameters<typeof mockDataService.getHealthRecords>[0]) {
    const cacheKey = `records_${JSON.stringify(params)}`;
    return this.executeWithRetry(cacheKey, () => mockDataService.getHealthRecords(params));
  }

  public async fetchHealthRecordById(id: string) {
    const cacheKey = `record_${id}`;
    return this.executeWithRetry(cacheKey, () => mockDataService.getHealthRecordById(id));
  }
}

export const apiClient = new ApiClient();
