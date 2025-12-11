// Mock data for tests
export const mockUser = {
  id: '1',
  username: 'testuser',
  email: 'test@example.com',
  createdAt: '2024-01-01T00:00:00Z',
};

export const mockVehicles = [
  {
    id: '1',
    name: 'Toyota Corolla',
    plate: 'SJO-123',
    type: 'gasoline' as const,
    efficiency: '8.2 L/100km',
    lastFill: 'Hace 2 días',
    userId: '1',
  },
  {
    id: '2',
    name: 'BYD Dolphin',
    plate: 'HER-456',
    type: 'electric' as const,
    efficiency: '15 kWh/100km',
    lastFill: 'Ayer',
    userId: '1',
  },
];

export const mockFuelRecords = [
  {
    id: '1',
    vehicleId: '1',
    userId: '1',
    amount: 45.5,
    price: 700,
    totalCost: 31850,
    date: '2024-12-10T10:00:00Z',
    odometer: 15000,
  },
  {
    id: '2',
    vehicleId: '2',
    userId: '1',
    amount: 25.0,
    price: 150,
    totalCost: 3750,
    date: '2024-12-09T14:30:00Z',
    odometer: 8500,
  },
];

export const mockStatData = {
  monthlyConsumption: '245.8 L',
  averagePrice: '₡700/L',
  efficiency: '8.2 L/100km',
  monthlySpending: '₡172,060',
};

export const mockApiResponse = {
  success: true,
  data: null,
  error: null,
};

export const mockApiError = {
  success: false,
  data: null,
  error: 'Something went wrong',
};

// Helper functions for creating mock data
export const createMockVehicle = (overrides = {}) => ({
  ...mockVehicles[0],
  ...overrides,
});

export const createMockFuelRecord = (overrides = {}) => ({
  ...mockFuelRecords[0],
  ...overrides,
});

export const createMockUser = (overrides = {}) => ({
  ...mockUser,
  ...overrides,
});