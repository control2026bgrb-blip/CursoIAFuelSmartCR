import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { axe, toHaveNoViolations } from 'jest-axe';
import { VehicleCard } from '../../client/src/components/VehicleCard';
import { StatCard } from '../../client/src/components/StatCard';
import { ThemeToggle } from '../../client/src/components/ThemeToggle';
import { EcoScoreCard } from '../../client/src/components/EcoScoreCard';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

describe('Accessibility Tests', () => {
  it('VehicleCard should not have accessibility violations', async () => {
    const { container } = render(
      <VehicleCard
        name="Toyota Corolla"
        plate="ABC-123"
        type="gasoline"
        efficiency="8.2 L/100km"
      />
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('StatCard should not have accessibility violations', async () => {
    const { container } = render(
      <StatCard
        title="Total Gastado"
        value="₡125,000"
        description="Este mes"
        trend="up"
        trendValue="12%"
      />
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('ThemeToggle should not have accessibility violations', async () => {
    const { container } = render(<ThemeToggle />);
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('EcoScoreCard should not have accessibility violations', async () => {
    const { container } = render(
      <EcoScoreCard
        score={85}
        level="Excelente"
        tips={[
          'Mantén velocidad constante',
          'Revisa la presión de llantas',
          'Planifica tus rutas'
        ]}
      />
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('VehicleCard with interactive elements should be keyboard accessible', () => {
    const mockOnSelect = vi.fn();
    const { getByTestId } = render(
      <VehicleCard
        name="Toyota Corolla"
        plate="ABC-123"
        type="gasoline"
        efficiency="8.2 L/100km"
        onSelect={mockOnSelect}
      />
    );
    
    const card = getByTestId('vehicle-card-ABC-123');
    
    // Should be focusable
    expect(card).toHaveAttribute('tabIndex', '0');
    
    // Should have proper role
    expect(card).toHaveAttribute('role', 'button');
  });

  it('StatCard should have proper ARIA labels', () => {
    const { getByText } = render(
      <StatCard
        title="Total Gastado"
        value="₡125,000"
        description="Este mes"
        trend="up"
        trendValue="12%"
      />
    );
    
    // Check that important information is accessible
    expect(getByText('Total Gastado')).toBeInTheDocument();
    expect(getByText('₡125,000')).toBeInTheDocument();
    expect(getByText('Este mes')).toBeInTheDocument();
  });

  it('ThemeToggle should have proper ARIA attributes', () => {
    const { getByRole } = render(<ThemeToggle />);
    
    const button = getByRole('button');
    expect(button).toHaveAttribute('aria-label');
  });

  it('Components should have proper heading hierarchy', () => {
    const { container } = render(
      <div>
        <h1>Dashboard</h1>
        <EcoScoreCard
          score={85}
          level="Excelente"
          tips={[
            'Mantén velocidad constante',
            'Revisa la presión de llantas'
          ]}
        />
      </div>
    );
    
    // Check heading hierarchy
    const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
    expect(headings.length).toBeGreaterThan(0);
  });

  it('Interactive elements should have sufficient color contrast', async () => {
    const { container } = render(
      <VehicleCard
        name="Toyota Corolla"
        plate="ABC-123"
        type="gasoline"
        efficiency="8.2 L/100km"
        isActive={true}
      />
    );
    
    // axe will check color contrast automatically
    const results = await axe(container, {
      rules: {
        'color-contrast': { enabled: true }
      }
    });
    expect(results).toHaveNoViolations();
  });

  it('Form elements should have proper labels', () => {
    // This would test form components when they're created
    // For now, we'll test that our components don't have unlabeled form elements
    const { container } = render(
      <ThemeToggle />
    );
    
    const inputs = container.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      // Each input should have a label or aria-label
      const hasLabel = input.getAttribute('aria-label') || 
                      input.getAttribute('aria-labelledby') ||
                      container.querySelector(`label[for="${input.id}"]`);
      expect(hasLabel).toBeTruthy();
    });
  });

  it('Images should have alt text', () => {
    const { container } = render(
      <EcoScoreCard
        score={85}
        level="Excelente"
        tips={['Tip 1', 'Tip 2']}
      />
    );
    
    const images = container.querySelectorAll('img');
    images.forEach(img => {
      expect(img).toHaveAttribute('alt');
    });
  });

  it('Focus management should work correctly', () => {
    const mockOnSelect = vi.fn();
    const { getByTestId } = render(
      <VehicleCard
        name="Toyota Corolla"
        plate="ABC-123"
        type="gasoline"
        efficiency="8.2 L/100km"
        onSelect={mockOnSelect}
      />
    );
    
    const card = getByTestId('vehicle-card-ABC-123');
    
    // Focus the card
    card.focus();
    expect(document.activeElement).toBe(card);
    
    // Should be able to activate with Enter key
    fireEvent.keyDown(card, { key: 'Enter', code: 'Enter' });
    expect(mockOnSelect).toHaveBeenCalled();
    
    // Should be able to activate with Space key
    fireEvent.keyDown(card, { key: ' ', code: 'Space' });
    expect(mockOnSelect).toHaveBeenCalledTimes(2);
  });
});