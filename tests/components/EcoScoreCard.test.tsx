import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { EcoScoreCard } from '@/components/EcoScoreCard';

describe('EcoScoreCard', () => {
  it('renders eco score card', () => {
    render(<EcoScoreCard />);
    
    const card = screen.getByTestId('eco-score-card');
    expect(card).toBeInTheDocument();
    // Check for the title within the card
    expect(screen.getByText('Eco Score')).toBeInTheDocument();
  });

  it('displays score value', () => {
    render(<EcoScoreCard />);
    
    // The score is displayed as the mock value (78)
    expect(screen.getByText('78')).toBeInTheDocument();
  });

  it('shows eco score title', () => {
    render(<EcoScoreCard />);
    
    // The component displays the mock data, check for key elements
    expect(screen.getByText('Eco Score')).toBeInTheDocument();
  });
});