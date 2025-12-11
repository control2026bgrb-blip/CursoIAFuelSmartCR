import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ThemeToggle } from '../../client/src/components/ThemeToggle';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

describe('ThemeToggle', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.documentElement.classList.remove('dark');
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders theme toggle button', () => {
    render(<ThemeToggle />);
    
    const button = screen.getByTestId('button-theme-toggle');
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-label', 'Toggle theme');
  });

  it('shows moon icon in light mode', () => {
    localStorageMock.getItem.mockReturnValue('light');
    render(<ThemeToggle />);
    
    // Moon icon should be visible in light mode
    const button = screen.getByTestId('button-theme-toggle');
    expect(button.querySelector('svg')).toBeInTheDocument();
  });

  it('loads theme from localStorage', () => {
    localStorageMock.getItem.mockReturnValue('dark');
    render(<ThemeToggle />);
    
    expect(localStorageMock.getItem).toHaveBeenCalledWith('theme');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('uses system preference when no stored theme', () => {
    localStorageMock.getItem.mockReturnValue(null);
    window.matchMedia = vi.fn().mockImplementation(query => ({
      matches: query === '(prefers-color-scheme: dark)',
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    render(<ThemeToggle />);
    
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('toggles theme when clicked', () => {
    localStorageMock.getItem.mockReturnValue('light');
    render(<ThemeToggle />);
    
    const button = screen.getByTestId('button-theme-toggle');
    fireEvent.click(button);
    
    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('toggles from dark to light', () => {
    localStorageMock.getItem.mockReturnValue('dark');
    render(<ThemeToggle />);
    
    const button = screen.getByTestId('button-theme-toggle');
    fireEvent.click(button);
    
    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('defaults to light theme when no preference', () => {
    localStorageMock.getItem.mockReturnValue(null);
    window.matchMedia = vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    render(<ThemeToggle />);
    
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });
});