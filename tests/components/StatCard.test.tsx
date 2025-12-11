import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { StatCard } from '@/components/StatCard';
import { Fuel, TrendingUp, TrendingDown, Minus } from 'lucide-react';

describe('StatCard', () => {
  const defaultProps = {
    title: 'Test Stat',
    value: '100',
    icon: Fuel,
  };

  it('renders basic stat card', () => {
    render(<StatCard {...defaultProps} />);
    
    expect(screen.getByText('Test Stat')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByTestId('stat-card-test-stat')).toBeInTheDocument();
  });

  it('renders with subtitle', () => {
    render(<StatCard {...defaultProps} subtitle="Test subtitle" />);
    
    expect(screen.getByText('Test subtitle')).toBeInTheDocument();
  });

  it('renders with upward trend', () => {
    render(
      <StatCard 
        {...defaultProps} 
        trend="up" 
        trendValue="5% increase" 
      />
    );
    
    expect(screen.getByText('5% increase')).toBeInTheDocument();
  });

  it('renders with downward trend', () => {
    render(
      <StatCard 
        {...defaultProps} 
        trend="down" 
        trendValue="3% decrease" 
      />
    );
    
    expect(screen.getByText('3% decrease')).toBeInTheDocument();
  });

  it('renders with neutral trend', () => {
    render(
      <StatCard 
        {...defaultProps} 
        trend="neutral" 
        trendValue="No change" 
      />
    );
    
    expect(screen.getByText('No change')).toBeInTheDocument();
  });

  it('applies custom icon color', () => {
    const { container } = render(<StatCard {...defaultProps} iconColor="text-blue-500" />);
    
    const iconContainer = container.querySelector('.text-blue-500');
    expect(iconContainer).toBeInTheDocument();
  });

  it('uses default icon color when not specified', () => {
    const { container } = render(<StatCard {...defaultProps} />);
    
    const iconContainer = container.querySelector('.text-primary');
    expect(iconContainer).toBeInTheDocument();
  });

  it('handles title with spaces in test id', () => {
    render(<StatCard {...defaultProps} title="Monthly Consumption" />);
    
    expect(screen.getByTestId('stat-card-monthly-consumption')).toBeInTheDocument();
  });

  it('does not render trend when trend is provided but trendValue is not', () => {
    render(<StatCard {...defaultProps} trend="up" />);
    
    expect(screen.queryByText('TrendingUp')).not.toBeInTheDocument();
  });

  it('does not render trend when trendValue is provided but trend is not', () => {
    render(<StatCard {...defaultProps} trendValue="5% increase" />);
    
    expect(screen.queryByText('5% increase')).not.toBeInTheDocument();
  });
});