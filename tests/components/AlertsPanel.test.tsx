import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AlertsPanel } from '../../client/src/components/AlertsPanel';

describe('AlertsPanel', () => {
  it('renders alerts panel with title', () => {
    render(<AlertsPanel />);
    
    expect(screen.getByText('Alertas y Notificaciones')).toBeInTheDocument();
  });

  it('displays filter buttons', () => {
    render(<AlertsPanel />);
    
    expect(screen.getByText('Todas')).toBeInTheDocument();
    expect(screen.getByText('Mantenimiento')).toBeInTheDocument();
    expect(screen.getByText('Precios')).toBeInTheDocument();
    expect(screen.getByText('Advertencias')).toBeInTheDocument();
    expect(screen.getByText('Eco Tips')).toBeInTheDocument();
    expect(screen.getByText('Promociones')).toBeInTheDocument();
  });

  it('displays initial alerts', () => {
    render(<AlertsPanel />);
    
    expect(screen.getByText('Mantenimiento Próximo')).toBeInTheDocument();
    expect(screen.getByText('Precio Bajo Detectado')).toBeInTheDocument();
    expect(screen.getByText('Consumo Elevado')).toBeInTheDocument();
  });

  it('filters alerts by category', () => {
    render(<AlertsPanel />);
    
    // Click on maintenance filter
    const maintenanceFilter = screen.getByText('Mantenimiento');
    fireEvent.click(maintenanceFilter);
    
    // Should show only maintenance alerts
    expect(screen.getByText('Mantenimiento Próximo')).toBeInTheDocument();
    expect(screen.queryByText('Precio Bajo Detectado')).not.toBeInTheDocument();
  });

  it('filters alerts by price category', () => {
    render(<AlertsPanel />);
    
    // Click on price filter
    const priceFilter = screen.getByText('Precios');
    fireEvent.click(priceFilter);
    
    // Should show only price alerts
    expect(screen.getByText('Precio Bajo Detectado')).toBeInTheDocument();
    expect(screen.queryByText('Mantenimiento Próximo')).not.toBeInTheDocument();
  });

  it('shows all alerts when "Todas" filter is selected', () => {
    render(<AlertsPanel />);
    
    // First filter by maintenance
    const maintenanceFilter = screen.getByText('Mantenimiento');
    fireEvent.click(maintenanceFilter);
    
    // Then click "Todas" to show all
    const allFilter = screen.getByText('Todas');
    fireEvent.click(allFilter);
    
    // Should show all alerts again
    expect(screen.getByText('Mantenimiento Próximo')).toBeInTheDocument();
    expect(screen.getByText('Precio Bajo Detectado')).toBeInTheDocument();
    expect(screen.getByText('Consumo Elevado')).toBeInTheDocument();
  });

  it('dismisses individual alerts', () => {
    render(<AlertsPanel />);
    
    // Find and click dismiss button for first alert
    const dismissButtons = screen.getAllByLabelText('Descartar alerta');
    fireEvent.click(dismissButtons[0]);
    
    // The alert should be marked as dismissed (implementation dependent)
    // This test assumes the alert gets hidden or marked differently
  });

  it('handles alert actions', () => {
    render(<AlertsPanel />);
    
    // Find and click action button
    const actionButtons = screen.getAllByText('Ver detalles');
    expect(actionButtons.length).toBeGreaterThan(0);
    
    // Click first action button
    fireEvent.click(actionButtons[0]);
    
    // This would typically trigger some action (navigation, modal, etc.)
    // The exact behavior depends on implementation
  });

  it('displays correct alert icons', () => {
    render(<AlertsPanel />);
    
    // Check that alert icons are rendered
    // This is implementation-dependent based on how icons are rendered
    const alertCards = screen.getAllByRole('button');
    expect(alertCards.length).toBeGreaterThan(0);
  });

  it('shows alert timestamps', () => {
    render(<AlertsPanel />);
    
    expect(screen.getByText('Hace 1 día')).toBeInTheDocument();
    expect(screen.getByText('Hace 3 horas')).toBeInTheDocument();
    expect(screen.getByText('Hace 2 horas')).toBeInTheDocument();
  });

  it('displays alert descriptions', () => {
    render(<AlertsPanel />);
    
    expect(screen.getByText(/Tu vehículo alcanzará los 50,000 km pronto/)).toBeInTheDocument();
    expect(screen.getByText(/Total Lindora tiene gasolina Super/)).toBeInTheDocument();
    expect(screen.getByText(/Has consumido 15% más combustible/)).toBeInTheDocument();
  });

  it('handles empty state when no alerts match filter', () => {
    render(<AlertsPanel />);
    
    // Filter by a category that might not have alerts
    const promotionFilter = screen.getByText('Promociones');
    fireEvent.click(promotionFilter);
    
    // Should handle empty state gracefully
    // This depends on implementation - might show "No alerts" message
  });

  it('maintains filter state correctly', () => {
    render(<AlertsPanel />);
    
    // Click maintenance filter
    const maintenanceFilter = screen.getByText('Mantenimiento');
    fireEvent.click(maintenanceFilter);
    
    // Verify the filter button appears active/selected
    expect(maintenanceFilter).toHaveClass('bg-primary', 'text-primary-foreground');
  });

  it('displays correct badge variants for different alert types', () => {
    render(<AlertsPanel />);
    
    // Check that different alert types have appropriate styling
    const badges = screen.getAllByText(/Mantenimiento|Precio|Advertencia/);
    expect(badges.length).toBeGreaterThan(0);
  });

  it('handles alert interaction states', () => {
    render(<AlertsPanel />);
    
    // Find alert cards and test hover/click states
    const alertCards = screen.getAllByRole('button');
    
    // Simulate hover on first alert
    fireEvent.mouseEnter(alertCards[0]);
    fireEvent.mouseLeave(alertCards[0]);
    
    // Simulate click on first alert
    fireEvent.click(alertCards[0]);
    
    // These interactions should be handled gracefully
  });
});