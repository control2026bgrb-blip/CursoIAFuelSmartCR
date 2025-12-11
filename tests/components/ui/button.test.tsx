import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Button } from '@/components/ui/button';

describe('Button', () => {
  it('renders button with children', () => {
    render(<Button>Click me</Button>);
    
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    const button = screen.getByText('Click me');
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('can be disabled', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick} disabled>Click me</Button>);
    
    const button = screen.getByText('Click me');
    expect(button).toBeDisabled();
    
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('applies variant classes', () => {
    render(<Button variant="destructive">Delete</Button>);
    
    const button = screen.getByText('Delete');
    expect(button).toHaveClass('bg-destructive');
  });

  it('applies size classes', () => {
    render(<Button size="sm">Small</Button>);
    
    const button = screen.getByText('Small');
    expect(button).toHaveClass('min-h-8');
  });

  it('applies custom className', () => {
    render(<Button className="custom-class">Custom</Button>);
    
    const button = screen.getByText('Custom');
    expect(button).toHaveClass('custom-class');
  });

  it('passes through additional props', () => {
    render(<Button data-testid="test-button" type="submit">Submit</Button>);
    
    const button = screen.getByTestId('test-button');
    expect(button).toHaveAttribute('type', 'submit');
  });
});