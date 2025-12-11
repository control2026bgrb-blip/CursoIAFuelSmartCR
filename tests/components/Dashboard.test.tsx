import { screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Dashboard from '../../client/src/pages/Dashboard';
import { render, setupLoggedInUser, setupLocalStorageMock } from '../utils/test-utils';

// Mock the toast hook
vi.mock('../../client/src/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

describe('Dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupLocalStorageMock();
    setupLoggedInUser();
  });

  it('renders dashboard title', () => {
    render(<Dashboard />);
    
    expect(screen.getByText('Panel Principal')).toBeInTheDocument();
  });

  it('displays dashboard subtitle', async () => {
    render(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('Monitorea el consumo de energía de tus vehículos')).toBeInTheDocument();
    });
  });

  it('displays vehicles section', async () => {
    render(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('Mis Vehículos')).toBeInTheDocument();
      expect(screen.getByText('Toyota Corolla')).toBeInTheDocument();
      expect(screen.getByText('BYD Dolphin')).toBeInTheDocument();
    });
  });

  it('displays add record button', async () => {
    render(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('Agregar Registro')).toBeInTheDocument();
    });
  });

  it('displays statistics cards', async () => {
    render(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('Consumo Mensual')).toBeInTheDocument();
      expect(screen.getByText('Precio Promedio')).toBeInTheDocument();
      expect(screen.getByText('Eficiencia')).toBeInTheDocument();
      expect(screen.getByText('Gasto Mensual')).toBeInTheDocument();
    });
  });

  it('displays correct statistics values', async () => {
    render(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('245.8 L')).toBeInTheDocument();
      expect(screen.getByText('₡700/L')).toBeInTheDocument();
      expect(screen.getByText('8.2 L/100km')).toBeInTheDocument();
      expect(screen.getByText('₡172,060')).toBeInTheDocument();
    });
  });

  it('displays consumption chart section', async () => {
    render(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('Consumo Mensual')).toBeInTheDocument();
    });
  });

  it('displays add vehicle button', async () => {
    render(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('Agregar')).toBeInTheDocument();
    });
  });

  it('displays vehicle information correctly', async () => {
    render(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('SJO-123')).toBeInTheDocument();
      expect(screen.getByText('HER-456')).toBeInTheDocument();
      expect(screen.getByText('8.2 L/100km')).toBeInTheDocument();
      expect(screen.getByText('15 kWh/100km')).toBeInTheDocument();
    });
  });

  it('shows vehicle last fill information', async () => {
    render(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('Hace 2 días')).toBeInTheDocument();
      expect(screen.getByText('Ayer')).toBeInTheDocument();
    });
  });

  it('displays trend information in stat cards', async () => {
    render(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('12% vs mes anterior')).toBeInTheDocument();
      expect(screen.getByText('3% aumento')).toBeInTheDocument();
      expect(screen.getByText('5% mejora')).toBeInTheDocument();
      expect(screen.getByText('8% ahorro')).toBeInTheDocument();
    });
  });

  it('shows correct subtitles in stat cards', async () => {
    render(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('Noviembre 2025')).toBeInTheDocument();
      expect(screen.getByText('Últimos 30 días')).toBeInTheDocument();
      expect(screen.getByText('Promedio actual')).toBeInTheDocument();
      expect(screen.getByText('Este mes')).toBeInTheDocument();
    });
  });

  it('renders with correct test ids', async () => {
    render(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByTestId('page-dashboard')).toBeInTheDocument();
      expect(screen.getByTestId('button-add-record')).toBeInTheDocument();
      expect(screen.getByTestId('button-add-vehicle')).toBeInTheDocument();
    });
  });
});