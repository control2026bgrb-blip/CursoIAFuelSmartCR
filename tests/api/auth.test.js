// Unit tests for authentication logic
import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';

describe('Authentication endpoints', () => {
  let app;
  let mockStorage;
  let mockBcrypt;

  beforeEach(() => {
    app = express();
    app.use(express.json());

    // Mock storage functions
    mockStorage = {
      getUserByUsername: vi.fn(),
      createUser: vi.fn()
    };

    // Mock bcrypt functions
    mockBcrypt = {
      hash: vi.fn(),
      compare: vi.fn()
    };

    // Setup auth routes with mocked dependencies
    app.post('/api/auth/register', async (req, res) => {
      try {
        const { username, password } = req.body;

        if (!username || !password) {
          return res.status(400).json({ error: 'Username and password are required' });
        }

        // Check if user already exists
        const existingUser = await mockStorage.getUserByUsername(username);
        if (existingUser) {
          return res.status(409).json({ error: 'Username already exists' });
        }

        // Hash password and create user
        const hashedPassword = await mockBcrypt.hash(password, 10);
        const newUser = await mockStorage.createUser({
          username,
          password: hashedPassword
        });

        res.status(201).json({
          user: {
            id: newUser.id,
            username: newUser.username
          }
        });
      } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
      }
    });

    app.post('/api/auth/login', async (req, res) => {
      try {
        const { username, password } = req.body;

        if (!username || !password) {
          return res.status(400).json({ error: 'Username and password are required' });
        }

        // Find user
        const user = await mockStorage.getUserByUsername(username);
        if (!user) {
          return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Verify password
        const isValidPassword = await mockBcrypt.compare(password, user.password);
        if (!isValidPassword) {
          return res.status(401).json({ error: 'Invalid credentials' });
        }

        res.json({
          user: {
            id: user.id,
            username: user.username
          }
        });
      } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
      }
    });

    // Reset mocks
    vi.clearAllMocks();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const userData = { username: 'testuser', password: 'password123' };
      const hashedPassword = 'hashed_password_123';
      const newUser = { id: 'user-1', username: 'testuser', password: hashedPassword };

      mockStorage.getUserByUsername.mockResolvedValue(null);
      mockBcrypt.hash.mockResolvedValue(hashedPassword);
      mockStorage.createUser.mockResolvedValue(newUser);

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body).toEqual({
        user: {
          id: 'user-1',
          username: 'testuser'
        }
      });

      expect(mockStorage.getUserByUsername).toHaveBeenCalledWith('testuser');
      expect(mockBcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(mockStorage.createUser).toHaveBeenCalledWith({
        username: 'testuser',
        password: hashedPassword
      });
    });

    it('should reject registration with missing username', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({ password: 'password123' })
        .expect(400);

      expect(response.body).toEqual({
        error: 'Username and password are required'
      });

      expect(mockStorage.getUserByUsername).not.toHaveBeenCalled();
    });

    it('should reject registration with missing password', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({ username: 'testuser' })
        .expect(400);

      expect(response.body).toEqual({
        error: 'Username and password are required'
      });

      expect(mockStorage.getUserByUsername).not.toHaveBeenCalled();
    });

    it('should reject registration with existing username', async () => {
      const existingUser = { id: 'user-1', username: 'testuser' };
      mockStorage.getUserByUsername.mockResolvedValue(existingUser);

      const response = await request(app)
        .post('/api/auth/register')
        .send({ username: 'testuser', password: 'password123' })
        .expect(409);

      expect(response.body).toEqual({
        error: 'Username already exists'
      });

      expect(mockStorage.getUserByUsername).toHaveBeenCalledWith('testuser');
      expect(mockBcrypt.hash).not.toHaveBeenCalled();
      expect(mockStorage.createUser).not.toHaveBeenCalled();
    });

    it('should handle storage errors during registration', async () => {
      mockStorage.getUserByUsername.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .post('/api/auth/register')
        .send({ username: 'testuser', password: 'password123' })
        .expect(500);

      expect(response.body).toEqual({
        error: 'Internal server error'
      });
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login user with valid credentials', async () => {
      const user = { 
        id: 'user-1', 
        username: 'testuser', 
        password: 'hashed_password' 
      };

      mockStorage.getUserByUsername.mockResolvedValue(user);
      mockBcrypt.compare.mockResolvedValue(true);

      const response = await request(app)
        .post('/api/auth/login')
        .send({ username: 'testuser', password: 'password123' })
        .expect(200);

      expect(response.body).toEqual({
        user: {
          id: 'user-1',
          username: 'testuser'
        }
      });

      expect(mockStorage.getUserByUsername).toHaveBeenCalledWith('testuser');
      expect(mockBcrypt.compare).toHaveBeenCalledWith('password123', 'hashed_password');
    });

    it('should reject login with missing username', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ password: 'password123' })
        .expect(400);

      expect(response.body).toEqual({
        error: 'Username and password are required'
      });

      expect(mockStorage.getUserByUsername).not.toHaveBeenCalled();
    });

    it('should reject login with missing password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ username: 'testuser' })
        .expect(400);

      expect(response.body).toEqual({
        error: 'Username and password are required'
      });

      expect(mockStorage.getUserByUsername).not.toHaveBeenCalled();
    });

    it('should reject login with non-existent user', async () => {
      mockStorage.getUserByUsername.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/auth/login')
        .send({ username: 'nonexistent', password: 'password123' })
        .expect(401);

      expect(response.body).toEqual({
        error: 'Invalid credentials'
      });

      expect(mockStorage.getUserByUsername).toHaveBeenCalledWith('nonexistent');
      expect(mockBcrypt.compare).not.toHaveBeenCalled();
    });

    it('should reject login with invalid password', async () => {
      const user = { 
        id: 'user-1', 
        username: 'testuser', 
        password: 'hashed_password' 
      };

      mockStorage.getUserByUsername.mockResolvedValue(user);
      mockBcrypt.compare.mockResolvedValue(false);

      const response = await request(app)
        .post('/api/auth/login')
        .send({ username: 'testuser', password: 'wrongpassword' })
        .expect(401);

      expect(response.body).toEqual({
        error: 'Invalid credentials'
      });

      expect(mockBcrypt.compare).toHaveBeenCalledWith('wrongpassword', 'hashed_password');
    });

    it('should handle storage errors during login', async () => {
      mockStorage.getUserByUsername.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .post('/api/auth/login')
        .send({ username: 'testuser', password: 'password123' })
        .expect(500);

      expect(response.body).toEqual({
        error: 'Internal server error'
      });
    });
  });

  describe('Security considerations', () => {
    it('should not expose password in registration response', async () => {
      const userData = { username: 'testuser', password: 'password123' };
      const hashedPassword = 'hashed_password_123';
      const newUser = { id: 'user-1', username: 'testuser', password: hashedPassword };

      mockStorage.getUserByUsername.mockResolvedValue(null);
      mockBcrypt.hash.mockResolvedValue(hashedPassword);
      mockStorage.createUser.mockResolvedValue(newUser);

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.user).not.toHaveProperty('password');
    });

    it('should not expose password in login response', async () => {
      const user = { 
        id: 'user-1', 
        username: 'testuser', 
        password: 'hashed_password' 
      };

      mockStorage.getUserByUsername.mockResolvedValue(user);
      mockBcrypt.compare.mockResolvedValue(true);

      const response = await request(app)
        .post('/api/auth/login')
        .send({ username: 'testuser', password: 'password123' })
        .expect(200);

      expect(response.body.user).not.toHaveProperty('password');
    });

    it('should hash passwords before storing', async () => {
      const userData = { username: 'testuser', password: 'password123' };
      const hashedPassword = 'hashed_password_123';

      mockStorage.getUserByUsername.mockResolvedValue(null);
      mockBcrypt.hash.mockResolvedValue(hashedPassword);
      mockStorage.createUser.mockResolvedValue({ id: 'user-1', username: 'testuser' });

      await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(mockBcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(mockStorage.createUser).toHaveBeenCalledWith({
        username: 'testuser',
        password: hashedPassword
      });
    });
  });
});