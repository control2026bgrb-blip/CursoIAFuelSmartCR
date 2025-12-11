// Simple unit tests for vehicle functionality
import { describe, it, expect } from 'vitest';
import { insertVehicleSchema } from '../../shared/schema.js';

describe('Vehicle Schema Validation', () => {
  describe('Valid Cases', () => {
    it('should validate minimal required data', () => {
      const validData = {
        name: 'Toyota Corolla',
        year: 2023
      };

      const result = insertVehicleSchema.safeParse(validData);
      expect(result.success).toBe(true);
      expect(result.data.name).toBe('Toyota Corolla');
      expect(result.data.year).toBe(2023);
      expect(result.data.fuelType).toBe('gasoline'); // Default value
    });

    it('should validate complete vehicle data', () => {
      const validData = {
        name: 'Honda Civic',
        year: '2024', // String year should be converted
        plate: 'ABC-123',
        brand: 'Honda',
        model: 'Civic',
        fuelType: 'gasoline',
        tankCapacity: '50.5',
        efficiency: '15.8'
      };

      const result = insertVehicleSchema.safeParse(validData);
      expect(result.success).toBe(true);
      expect(result.data.year).toBe(2024); // Should be converted to number
      expect(result.data.fuelType).toBe('gasoline');
    });

    it('should handle all fuel types', () => {
      const fuelTypes = ['gasoline', 'diesel', 'electric', 'hybrid'];
      
      fuelTypes.forEach(fuelType => {
        const validData = {
          name: 'Test Vehicle',
          year: 2023,
          fuelType
        };

        const result = insertVehicleSchema.safeParse(validData);
        expect(result.success).toBe(true);
        expect(result.data.fuelType).toBe(fuelType);
      });
    });
  });

  describe('Invalid Cases', () => {
    it('should reject missing name', () => {
      const invalidData = {
        year: 2023
        // Missing name
      };

      const result = insertVehicleSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      expect(result.error.issues[0].path).toEqual(['name']);
    });

    it('should reject empty name', () => {
      const invalidData = {
        name: '', // Empty string
        year: 2023
      };

      const result = insertVehicleSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      expect(result.error.issues[0].message).toBe('Vehicle name is required');
    });

    it('should reject missing year', () => {
      const invalidData = {
        name: 'Test Vehicle'
        // Missing year
      };

      const result = insertVehicleSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      expect(result.error.issues[0].path).toEqual(['year']);
    });

    it('should reject invalid fuel type', () => {
      const invalidData = {
        name: 'Test Vehicle',
        year: 2023,
        fuelType: 'invalid-fuel-type'
      };

      const result = insertVehicleSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      expect(result.error.issues[0].path).toEqual(['fuelType']);
    });
  });

  describe('Data Transformation', () => {
    it('should convert string year to number', () => {
      const data = {
        name: 'Test Vehicle',
        year: '2023'
      };

      const result = insertVehicleSchema.safeParse(data);
      expect(result.success).toBe(true);
      expect(typeof result.data.year).toBe('number');
      expect(result.data.year).toBe(2023);
    });

    it('should handle current year', () => {
      const currentYear = new Date().getFullYear();
      const data = {
        name: 'Test Vehicle',
        year: currentYear
      };

      const result = insertVehicleSchema.safeParse(data);
      expect(result.success).toBe(true);
      expect(result.data.year).toBe(currentYear);
    });

    it('should handle optional fields as undefined', () => {
      const data = {
        name: 'Test Vehicle',
        year: 2023
      };

      const result = insertVehicleSchema.safeParse(data);
      expect(result.success).toBe(true);
      expect(result.data.plate).toBeUndefined();
      expect(result.data.brand).toBeUndefined();
      expect(result.data.model).toBeUndefined();
    });
  });
});