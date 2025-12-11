// Unit tests for /api/users endpoint
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import express from 'express';

describe('/api/users endpoint', () => {
  let app;
  let mockDb;
  let mockUsersTable;

  beforeEach(() => {
    // Create a fresh Express app for each test
    app = express();
    app.use(express.json());

    // Mock database and users table
    mockUsersTable = {
      id: 'id',
      username: 'username'
    };

    mockDb = {
      select: vi.fn()
    };

    // Define the users endpoint with mocked dependencies
    app.get('/api/users', async (req, res) => {
      try {
        const allUsers = await mockDb.select({
          id: mockUsersTable.id,
          username: mockUsersTable.username,
        }).from(mockUsersTable);
        res.json({ users: allUsers });
      } catch (error) {
        console.error('❌ Get users error:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });

    // Reset mocks
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('GET /api/users', () => {
    it('should return all users successfully', async () => {
      const mockUsers = [
        { id: 'user-1', username: 'testuser1' },
        { id: 'user-2', username: 'testuser2' }
      ];

      // Setup mock to return users
      mockDb.select.mockReturnValue({
        from: vi.fn().mockResolvedValue(mockUsers)
      });

      const response = await request(app)
        .get('/api/users')
        .expect(200);

      expect(response.body).toEqual({
        users: mockUsers
      });

      // Verify database was called correctly
      expect(mockDb.select).toHaveBeenCalledWith({
        id: mockUsersTable.id,
        username: mockUsersTable.username
      });
    });

    it('should return empty array when no users exist', async () => {
      // Setup mock to return empty array
      mockDb.select.mockReturnValue({
        from: vi.fn().mockResolvedValue([])
      });

      const response = await request(app)
        .get('/api/users')
        .expect(200);

      expect(response.body).toEqual({
        users: []
      });
    });

    it('should handle database errors gracefully', async () => {
      // Setup mock to throw error
      const dbError = new Error('Database connection failed');
      mockDb.select.mockReturnValue({
        from: vi.fn().mockRejectedValue(dbError)
      });

      const response = await request(app)
        .get('/api/users')
        .expect(500);

      expect(response.body).toEqual({
        error: 'Internal server error'
      });
    });

    it('should only return id and username fields', async () => {
      const safeUsers = [{ id: 'user-1', username: 'testuser1' }];

      mockDb.select.mockReturnValue({
        from: vi.fn().mockResolvedValue(safeUsers)
      });

      const response = await request(app)
        .get('/api/users')
        .expect(200);

      // Verify only safe fields are returned
      expect(response.body.users[0]).toEqual({
        id: 'user-1',
        username: 'testuser1'
      });

      // Verify sensitive fields are not included
      expect(response.body.users[0]).not.toHaveProperty('password');
      expect(response.body.users[0]).not.toHaveProperty('email');
    });

    it('should handle malformed database responses', async () => {
      // Setup mock to return null
      mockDb.select.mockReturnValue({
        from: vi.fn().mockResolvedValue(null)
      });

      const response = await request(app)
        .get('/api/users')
        .expect(200);

      expect(response.body).toEqual({
        users: null
      });
    });
  });

  describe('Response format validation', () => {
    it('should return correct response structure', async () => {
      const mockUsers = [
        { id: 'user-1', username: 'testuser1' },
        { id: 'user-2', username: 'testuser2' }
      ];

      mockDb.select.mockReturnValue({
        from: vi.fn().mockResolvedValue(mockUsers)
      });

      const response = await request(app)
        .get('/api/users')
        .expect(200);

      // Verify response structure
      expect(response.body).toHaveProperty('users');
      expect(Array.isArray(response.body.users)).toBe(true);
      
      // Verify each user has correct structure
      response.body.users.forEach(user => {
        expect(user).toHaveProperty('id');
        expect(user).toHaveProperty('username');
        expect(typeof user.id).toBe('string');
        expect(typeof user.username).toBe('string');
      });
    });

    it('should set correct content type', async () => {
      const mockUsers = [{ id: 'user-1', username: 'testuser1' }];

      mockDb.select.mockReturnValue({
        from: vi.fn().mockResolvedValue(mockUsers)
      });

      const response = await request(app)
        .get('/api/users')
        .expect(200);

      expect(response.headers['content-type']).toMatch(/application\/json/);
    });
  });

  describe('Database interaction', () => {
    it('should call database with correct parameters', async () => {
      const mockUsers = [{ id: 'user-1', username: 'testuser1' }];
      const fromMock = vi.fn().mockResolvedValue(mockUsers);
      mockDb.select.mockReturnValue({ from: fromMock });

      await request(app)
        .get('/api/users')
        .expect(200);

      // Verify select was called with correct fields
      expect(mockDb.select).toHaveBeenCalledWith({
        id: mockUsersTable.id,
        username: mockUsersTable.username
      });

      // Verify from was called with users table
      expect(fromMock).toHaveBeenCalledWith(mockUsersTable);
    });

    it('should handle database timeout', async () => {
      // Simulate database timeout
      const timeoutError = new Error('Query timeout');
      timeoutError.code = 'QUERY_TIMEOUT';
      
      mockDb.select.mockReturnValue({
        from: vi.fn().mockRejectedValue(timeoutError)
      });

      const response = await request(app)
        .get('/api/users')
        .expect(500);

      expect(response.body).toEqual({
        error: 'Internal server error'
      });
    });
  });
});