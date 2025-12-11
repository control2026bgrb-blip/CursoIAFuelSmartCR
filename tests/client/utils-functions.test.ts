import { describe, it, expect } from 'vitest';

// Test utility functions that don't require React
describe('Utility Functions', () => {
  // Test string manipulation functions
  describe('String utilities', () => {
    const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
    const slugify = (str: string) => str.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
    const truncate = (str: string, length: number) => 
      str.length > length ? str.substring(0, length) + '...' : str;

    it('capitalizes first letter', () => {
      expect(capitalize('hello')).toBe('Hello');
      expect(capitalize('WORLD')).toBe('WORLD');
      expect(capitalize('')).toBe('');
    });

    it('creates slugs from strings', () => {
      expect(slugify('Hello World')).toBe('hello-world');
      expect(slugify('Test & Example!')).toBe('test--example');
      expect(slugify('Multiple   Spaces')).toBe('multiple-spaces');
    });

    it('truncates long strings', () => {
      expect(truncate('Hello World', 5)).toBe('Hello...');
      expect(truncate('Short', 10)).toBe('Short');
      expect(truncate('Exactly', 7)).toBe('Exactly');
    });
  });

  // Test array utilities
  describe('Array utilities', () => {
    const unique = <T>(arr: T[]) => [...new Set(arr)];
    const chunk = <T>(arr: T[], size: number) => {
      const chunks = [];
      for (let i = 0; i < arr.length; i += size) {
        chunks.push(arr.slice(i, i + size));
      }
      return chunks;
    };
    const groupBy = <T>(arr: T[], key: keyof T) => {
      return arr.reduce((groups, item) => {
        const group = item[key] as string;
        groups[group] = groups[group] || [];
        groups[group].push(item);
        return groups;
      }, {} as Record<string, T[]>);
    };

    it('removes duplicates from array', () => {
      expect(unique([1, 2, 2, 3, 3, 3])).toEqual([1, 2, 3]);
      expect(unique(['a', 'b', 'a', 'c'])).toEqual(['a', 'b', 'c']);
      expect(unique([])).toEqual([]);
    });

    it('chunks array into smaller arrays', () => {
      expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
      expect(chunk([1, 2, 3, 4], 2)).toEqual([[1, 2], [3, 4]]);
      expect(chunk([], 2)).toEqual([]);
    });

    it('groups array by key', () => {
      const items = [
        { type: 'fruit', name: 'apple' },
        { type: 'vegetable', name: 'carrot' },
        { type: 'fruit', name: 'banana' }
      ];
      
      const grouped = groupBy(items, 'type');
      expect(grouped.fruit).toHaveLength(2);
      expect(grouped.vegetable).toHaveLength(1);
      expect(grouped.fruit[0].name).toBe('apple');
    });
  });

  // Test date utilities
  describe('Date utilities', () => {
    const formatDate = (date: Date) => date.toISOString().split('T')[0];
    const addDays = (date: Date, days: number) => {
      const result = new Date(date);
      result.setDate(result.getDate() + days);
      return result;
    };
    const isToday = (date: Date) => {
      const today = new Date();
      return date.toDateString() === today.toDateString();
    };

    it('formats date to YYYY-MM-DD', () => {
      const date = new Date('2024-12-11T10:30:00Z');
      expect(formatDate(date)).toBe('2024-12-11');
    });

    it('adds days to date', () => {
      const date = new Date('2024-12-11');
      const future = addDays(date, 5);
      expect(formatDate(future)).toBe('2024-12-16');
    });

    it('checks if date is today', () => {
      const today = new Date();
      const yesterday = addDays(today, -1);
      
      expect(isToday(today)).toBe(true);
      expect(isToday(yesterday)).toBe(false);
    });
  });

  // Test validation functions
  describe('Validation utilities', () => {
    const isEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isPhoneNumber = (phone: string) => /^\+?[\d\s-()]+$/.test(phone);
    const isStrongPassword = (password: string) => 
      password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password);

    it('validates email addresses', () => {
      expect(isEmail('test@example.com')).toBe(true);
      expect(isEmail('user.name+tag@domain.co.uk')).toBe(true);
      expect(isEmail('invalid.email')).toBe(false);
      expect(isEmail('test@')).toBe(false);
      expect(isEmail('@example.com')).toBe(false);
    });

    it('validates phone numbers', () => {
      expect(isPhoneNumber('+1234567890')).toBe(true);
      expect(isPhoneNumber('123-456-7890')).toBe(true);
      expect(isPhoneNumber('(123) 456-7890')).toBe(true);
      expect(isPhoneNumber('abc123')).toBe(false);
    });

    it('validates strong passwords', () => {
      expect(isStrongPassword('Password123')).toBe(true);
      expect(isStrongPassword('StrongP@ss1')).toBe(true);
      expect(isStrongPassword('weak')).toBe(false);
      expect(isStrongPassword('password123')).toBe(false); // no uppercase
      expect(isStrongPassword('PASSWORD123')).toBe(false); // no lowercase
      expect(isStrongPassword('Password')).toBe(false); // no number
    });
  });

  // Test number utilities
  describe('Number utilities', () => {
    const formatCurrency = (amount: number, currency = 'USD') => 
      new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
    const percentage = (value: number, total: number) => 
      total === 0 ? 0 : Math.round((value / total) * 100);
    const clamp = (value: number, min: number, max: number) => 
      Math.min(Math.max(value, min), max);

    it('formats currency', () => {
      expect(formatCurrency(1234.56)).toBe('$1,234.56');
      expect(formatCurrency(0)).toBe('$0.00');
      expect(formatCurrency(-100)).toBe('-$100.00');
    });

    it('calculates percentage', () => {
      expect(percentage(25, 100)).toBe(25);
      expect(percentage(1, 3)).toBe(33);
      expect(percentage(0, 100)).toBe(0);
      expect(percentage(10, 0)).toBe(0);
    });

    it('clamps values within range', () => {
      expect(clamp(5, 0, 10)).toBe(5);
      expect(clamp(-5, 0, 10)).toBe(0);
      expect(clamp(15, 0, 10)).toBe(10);
    });
  });
});