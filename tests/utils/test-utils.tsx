import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi } from 'vitest';

// Create a custom render function that includes providers
const createTestQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });
};

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  queryClient?: QueryClient;
}

const customRender = (
  ui: React.ReactElement,
  options: CustomRenderOptions = {}
) => {
  const { queryClient = createTestQueryClient(), ...renderOptions } = options;

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );

  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

// Mock toast hook for tests
export const mockToast = vi.fn();
export const mockUseToast = () => ({
  toast: mockToast,
});

// Mock localStorage utilities
export const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

// Setup localStorage mock
export const setupLocalStorageMock = () => {
  Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage,
    writable: true,
  });
};

// Mock user data
export const mockUser = {
  id: 'user123',
  username: 'testuser',
  email: 'test@example.com',
};

// Mock vehicle data
export const mockVehicles = [
  {
    id: 'vehicle1',
    name: 'Toyota Corolla',
    plate: 'ABC-123',
    type: 'gasoline',
    efficiency: '8.2 L/100km',
    userId: 'user123',
  },
  {
    id: 'vehicle2',
    name: 'Honda Civic',
    plate: 'DEF-456',
    type: 'hybrid',
    efficiency: '6.5 L/100km',
    userId: 'user123',
  },
];

// Mock fuel records data
export const mockFuelRecords = [
  {
    id: 'record1',
    vehicleId: 'vehicle1',
    userId: 'user123',
    liters: 40,
    pricePerLiter: 800,
    totalCost: 32000,
    station: 'Shell',
    location: 'San José',
    date: '2024-01-15',
    notes: 'Tanque lleno',
  },
  {
    id: 'record2',
    vehicleId: 'vehicle2',
    userId: 'user123',
    liters: 35,
    pricePerLiter: 750,
    totalCost: 26250,
    station: 'Total',
    location: 'Cartago',
    date: '2024-01-10',
    notes: '',
  },
];

// Mock settings data
export const mockSettings = {
  theme: 'light',
  notifications: true,
  language: 'es',
  currency: 'CRC',
  fuelUnit: 'liters',
  distanceUnit: 'km',
};

// Utility to setup user in localStorage
export const setupLoggedInUser = (user = mockUser) => {
  mockLocalStorage.getItem.mockImplementation((key) => {
    if (key === 'user') {
      return JSON.stringify(user);
    }
    return null;
  });
};

// Utility to setup no user in localStorage
export const setupLoggedOutUser = () => {
  mockLocalStorage.getItem.mockReturnValue(null);
};

// Wait for async operations to complete
export const waitForLoadingToFinish = () => {
  return new Promise(resolve => setTimeout(resolve, 0));
};

// Mock window.matchMedia for responsive tests
export const mockMatchMedia = (matches: boolean) => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
};

// Mock IntersectionObserver for components that use it
export const mockIntersectionObserver = () => {
  global.IntersectionObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));
};

// Mock ResizeObserver for components that use it
export const mockResizeObserver = () => {
  global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));
};

// Export everything from testing-library
export * from '@testing-library/react';

// Override render method
export { customRender as render };