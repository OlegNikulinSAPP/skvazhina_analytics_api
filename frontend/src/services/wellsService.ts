// frontend/src/services/wellsService.ts
import { apiClient, mockExternalApiClient } from './api';

// Типы данных (соответствуют mock API)
export interface Coordinates {
  lat: number;
  lon: number;
}

export interface WellData {
  well_id: string;
  temperature: number;
  flow_rate: number;
  pressure: number;
  coordinates: Coordinates;
  depth: number;
  status: 'active' | 'inactive' | 'maintenance';
  last_updated?: string;
  installation_date?: string;
  field_name?: string;
  operator?: string;
  last_maintenance?: string;
}

export interface TelemetryData {
  well_id: string;
  parameters: string[];
  units: Record<string, string>;
  telemetry: {
    timestamps: number[];
    temperature: number[];
    pressure: number[];
    flow_rate: number[];
  };
  period_hours: number;
  points: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface WellsListResponse {
  wells: WellData[];
  count: number;
  timestamp: string;
  api_version: string;
}

// Сервис для работы с внешним API (mock или реальное)
export class ExternalWellService {
  // Использовать ли mock API (true = использовать наш mock, false = реальный API)
  private useMock: boolean = true;

  // Получить список скважин
  async getWells(): Promise<WellData[]> {
    try {
      console.log('📡 [wellsService] Запрос списка скважин...');
      console.log('📡 URL:', mockExternalApiClient.defaults.baseURL + '/api/v1/wells/');

      const response = await mockExternalApiClient.get('/api/v1/wells/');

      console.log('✅ [wellsService] Ответ получен:', response.status);
      console.log('📦 Данные:', response.data);

      // Попробуем разные форматы
      const data = response.data;

      if (data && data.data && data.data.wells) {
        console.log('✅ Формат 1 (data.data.wells)');
        return data.data.wells;
      }
      else if (data && data.wells) {
        console.log('✅ Формат 2 (data.wells)');
        return data.wells;
      }
      else if (Array.isArray(data)) {
        console.log('✅ Формат 3 (массив)');
        return data;
      }
      else {
        console.warn('⚠️ Неизвестный формат:', data);
        return [];
      }

    } catch (error: any) {
      console.error('❌ [wellsService] Ошибка:', error);
      console.error('❌ Детали:', error.response?.data || error.message);
      return []; // Возвращаем пустой массив вместо ошибки
    }
  }

  // Получить данные конкретной скважины
  async getWellById(id: string): Promise<WellData> {
    try {
      if (this.useMock) {
        const response = await mockExternalApiClient.get<ApiResponse<WellData>>(`/api/v1/wells/${id}/`);
        return response.data.data;
      } else {
        throw new Error('Real external API not implemented yet');
      }
    } catch (error) {
      console.error(`Error fetching well ${id}:`, error);
      throw error;
    }
  }

  // Получить телеметрию скважины
  async getWellTelemetry(id: string, hours: number = 24, points: number = 100): Promise<TelemetryData> {
    try {
      if (this.useMock) {
        const response = await mockExternalApiClient.get<ApiResponse<TelemetryData>>(
          `/api/v1/wells/${id}/telemetry/?hours=${hours}&points=${points}`
        );
        return response.data.data;
      } else {
        throw new Error('Real external API not implemented yet');
      }
    } catch (error) {
      console.error(`Error fetching telemetry for well ${id}:`, error);
      throw error;
    }
  }

  // Проверить доступность API
  async checkHealth(): Promise<{ status: string; [key: string]: any }> {
    try {
      if (this.useMock) {
        const response = await mockExternalApiClient.get('/api/v1/health/');
        return response.data;
      } else {
        throw new Error('Real external API not implemented yet');
      }
    } catch (error) {
      console.error('Error checking API health:', error);
      return { status: 'unhealthy', error: String(error) };
    }
  }

  // Переключить между mock и реальным API
  setUseMock(useMock: boolean): void {
    this.useMock = useMock;
    console.log(`Switched to ${useMock ? 'mock' : 'real'} external API`);
  }

  // Получить текущий режим
  getCurrentMode(): string {
    return this.useMock ? 'mock' : 'real';
  }
}

// Создаем и экспортируем экземпляр сервиса
export const externalWellService = new ExternalWellService();
