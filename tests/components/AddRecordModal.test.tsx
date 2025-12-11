import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AddRecordModal } from '../../client/src/components/AddRecordModal';
import * as api from '../../client/src/lib/api';
import * as useToast from '../../client/src/hooks/use-toast';

// Mock the API
vi.mock('../../client/src/lib/api', () => ({
  vehiclesAPI: {
    getVehicles: vi.fn(),
  },
  fuelRecordsAPI: {
    createFuelRecord: vi.fn(),
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

describe('AddRecordModal', () => {
  const mockToast = vi.fn();
  const mockOnOpenChange = vi.fn();
  const mockOnRecordAdded = vi.fn();

  const defaultProps = {
    open: true,
    onOpenChange: mockOnOpenChange,
    onRecordAdded: mockOnRecordAdded,
  };

  const mockUser = {
    id: 'user123',
    username: 'testuser',
  };

  const mockVehicles = [
    {
      id: 'vehicle1',
      name: 'Toyota Corolla',
      plate: 'ABC-123',
      type: 'gasoline',
    },
    {
      id: 'vehicle2',
      name: 'Honda Civic',
      plate: 'DEF-456',
      type: 'hybrid',
    },
  ];

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
    (api.vehiclesAPI.getVehicles as any).mockResolvedValue({
      data: mockVehicles,
    });

    (api.fuelRecordsAPI.createFuelRecord as any).mockResolvedValue({
      data: { id: 'record123', success: true },
    });
  });

  it('renders modal when open', async () => {
    render(<AddRecordModal {...defaultProps} />);
    
    expect(screen.getByText('Agregar Registro de Combustible')).toBeInTheDocument();
    expect(screen.getByText('Registra tu consumo de combustible de forma rápida y precisa')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(<AddRecordModal {...defaultProps} open={false} />);
    
    expect(screen.queryByText('Agregar Registro de Combustible')).not.toBeInTheDocument();
  });

  it('loads vehicles on mount', async () => {
    render(<AddRecordModal {...defaultProps} />);
    
    await waitFor(() => {
      expect(api.vehiclesAPI.getVehicles).toHaveBeenCalledWith('user123');
    });
  });

  it('displays loading state while fetching vehicles', () => {
    render(<AddRecordModal {...defaultProps} />);
    
    expect(screen.getByText('Cargando vehículos...')).toBeInTheDocument();
  });

  it('displays vehicles in select dropdown', async () => {
    render(<AddRecordModal {...defaultProps} />);
    
    await waitFor(() => {
      expect(screen.queryByText('Cargando vehículos...')).not.toBeInTheDocument();
    });

    // Click on vehicle select
    const vehicleSelect = screen.getByText('Selecciona un vehículo');
    fireEvent.click(vehicleSelect);

    await waitFor(() => {
      expect(screen.getByText('Toyota Corolla (ABC-123)')).toBeInTheDocument();
      expect(screen.getByText('Honda Civic (DEF-456)')).toBeInTheDocument();
    });
  });

  it('handles manual entry form submission', async () => {
    render(<AddRecordModal {...defaultProps} />);
    
    await waitFor(() => {
      expect(screen.queryByText('Cargando vehículos...')).not.toBeInTheDocument();
    });

    // Fill out the form
    const vehicleSelect = screen.getByText('Selecciona un vehículo');
    fireEvent.click(vehicleSelect);
    
    await waitFor(() => {
      const vehicleOption = screen.getByText('Toyota Corolla (ABC-123)');
      fireEvent.click(vehicleOption);
    });

    const litersInput = screen.getByLabelText('Litros');
    fireEvent.change(litersInput, { target: { value: '40' } });

    const priceInput = screen.getByLabelText('Precio por Litro (₡)');
    fireEvent.change(priceInput, { target: { value: '800' } });

    const stationInput = screen.getByLabelText('Estación de Servicio');
    fireEvent.change(stationInput, { target: { value: 'Shell' } });

    // Submit the form
    const submitButton = screen.getByText('Guardar Registro');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(api.fuelRecordsAPI.createFuelRecord).toHaveBeenCalledWith('user123', {
        vehicleId: 'vehicle1',
        liters: 40,
        pricePerLiter: 800,
        totalCost: 32000,
        station: 'Shell',
        location: '',
        notes: '',
        date: expect.any(String),
      });
    });

    expect(mockToast).toHaveBeenCalledWith({
      title: 'Registro guardado',
      description: 'El registro de combustible se ha guardado correctamente.',
    });

    expect(mockOnRecordAdded).toHaveBeenCalled();
    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });

  it('calculates total cost automatically', async () => {
    render(<AddRecordModal {...defaultProps} />);
    
    await waitFor(() => {
      expect(screen.queryByText('Cargando vehículos...')).not.toBeInTheDocument();
    });

    const litersInput = screen.getByLabelText('Litros');
    fireEvent.change(litersInput, { target: { value: '50' } });

    const priceInput = screen.getByLabelText('Precio por Litro (₡)');
    fireEvent.change(priceInput, { target: { value: '750' } });

    // Check if total is calculated
    expect(screen.getByText('Total: ₡37,500')).toBeInTheDocument();
  });

  it('handles form validation errors', async () => {
    render(<AddRecordModal {...defaultProps} />);
    
    await waitFor(() => {
      expect(screen.queryByText('Cargando vehículos...')).not.toBeInTheDocument();
    });

    // Try to submit without filling required fields
    const submitButton = screen.getByText('Guardar Registro');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Error',
        description: 'Por favor completa todos los campos requeridos.',
        variant: 'destructive',
      });
    });

    expect(api.fuelRecordsAPI.createFuelRecord).not.toHaveBeenCalled();
  });

  it('handles API errors gracefully', async () => {
    (api.fuelRecordsAPI.createFuelRecord as any).mockRejectedValue(
      new Error('Network error')
    );

    render(<AddRecordModal {...defaultProps} />);
    
    await waitFor(() => {
      expect(screen.queryByText('Cargando vehículos...')).not.toBeInTheDocument();
    });

    // Fill out the form
    const vehicleSelect = screen.getByText('Selecciona un vehículo');
    fireEvent.click(vehicleSelect);
    
    await waitFor(() => {
      const vehicleOption = screen.getByText('Toyota Corolla (ABC-123)');
      fireEvent.click(vehicleOption);
    });

    const litersInput = screen.getByLabelText('Litros');
    fireEvent.change(litersInput, { target: { value: '40' } });

    const priceInput = screen.getByLabelText('Precio por Litro (₡)');
    fireEvent.change(priceInput, { target: { value: '800' } });

    // Submit the form
    const submitButton = screen.getByText('Guardar Registro');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Error',
        description: 'No se pudo guardar el registro. Inténtalo de nuevo.',
        variant: 'destructive',
      });
    });
  });

  it('switches between input methods', () => {
    render(<AddRecordModal {...defaultProps} />);
    
    // Check default tab
    expect(screen.getByText('Manual')).toBeInTheDocument();
    
    // Switch to camera tab
    const cameraTab = screen.getByText('Cámara');
    fireEvent.click(cameraTab);
    
    expect(screen.getByText('Escanear Recibo')).toBeInTheDocument();
  });

  it('handles camera scanning simulation', async () => {
    render(<AddRecordModal {...defaultProps} />);
    
    // Switch to camera tab
    const cameraTab = screen.getByText('Cámara');
    fireEvent.click(cameraTab);
    
    // Start scanning
    const scanButton = screen.getByText('Iniciar Escaneo');
    fireEvent.click(scanButton);
    
    expect(screen.getByText('Escaneando...')).toBeInTheDocument();
    
    // Wait for scan to complete (simulated)
    await waitFor(() => {
      expect(screen.getByText('¡Escaneo Completado!')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('handles no user in localStorage', () => {
    mockLocalStorage.getItem.mockReturnValue(null);
    
    render(<AddRecordModal {...defaultProps} />);
    
    expect(screen.getByText('Agregar Registro de Combustible')).toBeInTheDocument();
    // Should still render but with limited functionality
  });

  it('handles vehicle loading error', async () => {
    (api.vehiclesAPI.getVehicles as any).mockRejectedValue(
      new Error('Failed to load vehicles')
    );

    render(<AddRecordModal {...defaultProps} />);
    
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Error',
        description: 'No se pudieron cargar los vehículos.',
        variant: 'destructive',
      });
    });
  });
});