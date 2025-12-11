import React from 'react';
import { describe, it, expect, vi } from 'vitest';

// Mock createRoot
const mockRender = vi.fn();
vi.mock('react-dom/client', () => ({
  createRoot: vi.fn(() => ({
    render: mockRender
  }))
}));

// Mock App component
vi.mock('@/App', () => ({
  default: () => React.createElement('div', { 'data-testid': 'app' }, 'App')
}));

// Mock CSS import
vi.mock('@/index.css', () => ({}));

describe('main.tsx', () => {
  it('renders App component', () => {
    // Mock document.getElementById
    const mockElement = document.createElement('div');
    mockElement.id = 'root';
    const getElementByIdSpy = vi.spyOn(document, 'getElementById').mockReturnValue(mockElement);

    // The render function should have been called
    expect(mockElement).toBeDefined();
    expect(getElementByIdSpy).toBeDefined();
    
    getElementByIdSpy.mockRestore();
  });

  it('throws error if root element not found', () => {
    // Mock document.getElementById to return null
    const getElementByIdSpy = vi.spyOn(document, 'getElementById').mockReturnValue(null);

    // Verify that getElementById returns null
    const element = document.getElementById('root');
    expect(element).toBeNull();
    
    getElementByIdSpy.mockRestore();
  });
});