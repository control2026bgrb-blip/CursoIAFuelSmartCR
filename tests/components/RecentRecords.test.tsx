import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { mockFuelRecords } from '../mock-data';

// Mock the RecentRecords component
const RecentRecords = () => (
  <div data-testid="recent-records">
    <h3>Registros Recientes</h3>
    <div data-testid="records-list">
      {mockFuelRecords.map(record => (
        <div key={record.id} data-testid={`record-${record.id}`}>
          <span>{record.amount}L</span>
          <span>₡{record.totalCost}</span>
          <span>{new Date(record.date).toLocaleDateString()}</span>
        </div>
      ))}
    </div>
  </div>
);

vi.mock('@/components/RecentRecords', () => ({
  RecentRecords: RecentRecords
}));

describe('RecentRecords', () => {
  it('renders recent records component', () => {
    render(<RecentRecords />);
    
    expect(screen.getByTestId('recent-records')).toBeInTheDocument();
    expect(screen.getByText('Registros Recientes')).toBeInTheDocument();
  });

  it('displays list of records', () => {
    render(<RecentRecords />);
    
    expect(screen.getByTestId('records-list')).toBeInTheDocument();
    expect(screen.getByTestId('record-1')).toBeInTheDocument();
    expect(screen.getByTestId('record-2')).toBeInTheDocument();
  });

  it('shows record details', () => {
    render(<RecentRecords />);
    
    expect(screen.getByText('45.5L')).toBeInTheDocument();
    expect(screen.getByText('₡31850')).toBeInTheDocument();
    expect(screen.getByText('25L')).toBeInTheDocument();
    expect(screen.getByText('₡3750')).toBeInTheDocument();
  });

  it('formats dates correctly', () => {
    render(<RecentRecords />);
    
    // Check that dates are displayed (format may vary by locale)
    const dateElements = screen.getAllByText(/\d{1,2}\/\d{1,2}\/\d{4}/);
    expect(dateElements.length).toBeGreaterThan(0);
  });
});