import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { VehicleCard } from '../../client/src/components/VehicleCard';

describe('VehicleCard', () => {
  const defaultProps = {
    name: 'Toyota Corolla',
    plate: 'ABC-123',
    type: 'gasoline' as const,
    efficiency: '8.2 L/100km',
  };

  it('renders vehicle information', () => {
    render(<VehicleCard {...defaultProps} />);
    
    expect(screen.getByText('Toyota Corolla')).toBeInTheDocument();
    expect(screen.getByText('ABC-123')).toBeInTheDocument();
    expect(screen.getByText('8.2 L/100km')).toBeInTheDocument();
    expect(screen.getByTestId('vehicle-card-ABC-123')).toBeInTheDocument();
  });

  it('renders fuel type badges correctly', () => {
    const { rerender } = render(<VehicleCard {...defaultProps} type="gasoline" />);
    expect(screen.getByText('Gasolina')).toBeInTheDocument();

    rerender(<VehicleCard {...defaultProps} type="diesel" />);
    expect(screen.getByText('Diésel')).toBeInTheDocument();

    rerender(<VehicleCard {...defaultProps} type="electric" />);
    expect(screen.getByText('Eléctrico')).toBeInTheDocument();

    rerender(<VehicleCard {...defaultProps} type="hybrid" />);
    expect(screen.getByText('Híbrido')).toBeInTheDocument();
  });

  it('renders last fill information when provided', () => {
    render(<VehicleCard {...defaultProps} lastFill="Hace 2 días" />);
    
    expect(screen.getByText('Última carga: Hace 2 días')).toBeInTheDocument();
  });

  it('does not render last fill when not provided', () => {
    render(<VehicleCard {...defaultProps} />);
    
    expect(screen.queryByText(/Última carga:/)).not.toBeInTheDocument();
  });

  it('shows active state when isActive is true', () => {
    render(<VehicleCard {...defaultProps} isActive={true} />);
    
    const card = screen.getByTestId('vehicle-card-ABC-123');
    expect(card).toHaveClass('ring-2', 'ring-primary');
  });

  it('does not show active state when isActive is false', () => {
    render(<VehicleCard {...defaultProps} isActive={false} />);
    
    const card = screen.getByTestId('vehicle-card-ABC-123');
    expect(card).not.toHaveClass('ring-2', 'ring-primary');
  });

  it('calls onSelect when card is clicked', () => {
    const onSelect = vi.fn();
    render(<VehicleCard {...defaultProps} onSelect={onSelect} />);
    
    const card = screen.getByTestId('vehicle-card-ABC-123');
    fireEvent.click(card);
    
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it('applies correct fuel type colors', () => {
    const { rerender } = render(<VehicleCard {...defaultProps} type="gasoline" />);
    let badge = screen.getByText('Gasolina').closest('.bg-amber-100');
    expect(badge).toBeInTheDocument();

    rerender(<VehicleCard {...defaultProps} type="electric" />);
    badge = screen.getByText('Eléctrico').closest('.bg-green-100');
    expect(badge).toBeInTheDocument();

    rerender(<VehicleCard {...defaultProps} type="diesel" />);
    badge = screen.getByText('Diésel').closest('.bg-slate-100');
    expect(badge).toBeInTheDocument();

    rerender(<VehicleCard {...defaultProps} type="hybrid" />);
    badge = screen.getByText('Híbrido').closest('.bg-blue-100');
    expect(badge).toBeInTheDocument();
  });
});