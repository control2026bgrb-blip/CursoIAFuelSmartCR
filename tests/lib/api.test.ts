import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { 
  apiCall, 
  authAPI, 
  vehiclesAPI, 
  settingsAPI, 
  fuelRecordsAPI,
  API_ENDPOINTS 
} from '../../client/src/lib/api';

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('API_ENDPOINTS', () => {
    it('has correct endpoint structure', () => {
      expect(API_ENDPOINTS.auth.register).toBe('/api/auth/register');
      expect(API_ENDPOINTS.auth.login).toBe('/api/auth/login');
      expect(API_ENDPOINTS.users).toBe('/api/users');
      expect(API_ENDPOINTS.vehicles('user123')).toBe('/api/vehicles/user123');
      expect(API_ENDPOINTS.vehiclesBase).toBe('/api/vehicles');
      expect(API_ENDPOINTS.userSettings('user123')).toBe('/api/user/user123/settings');
      expect(API_ENDPOINTS.fuelRecords('user123')).toBe('/api/fuel-records/user123');
      expect(API_ENDPOINTS.fuelRecordsBase).toBe('/api/fuel-records');
      expect(API_ENDPOINTS.health).toBe('/api/health');
    });
  });

  describe('apiCall', () => {
    it('makes successful API call', async () => {
      const mockData = { success: true };
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockData),
      });

      const result = await apiCall('/test');

      expect(mockFetch).toHaveBeenCalledWith('/test', {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      expect(result.data).toEqual(mockData);
    });

    it('handles API errors', async () => {
      const errorData = { error: 'Test error' };
      mockFetch.mockResolvedValue({
        ok: false,
        status: 400,
        json: () => Promise.resolve(errorData),
      });

      await expect(apiCall('/test')).rejects.toThrow('Test error');
    });

    it('handles network errors', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));

      await expect(apiCall('/test')).rejects.toThrow('Network error');
    });

    it('handles HTTP error without error message', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        json: () => Promise.resolve({}),
      });

      await expect(apiCall('/test')).rejects.toThrow('HTTP error! status: 500');
    });
  });

  describe('authAPI', () => {
    it('registers user', async () => {
      const mockResponse = { data: { user: { id: '1', username: 'test' } } };
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await authAPI.register('testuser', 'password123');

      expect(mockFetch).toHaveBeenCalledWith('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: 'testuser', password: 'password123' }),
      });
      expect(result.data).toEqual(mockResponse);
    });

    it('logs in user', async () => {
      const mockResponse = { data: { user: { id: '1', username: 'test' } } };
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await authAPI.login('testuser', 'password123');

      expect(mockFetch).toHaveBeenCalledWith('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: 'testuser', password: 'password123' }),
      });
      expect(result.data).toEqual(mockResponse);
    });
  });

  describe('vehiclesAPI', () => {
    it('gets vehicles', async () => {
      const mockVehicles = [{ id: '1', name: 'Car 1' }];
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockVehicles),
      });

      const result = await vehiclesAPI.getVehicles('user123');

      expect(mockFetch).toHaveBeenCalledWith('/api/vehicles/user123', {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      expect(result.data).toEqual(mockVehicles);
    });

    it('creates vehicle', async () => {
      const vehicleData = { name: 'New Car', type: 'gasoline' };
      const mockResponse = { id: '1', ...vehicleData };
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await vehiclesAPI.createVehicle('user123', vehicleData);

      expect(mockFetch).toHaveBeenCalledWith('/api/vehicles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...vehicleData, userId: 'user123' }),
      });
      expect(result.data).toEqual(mockResponse);
    });

    it('updates vehicle', async () => {
      const vehicleData = { name: 'Updated Car' };
      const mockResponse = { id: 'vehicle123', ...vehicleData };
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await vehiclesAPI.updateVehicle('vehicle123', 'user123', vehicleData);

      expect(mockFetch).toHaveBeenCalledWith('/api/vehicles/vehicle123', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...vehicleData, userId: 'user123' }),
      });
      expect(result.data).toEqual(mockResponse);
    });

    it('deletes vehicle', async () => {
      const mockResponse = { success: true };
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await vehiclesAPI.deleteVehicle('vehicle123', 'user123');

      expect(mockFetch).toHaveBeenCalledWith('/api/vehicles/vehicle123', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: 'user123' }),
      });
      expect(result.data).toEqual(mockResponse);
    });
  });

  describe('settingsAPI', () => {
    it('gets user settings', async () => {
      const mockSettings = { theme: 'dark', notifications: true };
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockSettings),
      });

      const result = await settingsAPI.getUserSettings('user123');

      expect(mockFetch).toHaveBeenCalledWith('/api/user/user123/settings', {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      expect(result.data).toEqual(mockSettings);
    });

    it('updates user settings', async () => {
      const settings = { theme: 'light', notifications: false };
      const mockResponse = { success: true };
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await settingsAPI.updateUserSettings('user123', settings);

      expect(mockFetch).toHaveBeenCalledWith('/api/user/user123/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });
      expect(result.data).toEqual(mockResponse);
    });
  });

  describe('fuelRecordsAPI', () => {
    it('gets fuel records', async () => {
      const mockRecords = [{ id: '1', amount: 50 }];
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockRecords),
      });

      const result = await fuelRecordsAPI.getFuelRecords('user123');

      expect(mockFetch).toHaveBeenCalledWith('/api/fuel-records/user123', {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      expect(result.data).toEqual(mockRecords);
    });

    it('creates fuel record', async () => {
      const recordData = { amount: 50, price: 700 };
      const mockResponse = { id: '1', ...recordData };
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await fuelRecordsAPI.createFuelRecord('user123', recordData);

      expect(mockFetch).toHaveBeenCalledWith('/api/fuel-records', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...recordData, userId: 'user123' }),
      });
      expect(result.data).toEqual(mockResponse);
    });

    it('updates fuel record', async () => {
      const recordData = { amount: 60 };
      const mockResponse = { id: 'record123', ...recordData };
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await fuelRecordsAPI.updateFuelRecord('record123', 'user123', recordData);

      expect(mockFetch).toHaveBeenCalledWith('/api/fuel-records/record123', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...recordData, userId: 'user123' }),
      });
      expect(result.data).toEqual(mockResponse);
    });

    it('deletes fuel record', async () => {
      const mockResponse = { success: true };
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await fuelRecordsAPI.deleteFuelRecord('record123', 'user123');

      expect(mockFetch).toHaveBeenCalledWith('/api/fuel-records/record123', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: 'user123' }),
      });
      expect(result.data).toEqual(mockResponse);
    });
  });
});