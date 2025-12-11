import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useIsMobile } from '../../client/src/hooks/use-mobile';

// Mock window.matchMedia and window.innerWidth
const mockMatchMedia = vi.fn();

describe('useIsMobile', () => {
  beforeEach(() => {
    // Setup matchMedia mock
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: mockMatchMedia,
    });
    
    // Setup innerWidth mock
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('returns true for mobile screen size', () => {
    // Mock mobile screen size (less than 768px)
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 500,
    });
    
    mockMatchMedia.mockReturnValue({
      matches: true,
      media: '(max-width: 767px)',
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    });

    const { result } = renderHook(() => useIsMobile());
    
    expect(result.current).toBe(true);
  });

  it('returns false for desktop screen size', () => {
    // Mock desktop screen size (768px or larger)
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
    
    mockMatchMedia.mockReturnValue({
      matches: false,
      media: '(max-width: 767px)',
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    });

    const { result } = renderHook(() => useIsMobile());
    
    expect(result.current).toBe(false);
  });

  it('calls matchMedia with correct query', () => {
    mockMatchMedia.mockReturnValue({
      matches: false,
      media: '(max-width: 767px)',
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    });

    renderHook(() => useIsMobile());
    
    expect(mockMatchMedia).toHaveBeenCalledWith('(max-width: 767px)');
  });

  it('sets up event listener for media query changes', () => {
    const mockAddEventListener = vi.fn();
    const mockRemoveEventListener = vi.fn();
    
    mockMatchMedia.mockReturnValue({
      matches: false,
      media: '(max-width: 767px)',
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: mockAddEventListener,
      removeEventListener: mockRemoveEventListener,
      dispatchEvent: vi.fn(),
    });

    const { unmount } = renderHook(() => useIsMobile());
    
    expect(mockAddEventListener).toHaveBeenCalledWith('change', expect.any(Function));
    
    // Cleanup should remove event listener
    unmount();
    expect(mockRemoveEventListener).toHaveBeenCalledWith('change', expect.any(Function));
  });

  it('updates state when media query changes', () => {
    let changeHandler: (() => void) | null = null;
    const mockAddEventListener = vi.fn((event, handler) => {
      if (event === 'change') {
        changeHandler = handler;
      }
    });
    
    // Start with desktop size
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
    
    mockMatchMedia.mockReturnValue({
      matches: false,
      media: '(max-width: 767px)',
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: mockAddEventListener,
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    });

    const { result } = renderHook(() => useIsMobile());
    
    // Initially false (desktop)
    expect(result.current).toBe(false);
    
    // Change to mobile size
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 500,
    });
    
    // Simulate media query change
    if (changeHandler) {
      (changeHandler as () => void)();
    }
    
    // Should update to true (mobile)
    expect(result.current).toBe(true);
  });

  it('handles matchMedia not being available', () => {
    // Remove matchMedia from window
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: undefined,
    });

    // Should not throw error and return false as default
    const { result } = renderHook(() => useIsMobile());
    
    expect(result.current).toBe(false);
  });

  it('handles edge case screen sizes', () => {
    // Test exactly at breakpoint (768px)
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 768,
    });
    
    mockMatchMedia.mockReturnValue({
      matches: false, // 768px should be desktop (not mobile)
      media: '(max-width: 767px)',
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    });

    const { result } = renderHook(() => useIsMobile());
    
    expect(result.current).toBe(false);
  });
});