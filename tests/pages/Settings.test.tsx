import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Settings } from '../../client/src/pages/Settings';
import * as api from '../../client/src/lib/api';
import * as useToast from '../../client/src/hooks/use-toast';

// Mock the API
vi.mock('../../client/src/lib/api', () => ({
  settingsAPI: {
    getUserSettings: vi.fn(),
    updateUserSettings: vi.fn(),
  },
}));

// Mock the toast hook
vi.mock('../../client/src/hooks/use-toast', () => ({
  useToast: vi.fn(),
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

describe('Settings', () => {
  const mockToast = vi.fn();
  
  const mockUser = {
    id: 'user123',
    username: 'testuser',
    email: 'test@example.com',
  };

  const mockSettings = {
    theme: 'light',
    notifications: true,
    language: 'es',
    currency: 'CRC',
    fuelUnit: 'liters',
    distanceUnit: 'km',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup toast mock
    (useToast.useToast as any).mockReturnValue({
      toast: mockToast,
    });

    // Setup localStorage mock
    mockLocalStorage.getItem.mockImplementation((key) => {
      if (key === 'user') {
        return JSON.stringify(mockUser);
      }
      return null;
    });

    // Setup API mocks
    (api.settingsAPI.getUserSettings as any).mockResolvedValue({
      data: mockSettings,
    });

    (api.settingsAPI.updateUserSettings as any).mockResolvedValue({
      data: { success: true },
    });
  });

  it('renders settings page', () => {
    render(<Settings />);
    
    expect(screen.getByText('Configuración')).toBeInTheDocument();
  });

  it('loads user settings on mount', async () => {
    render(<Settings />);
    
    await waitFor(() => {
      expect(api.settingsAPI.getUserSettings).toHaveBeenCalledWith('user123');
    });
  });

  it('displays loading state while fetching settings', () => {
    render(<Settings />);
    
    expect(screen.getByText('Cargando configuración...')).toBeInTheDocument();
  });

  it('displays settings form after loading', async () => {
    render(<Settings />);
    
    await waitFor(() => {
      expect(screen.queryByText('Cargando configuración...')).not.toBeInTheDocument();
    });

    expect(screen.getByText('Apariencia')).toBeInTheDocument();
    expect(screen.getByText('Notificaciones')).toBeInTheDocument();
    expect(screen.getByText('Idioma')).toBeInTheDocument();
    expect(screen.getByText('Unidades')).toBeInTheDocument();
  });

  it('handles theme selection', async () => {
    render(<Settings />);
    
    await waitFor(() => {
      expect(screen.queryByText('Cargando configuración...')).not.toBeInTheDocument();
    });

    // Find and click dark theme option
    const darkThemeOption = screen.getByLabelText('Oscuro');
    fireEvent.click(darkThemeOption);

    // Save settings
    const saveButton = screen.getByText('Guardar Cambios');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(api.settingsAPI.updateUserSettings).toHaveBeenCalledWith('user123', {
        ...mockSettings,
        theme: 'dark',
      });
    });

    expect(mockToast).toHaveBeenCalledWith({
      title: 'Configuración guardada',
      description: 'Los cambios se han guardado correctamente.',
    });
  });

  it('handles notification toggle', async () => {
    render(<Settings />);
    
    await waitFor(() => {
      expect(screen.queryByText('Cargando configuración...')).not.toBeInTheDocument();
    });

    // Find and toggle notifications
    const notificationToggle = screen.getByRole('switch', { name: /notificaciones/i });
    fireEvent.click(notificationToggle);

    // Save settings
    const saveButton = screen.getByText('Guardar Cambios');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(api.settingsAPI.updateUserSettings).toHaveBeenCalledWith('user123', {
        ...mockSettings,
        notifications: false,
      });
    });
  });

  it('handles language selection', async () => {
    render(<Settings />);
    
    await waitFor(() => {
      expect(screen.queryByText('Cargando configuración...')).not.toBeInTheDocument();
    });

    // Find and change language
    const languageSelect = screen.getByDisplayValue('Español');
    fireEvent.change(languageSelect, { target: { value: 'en' } });

    // Save settings
    const saveButton = screen.getByText('Guardar Cambios');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(api.settingsAPI.updateUserSettings).toHaveBeenCalledWith('user123', {
        ...mockSettings,
        language: 'en',
      });
    });
  });

  it('handles currency selection', async () => {
    render(<Settings />);
    
    await waitFor(() => {
      expect(screen.queryByText('Cargando configuración...')).not.toBeInTheDocument();
    });

    // Find and change currency
    const currencySelect = screen.getByDisplayValue('Colón Costarricense (₡)');
    fireEvent.change(currencySelect, { target: { value: 'USD' } });

    // Save settings
    const saveButton = screen.getByText('Guardar Cambios');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(api.settingsAPI.updateUserSettings).toHaveBeenCalledWith('user123', {
        ...mockSettings,
        currency: 'USD',
      });
    });
  });

  it('handles fuel unit selection', async () => {
    render(<Settings />);
    
    await waitFor(() => {
      expect(screen.queryByText('Cargando configuración...')).not.toBeInTheDocument();
    });

    // Find and change fuel unit
    const fuelUnitSelect = screen.getByDisplayValue('Litros');
    fireEvent.change(fuelUnitSelect, { target: { value: 'gallons' } });

    // Save settings
    const saveButton = screen.getByText('Guardar Cambios');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(api.settingsAPI.updateUserSettings).toHaveBeenCalledWith('user123', {
        ...mockSettings,
        fuelUnit: 'gallons',
      });
    });
  });

  it('handles distance unit selection', async () => {
    render(<Settings />);
    
    await waitFor(() => {
      expect(screen.queryByText('Cargando configuración...')).not.toBeInTheDocument();
    });

    // Find and change distance unit
    const distanceUnitSelect = screen.getByDisplayValue('Kilómetros');
    fireEvent.change(distanceUnitSelect, { target: { value: 'miles' } });

    // Save settings
    const saveButton = screen.getByText('Guardar Cambios');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(api.settingsAPI.updateUserSettings).toHaveBeenCalledWith('user123', {
        ...mockSettings,
        distanceUnit: 'miles',
      });
    });
  });

  it('handles API errors when loading settings', async () => {
    (api.settingsAPI.getUserSettings as any).mockRejectedValue(
      new Error('Failed to load settings')
    );

    render(<Settings />);
    
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Error',
        description: 'No se pudo cargar la configuración.',
        variant: 'destructive',
      });
    });
  });

  it('handles API errors when saving settings', async () => {
    (api.settingsAPI.updateUserSettings as any).mockRejectedValue(
      new Error('Failed to save settings')
    );

    render(<Settings />);
    
    await waitFor(() => {
      expect(screen.queryByText('Cargando configuración...')).not.toBeInTheDocument();
    });

    // Make a change and save
    const notificationToggle = screen.getByRole('switch', { name: /notificaciones/i });
    fireEvent.click(notificationToggle);

    const saveButton = screen.getByText('Guardar Cambios');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Error',
        description: 'No se pudieron guardar los cambios.',
        variant: 'destructive',
      });
    });
  });

  it('handles no user in localStorage', () => {
    mockLocalStorage.getItem.mockReturnValue(null);
    
    render(<Settings />);
    
    // Should handle gracefully
    expect(screen.getByText('Configuración')).toBeInTheDocument();
  });

  it('shows loading state while saving', async () => {
    // Make the API call take longer
    (api.settingsAPI.updateUserSettings as any).mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve({ data: { success: true } }), 1000))
    );

    render(<Settings />);
    
    await waitFor(() => {
      expect(screen.queryByText('Cargando configuración...')).not.toBeInTheDocument();
    });

    // Make a change and save
    const notificationToggle = screen.getByRole('switch', { name: /notificaciones/i });
    fireEvent.click(notificationToggle);

    const saveButton = screen.getByText('Guardar Cambios');
    fireEvent.click(saveButton);

    // Should show loading state
    expect(screen.getByText('Guardando...')).toBeInTheDocument();
  });

  it('resets form when canceling changes', async () => {
    render(<Settings />);
    
    await waitFor(() => {
      expect(screen.queryByText('Cargando configuración...')).not.toBeInTheDocument();
    });

    // Make a change
    const notificationToggle = screen.getByRole('switch', { name: /notificaciones/i });
    fireEvent.click(notificationToggle);

    // Cancel changes
    const cancelButton = screen.getByText('Cancelar');
    fireEvent.click(cancelButton);

    // Should reset to original values
    expect(notificationToggle).toBeChecked();
  });
});