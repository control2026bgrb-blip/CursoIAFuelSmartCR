import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock API functions that simulate the real API behavior
describe('Mock API Functions', () => {
  const mockFetch = vi.fn();
  global.fetch = mockFetch;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Mock API client
  class MockApiClient {
    private baseUrl: string;

    constructor(baseUrl = '/api') {
      this.baseUrl = baseUrl;
    }

    async request(endpoint: string, options: RequestInit = {}) {
      const url = `${this.baseUrl}${endpoint}`;
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return response.json();
    }

    async get(endpoint: string) {
      return this.request(endpoint, { method: 'GET' });
    }

    async post(endpoint: string, data: any) {
      return this.request(endpoint, {
        method: 'POST',
        body: JSON.stringify(data),
      });
    }

    async put(endpoint: string, data: any) {
      return this.request(endpoint, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    }

    async delete(endpoint: string) {
      return this.request(endpoint, { method: 'DELETE' });
    }
  }

  describe('MockApiClient', () => {
    let apiClient: MockApiClient;

    beforeEach(() => {
      apiClient = new MockApiClient();
    });

    it('makes GET requests', async () => {
      const mockData = { id: 1, name: 'Test' };
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockData),
      });

      const result = await apiClient.get('/users/1');

      expect(mockFetch).toHaveBeenCalledWith('/api/users/1', {
        headers: { 'Content-Type': 'application/json' },
        method: 'GET',
      });
      expect(result).toEqual(mockData);
    });

    it('makes POST requests with data', async () => {
      const postData = { name: 'New User', email: 'user@example.com' };
      const responseData = { id: 2, ...postData };
      
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(responseData),
      });

      const result = await apiClient.post('/users', postData);

      expect(mockFetch).toHaveBeenCalledWith('/api/users', {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify(postData),
      });
      expect(result).toEqual(responseData);
    });

    it('makes PUT requests with data', async () => {
      const updateData = { name: 'Updated User' };
      const responseData = { id: 1, ...updateData };
      
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(responseData),
      });

      const result = await apiClient.put('/users/1', updateData);

      expect(mockFetch).toHaveBeenCalledWith('/api/users/1', {
        headers: { 'Content-Type': 'application/json' },
        method: 'PUT',
        body: JSON.stringify(updateData),
      });
      expect(result).toEqual(responseData);
    });

    it('makes DELETE requests', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      });

      const result = await apiClient.delete('/users/1');

      expect(mockFetch).toHaveBeenCalledWith('/api/users/1', {
        headers: { 'Content-Type': 'application/json' },
        method: 'DELETE',
      });
      expect(result).toEqual({ success: true });
    });

    it('handles HTTP errors', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      });

      await expect(apiClient.get('/users/999')).rejects.toThrow('HTTP 404: Not Found');
    });

    it('uses custom base URL', () => {
      const customClient = new MockApiClient('https://api.example.com');
      expect(customClient['baseUrl']).toBe('https://api.example.com');
    });
  });

  // Mock data store
  describe('Mock Data Store', () => {
    class MockDataStore {
      private data: Map<string, any[]> = new Map();

      getCollection(name: string) {
        return this.data.get(name) || [];
      }

      setCollection(name: string, items: any[]) {
        this.data.set(name, [...items]);
      }

      addItem(collection: string, item: any) {
        const items = this.getCollection(collection);
        const newItem = { ...item, id: Date.now() };
        this.setCollection(collection, [...items, newItem]);
        return newItem;
      }

      updateItem(collection: string, id: number, updates: any) {
        const items = this.getCollection(collection);
        const index = items.findIndex(item => item.id === id);
        if (index === -1) return null;
        
        const updatedItem = { ...items[index], ...updates };
        items[index] = updatedItem;
        this.setCollection(collection, items);
        return updatedItem;
      }

      deleteItem(collection: string, id: number) {
        const items = this.getCollection(collection);
        const filtered = items.filter(item => item.id !== id);
        this.setCollection(collection, filtered);
        return filtered.length < items.length;
      }

      findById(collection: string, id: number) {
        return this.getCollection(collection).find(item => item.id === id);
      }

      clear() {
        this.data.clear();
      }
    }

    let store: MockDataStore;

    beforeEach(() => {
      store = new MockDataStore();
    });

    it('manages collections', () => {
      expect(store.getCollection('users')).toEqual([]);
      
      store.setCollection('users', [{ id: 1, name: 'John' }]);
      expect(store.getCollection('users')).toHaveLength(1);
    });

    it('adds items to collection', () => {
      const user = store.addItem('users', { name: 'Jane', email: 'jane@example.com' });
      
      expect(user).toHaveProperty('id');
      expect(user.name).toBe('Jane');
      expect(store.getCollection('users')).toHaveLength(1);
    });

    it('updates items in collection', () => {
      const user = store.addItem('users', { name: 'John', email: 'john@example.com' });
      const updated = store.updateItem('users', user.id, { name: 'John Doe' });
      
      expect(updated?.name).toBe('John Doe');
      expect(updated?.email).toBe('john@example.com');
    });

    it('deletes items from collection', () => {
      const user = store.addItem('users', { name: 'John' });
      const deleted = store.deleteItem('users', user.id);
      
      expect(deleted).toBe(true);
      expect(store.getCollection('users')).toHaveLength(0);
    });

    it('finds items by id', () => {
      const user = store.addItem('users', { name: 'John' });
      const found = store.findById('users', user.id);
      
      expect(found).toEqual(user);
    });

    it('returns null for non-existent updates', () => {
      const result = store.updateItem('users', 999, { name: 'Ghost' });
      expect(result).toBeNull();
    });

    it('returns false for non-existent deletes', () => {
      const result = store.deleteItem('users', 999);
      expect(result).toBe(false);
    });

    it('clears all data', () => {
      store.addItem('users', { name: 'John' });
      store.addItem('posts', { title: 'Test Post' });
      
      store.clear();
      
      expect(store.getCollection('users')).toHaveLength(0);
      expect(store.getCollection('posts')).toHaveLength(0);
    });
  });
});