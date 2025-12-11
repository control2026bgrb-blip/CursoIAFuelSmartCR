import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import NotFound from '@/pages/not-found';

describe('NotFound', () => {
  it('renders 404 page', () => {
    render(<NotFound />);
    
    expect(screen.getByText('404 Page Not Found')).toBeInTheDocument();
    expect(screen.getByText('Did you forget to add the page to the router?')).toBeInTheDocument();
  });

  it('displays alert icon', () => {
    render(<NotFound />);
    
    const alertIcon = document.querySelector('.text-red-500');
    expect(alertIcon).toBeInTheDocument();
  });

  it('has proper styling classes', () => {
    render(<NotFound />);
    
    const container = document.querySelector('.min-h-screen');
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass('w-full', 'flex', 'items-center', 'justify-center', 'bg-gray-50');
  });

  it('renders card component', () => {
    render(<NotFound />);
    
    const card = document.querySelector('.w-full.max-w-md');
    expect(card).toBeInTheDocument();
  });

  it('has proper text styling', () => {
    render(<NotFound />);
    
    const heading = screen.getByText('404 Page Not Found');
    expect(heading).toHaveClass('text-2xl', 'font-bold', 'text-gray-900');
    
    const description = screen.getByText('Did you forget to add the page to the router?');
    expect(description).toHaveClass('mt-4', 'text-sm', 'text-gray-600');
  });
});