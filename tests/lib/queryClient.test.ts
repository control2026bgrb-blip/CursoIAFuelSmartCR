import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { apiRequest, getQueryFn, queryClient } from '@/lib/queryClient';

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('queryClient', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('apiRequest', () => {
    it('makes GET request without data', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        text: () => Promise.resolve(''),
      });

      const response = await apiRequest('GET', '/api/test');

      expect(mockFetch).toHaveBeenCalledWith('/api/test', {
        method: 'GET',
        headers: {},
        body: undefined,
        credentials: 'include',
      });
      expect(response).toBeDefined();
    });

    it('makes POST request with data', async () => {
      const testData = { name: 'test' };
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        text: () => Promise.resolve(''),
      });

      await apiRequest('POST', '/api/test', testData);

      expect(mockFetch).toHaveBeenCalledWith('/api/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testData),
        credentials: 'include',
      });
    });

    it('throws error for non-ok response', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        text: () => Promise.resolve('Error message'),
      });

      await expect(apiRequest('GET', '/api/test')).rejects.toThrow('400: Error message');
    });

    it('throws error with statusText when no response text', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        text: () => Promise.resolve(''),
      });

      await expect(apiRequest('GET', '/api/test')).rejects.toThrow('500: Internal Server Error');
    });
  });

  describe('getQueryFn', () => {
    it('creates query function that fetches data', async () => {
      const mockData = { id: 1, name: 'test' };
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockData),
        text: () => Promise.resolve(''),
      });

      const queryFn = getQueryFn({ on401: 'throw' });
      const result = await queryFn({ queryKey: ['api', 'test'] });

      expect(mockFetch).toHaveBeenCalledWith('api/test', {
        credentials: 'include',
      });
      expect(result).toEqual(mockData);
    });

    it('throws on 401 when configured to throw', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        text: () => Promise.resolve('Unauthorized'),
      });

      const queryFn = getQueryFn({ on401: 'throw' });

      await expect(queryFn({ queryKey: ['api', 'test'] })).rejects.toThrow('401: Unauthorized');
    });

    it('returns null on 401 when configured to return null', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        text: () => Promise.resolve('Unauthorized'),
      });

      const queryFn = getQueryFn({ on401: 'returnNull' });
      const result = await queryFn({ queryKey: ['api', 'test'] });

      expect(result).toBeNull();
    });

    it('throws on other error statuses even when configured to return null on 401', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        text: () => Promise.resolve('Server Error'),
      });

      const queryFn = getQueryFn({ on401: 'returnNull' });

      await expect(queryFn({ queryKey: ['api', 'test'] })).rejects.toThrow('500: Server Error');
    });
  });

  describe('queryClient configuration', () => {
    it('has correct default options', () => {
      const defaultOptions = queryClient.getDefaultOptions();

      expect(defaultOptions.queries?.refetchInterval).toBe(false);
      expect(defaultOptions.queries?.refetchOnWindowFocus).toBe(false);
      expect(defaultOptions.queries?.staleTime).toBe(Infinity);
      expect(defaultOptions.queries?.retry).toBe(false);
      expect(defaultOptions.mutations?.retry).toBe(false);
    });

    it('has queryFn configured', () => {
      const defaultOptions = queryClient.getDefaultOptions();
      expect(typeof defaultOptions.queries?.queryFn).toBe('function');
    });

    it('is a QueryClient instance', () => {
      expect(queryClient).toBeDefined();
      expect(typeof queryClient.getQueryData).toBe('function');
      expect(typeof queryClient.setQueryData).toBe('function');
      expect(typeof queryClient.invalidateQueries).toBe('function');
    });
  });
});