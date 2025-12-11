import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Dashboard from '@/pages/Dashboard';

// Mock all components used in Dashboard
vi.mock('@/components/StatCard', () => ({
  StatCard: ({ title, value, 'data-testid': testId }: any) => (
    <div data-testid={testId || `stat-card-${title}`}>
      <span>{title}</span>
      <span>{value}</span>
    </div>
  )
}));

vi.mock('@/components/ConsumptionChart', () => ({
  ConsumptionChart: () => <div data-testid="consumption-chart">Chart</div>
}));

vi.mock('@/components/VehicleCard', () => ({
  VehicleCard: ({ name, plate, onSelect, isActive }: any) => (
    <div 
      data-testid={`vehicle-card-${plate}`}
      onClick={onSelect}
      className={isActive ? 'active' : ''}
    >
      <span>{name}</span>
      <span>{plate}</span>
    </div>
  )
}));

vi.mock('@/components/RecentRecords', () => ({
  RecentRecords: () => <div data-testid="recent-records">Recent Records</div>
}));

vi.mock('@/components/EcoScoreCard', () => ({
  EcoScoreCard: () => <div data-testid="eco-score-card">Eco Score</div>
}));

vi.mock('@/components/AddRecordModal', () => ({
  AddRecordModal: ({ open, onOpenChange }: any) => (
    open ? (
      <div data-testid="add-record-modal">
        <button onClick={() => onOpenChange(false)}>Close</button>
      </div>
    ) : null
  )
}));

describe('Dashboard', () => {
  it('renders dashboard page', () => {
    render(<Dashboard />);
    
    expect(screen.getByTestId('page-dashboard')).toBeInTheDocument();
    expect(screen.getByText('Panel Principal')).toBeInTheDocument();
    expect(screen.getByText('Monitorea el consumo de energía de tus vehículos')).toBeInTheDocument();
  });

  it('renders add record button', () => {
    render(<Dashboard />);
    
    const addButton = screen.getByTestId('button-add-record');
    expect(addButton).toBeInTheDocument();
    expect(addButton).toHaveTextContent('Agregar Registro');
  });

  it('renders add vehicle button', () => {
    render(<Dashboard />);
    
    const addVehicleButton = screen.getByTestId('button-add-vehicle');
    expect(addVehicleButton).toBeInTheDocument();
    expect(addVehicleButton).toHaveTextContent('Agregar');
  });

  it('renders all stat cards', () => {
    render(<Dashboard />);
    
    expect(screen.getByText('Consumo Mensual')).toBeInTheDocument();
    expect(screen.getByText('245.8 L')).toBeInTheDocument();
    expect(screen.getByText('Precio Promedio')).toBeInTheDocument();
    expect(screen.getByText('₡700/L')).toBeInTheDocument();
    expect(screen.getByText('Eficiencia')).toBeInTheDocument();
    expect(screen.getByText('8.2 L/100km')).toBeInTheDocument();
    expect(screen.getByText('Gasto Mensual')).toBeInTheDocument();
    expect(screen.getByText('₡172,060')).toBeInTheDocument();
  });

  it('renders vehicle cards', () => {
    render(<Dashboard />);
    
    expect(screen.getByTestId('vehicle-card-SJO-123')).toBeInTheDocument();
    expect(screen.getByTestId('vehicle-card-HER-456')).toBeInTheDocument();
    expect(screen.getByText('Toyota Corolla')).toBeInTheDocument();
    expect(screen.getByText('BYD Dolphin')).toBeInTheDocument();
  });

  it('renders dashboard components', () => {
    render(<Dashboard />);
    
    expect(screen.getByTestId('consumption-chart')).toBeInTheDocument();
    expect(screen.getByTestId('recent-records')).toBeInTheDocument();
    expect(screen.getByTestId('eco-score-card')).toBeInTheDocument();
  });

  it('opens add record modal when button is clicked', () => {
    render(<Dashboard />);
    
    const addButton = screen.getByTestId('button-add-record');
    fireEvent.click(addButton);
    
    expect(screen.getByTestId('add-record-modal')).toBeInTheDocument();
  });

  it('closes add record modal', () => {
    render(<Dashboard />);
    
    // Open modal
    const addButton = screen.getByTestId('button-add-record');
    fireEvent.click(addButton);
    
    // Close modal
    const closeButton = screen.getByText('Close');
    fireEvent.click(closeButton);
    
    expect(screen.queryByTestId('add-record-modal')).not.toBeInTheDocument();
  });

  it('selects vehicle when clicked', () => {
    render(<Dashboard />);
    
    const firstVehicle = screen.getByTestId('vehicle-card-SJO-123');
    const secondVehicle = screen.getByTestId('vehicle-card-HER-456');
    
    // First vehicle should be active by default
    expect(firstVehicle).toHaveClass('active');
    expect(secondVehicle).not.toHaveClass('active');
    
    // Click second vehicle
    fireEvent.click(secondVehicle);
    
    // Second vehicle should now be active
    expect(secondVehicle).toHaveClass('active');
  });

  it('renders vehicles section header', () => {
    render(<Dashboard />);
    
    expect(screen.getByText('Mis Vehículos')).toBeInTheDocument();
  });
});