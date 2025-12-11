import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { App } from '../../client/src/App';
import * as api from '../../client/src/lib/api';

// Mock the API
vi.mock('../../client/src/lib/api', () => ({
  authAPI: {
    login: vi.fn(),
    register: vi.fn(),
  },
  vehiclesAPI: {
    getVehicles: vi.fn(),
    createVehicle: vi.fn(),
  },
  fuelRecordsAPI: {
    getFuelRecords: vi.fn(),
    createFuelRecord: vi.fn(),
  },
  settingsAPI: {
    getUserSettings: vi.fn(),
    updateUserSettings: vi.fn(),
  },
}));

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

describe('User Flow Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup default API responses
    (api.authAPI.login as any).mockResolvedValue({
      data: {
        user: { id: 'user123', username: 'testuser' },
        token: 'mock-token',
      },
    });

    (api.vehiclesAPI.getVehicles as any).mockResolvedValue({
      data: [],
    });

    (api.fuelRecordsAPI.getFuelRecords as any).mockResolvedValue({
      data: [],
    });

    (api.settingsAPI.getUserSettings as any).mockResolvedValue({
      data: {
        theme: 'light',
        notifications: true,
        language: 'es',
        currency: 'CRC',
      },
    });

    // Setup localStorage to return no user initially
    mockLocalStorage.getItem.mockReturnValue(null);
  });

  it('completes full user registration and login flow', async () => {
    (api.authAPI.register as any).mockResolvedValue({
      data: {
        user: { id: 'user123', username: 'newuser' },
        token: 'mock-token',
      },
    });

    render(<App />);
    
    // Should show login page initially
    expect(screen.getByText('Iniciar Sesión')).toBeInTheDocument();
    
    // Switch to register mode
    const registerButton = screen.getByText('Crear cuenta');
    fireEvent.click(registerButton);
    
    expect(screen.getByText('Crear Cuenta')).toBeInTheDocument();
    
    // Fill registration form
    const usernameInput = screen.getByLabelText('Usuario');
    const passwordInput = screen.getByLabelText('Contraseña');
    const confirmPasswordInput = screen.getByLabelText('Confirmar Contraseña');
    
    fireEvent.change(usernameInput, { target: { value: 'newuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
    
    // Submit registration
    const submitButton = screen.getByText('Registrarse');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(api.authAPI.register).toHaveBeenCalledWith('newuser', 'password123');
    });
    
    // Should redirect to dashboard after successful registration
    await waitFor(() => {
      expect(screen.getByText('Panel de Control')).toBeInTheDocument();
    });
  });

  it('completes login flow and navigates to dashboard', async () => {
    render(<App />);
    
    // Fill login form
    const usernameInput = screen.getByLabelText('Usuario');
    const passwordInput = screen.getByLabelText('Contraseña');
    
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    // Submit login
    const loginButton = screen.getByText('Iniciar Sesión');
    fireEvent.click(loginButton);
    
    await waitFor(() => {
      expect(api.authAPI.login).toHaveBeenCalledWith('testuser', 'password123');
    });
    
    // Should redirect to dashboard
    await waitFor(() => {
      expect(screen.getByText('Panel de Control')).toBeInTheDocument();
    });
  });

  it('navigates between different pages when logged in', async () => {
    // Mock user as logged in
    mockLocalStorage.getItem.mockImplementation((key) => {
      if (key === 'user') {
        return JSON.stringify({ id: 'user123', username: 'testuser' });
      }
      return null;
    });

    render(<App />);
    
    // Should show dashboard
    await waitFor(() => {
      expect(screen.getByText('Panel de Control')).toBeInTheDocument();
    });
    
    // Navigate to alerts
    const alertsLink = screen.getByText('Alertas');
    fireEvent.click(alertsLink);
    
    await waitFor(() => {
      expect(screen.getByText('Alertas y Notificaciones')).toBeInTheDocument();
    });
    
    // Navigate to settings
    const settingsLink = screen.getByText('Configuración');
    fireEvent.click(settingsLink);
    
    await waitFor(() => {
      expect(screen.getByText('Configuración')).toBeInTheDocument();
    });
  });

  it('handles vehicle creation flow', async () => {
    // Mock user as logged in
    mockLocalStorage.getItem.mockImplementation((key) => {
      if (key === 'user') {
        return JSON.stringify({ id: 'user123', username: 'testuser' });
      }
      return null;
    });

    (api.vehiclesAPI.createVehicle as any).mockResolvedValue({
      data: {
        id: 'vehicle123',
        name: 'Toyota Corolla',
        plate: 'ABC-123',
        type: 'gasoline',
      },
    });

    render(<App />);
    
    // Navigate to vehicle registration
    await waitFor(() => {
      expect(screen.getByText('Panel de Control')).toBeInTheDocument();
    });
    
    // Click add vehicle button (assuming it exists in dashboard)
    const addVehicleButton = screen.getByText('Agregar Vehículo');
    fireEvent.click(addVehicleButton);
    
    // Fill vehicle form
    const nameInput = screen.getByLabelText('Nombre del Vehículo');
    const plateInput = screen.getByLabelText('Placa');
    
    fireEvent.change(nameInput, { target: { value: 'Toyota Corolla' } });
    fireEvent.change(plateInput, { target: { value: 'ABC-123' } });
    
    // Select vehicle type
    const typeSelect = screen.getByLabelText('Tipo de Combustible');
    fireEvent.change(typeSelect, { target: { value: 'gasoline' } });
    
    // Submit form
    const submitButton = screen.getByText('Guardar Vehículo');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(api.vehiclesAPI.createVehicle).toHaveBeenCalledWith('user123', {
        name: 'Toyota Corolla',
        plate: 'ABC-123',
        type: 'gasoline',
      });
    });
  });

  it('handles fuel record creation flow', async () => {
    // Mock user as logged in with vehicles
    mockLocalStorage.getItem.mockImplementation((key) => {
      if (key === 'user') {
        return JSON.stringify({ id: 'user123', username: 'testuser' });
      }
      return null;
    });

    (api.vehiclesAPI.getVehicles as any).mockResolvedValue({
      data: [
        {
          id: 'vehicle123',
          name: 'Toyota Corolla',
          plate: 'ABC-123',
          type: 'gasoline',
        },
      ],
    });

    (api.fuelRecordsAPI.createFuelRecord as any).mockResolvedValue({
      data: {
        id: 'record123',
        success: true,
      },
    });

    render(<App />);
    
    // Navigate to add record
    await waitFor(() => {
      expect(screen.getByText('Panel de Control')).toBeInTheDocument();
    });
    
    const addRecordLink = screen.getByText('Agregar Registro');
    fireEvent.click(addRecordLink);
    
    // Should open add record modal or page
    await waitFor(() => {
      expect(screen.getByText('Agregar Registro de Combustible')).toBeInTheDocument();
    });
    
    // Fill fuel record form
    const vehicleSelect = screen.getByText('Selecciona un vehículo');
    fireEvent.click(vehicleSelect);
    
    await waitFor(() => {
      const vehicleOption = screen.getByText('Toyota Corolla (ABC-123)');
      fireEvent.click(vehicleOption);
    });
    
    const litersInput = screen.getByLabelText('Litros');
    const priceInput = screen.getByLabelText('Precio por Litro (₡)');
    
    fireEvent.change(litersInput, { target: { value: '40' } });
    fireEvent.change(priceInput, { target: { value: '800' } });
    
    // Submit record
    const submitButton = screen.getByText('Guardar Registro');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(api.fuelRecordsAPI.createFuelRecord).toHaveBeenCalledWith('user123', {
        vehicleId: 'vehicle123',
        liters: 40,
        pricePerLiter: 800,
        totalCost: 32000,
        station: '',
        location: '',
        notes: '',
        date: expect.any(String),
      });
    });
  });

  it('handles logout flow', async () => {
    // Mock user as logged in
    mockLocalStorage.getItem.mockImplementation((key) => {
      if (key === 'user') {
        return JSON.stringify({ id: 'user123', username: 'testuser' });
      }
      return null;
    });

    render(<App />);
    
    // Should show dashboard
    await waitFor(() => {
      expect(screen.getByText('Panel de Control')).toBeInTheDocument();
    });
    
    // Click logout button
    const logoutButton = screen.getByText('Cerrar Sesión');
    fireEvent.click(logoutButton);
    
    // Should clear localStorage and redirect to login
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('user');
    
    await waitFor(() => {
      expect(screen.getByText('Iniciar Sesión')).toBeInTheDocument();
    });
  });

  it('handles API errors gracefully throughout the flow', async () => {
    // Mock login to fail
    (api.authAPI.login as any).mockRejectedValue(new Error('Invalid credentials'));

    render(<App />);
    
    // Try to login with invalid credentials
    const usernameInput = screen.getByLabelText('Usuario');
    const passwordInput = screen.getByLabelText('Contraseña');
    
    fireEvent.change(usernameInput, { target: { value: 'wronguser' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpass' } });
    
    const loginButton = screen.getByText('Iniciar Sesión');
    fireEvent.click(loginButton);
    
    // Should show error message
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
    
    // Should remain on login page
    expect(screen.getByText('Iniciar Sesión')).toBeInTheDocument();
  });
});