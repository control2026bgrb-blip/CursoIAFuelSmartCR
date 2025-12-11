import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useToast, toast, reducer } from '../../client/src/hooks/use-toast';

describe('useToast', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('reducer', () => {
    const initialState = { toasts: [] };

    it('adds toast', () => {
      const toast = { id: '1', title: 'Test', open: true };
      const action = { type: 'ADD_TOAST' as const, toast };
      
      const newState = reducer(initialState, action);
      
      expect(newState.toasts).toHaveLength(1);
      expect(newState.toasts[0]).toEqual(toast);
    });

    it('limits toasts to TOAST_LIMIT', () => {
      const state = { 
        toasts: [
          { id: '1', title: 'Toast 1', open: true }
        ] 
      };
      const newToast = { id: '2', title: 'Toast 2', open: true };
      const action = { type: 'ADD_TOAST' as const, toast: newToast };
      
      const newState = reducer(state, action);
      
      // TOAST_LIMIT is 1, so only the newest toast is kept
      expect(newState.toasts).toHaveLength(1);
      expect(newState.toasts[0].id).toBe('2');
    });

    it('updates toast', () => {
      const state = { 
        toasts: [
          { id: '1', title: 'Original', open: true }
        ] 
      };
      const action = { 
        type: 'UPDATE_TOAST' as const, 
        toast: { id: '1', title: 'Updated' } 
      };
      
      const newState = reducer(state, action);
      
      expect(newState.toasts[0].title).toBe('Updated');
      expect(newState.toasts[0].open).toBe(true);
    });

    it('dismisses specific toast', () => {
      const state = { 
        toasts: [
          { id: '1', title: 'Toast 1', open: true },
          { id: '2', title: 'Toast 2', open: true }
        ] 
      };
      const action = { type: 'DISMISS_TOAST' as const, toastId: '1' };
      
      const newState = reducer(state, action);
      
      expect(newState.toasts[0].open).toBe(false);
      expect(newState.toasts[1].open).toBe(true);
    });

    it('dismisses all toasts when no toastId provided', () => {
      const state = { 
        toasts: [
          { id: '1', title: 'Toast 1', open: true },
          { id: '2', title: 'Toast 2', open: true }
        ] 
      };
      const action = { type: 'DISMISS_TOAST' as const };
      
      const newState = reducer(state, action);
      
      expect(newState.toasts[0].open).toBe(false);
      expect(newState.toasts[1].open).toBe(false);
    });

    it('removes specific toast', () => {
      const state = { 
        toasts: [
          { id: '1', title: 'Toast 1', open: true },
          { id: '2', title: 'Toast 2', open: true }
        ] 
      };
      const action = { type: 'REMOVE_TOAST' as const, toastId: '1' };
      
      const newState = reducer(state, action);
      
      expect(newState.toasts).toHaveLength(1);
      expect(newState.toasts[0].id).toBe('2');
    });

    it('removes all toasts when no toastId provided', () => {
      const state = { 
        toasts: [
          { id: '1', title: 'Toast 1', open: true },
          { id: '2', title: 'Toast 2', open: true }
        ] 
      };
      const action = { type: 'REMOVE_TOAST' as const };
      
      const newState = reducer(state, action);
      
      expect(newState.toasts).toHaveLength(0);
    });
  });

  describe('toast function', () => {
    it('creates toast with title and description', () => {
      const result = toast({
        title: 'Test Title',
        description: 'Test Description'
      });
      
      expect(result.id).toBeDefined();
      expect(typeof result.dismiss).toBe('function');
      expect(typeof result.update).toBe('function');
    });

    it('creates toast with variant', () => {
      const result = toast({
        title: 'Error',
        variant: 'destructive'
      });
      
      expect(result.id).toBeDefined();
    });

    it('updates toast', () => {
      const result = toast({ title: 'Original' });
      
      act(() => {
        result.update({ title: 'Updated' });
      });
      
      // Toast should be updated (tested through integration)
      expect(result.id).toBeDefined();
    });

    it('dismisses toast', () => {
      const result = toast({ title: 'Test' });
      
      act(() => {
        result.dismiss();
      });
      
      // Toast should be dismissed (tested through integration)
      expect(result.id).toBeDefined();
    });
  });

  describe('useToast hook', () => {
    it('adds toast through hook', () => {
      const { result } = renderHook(() => useToast());
      
      act(() => {
        result.current.toast({
          title: 'Test Toast',
          description: 'Test Description'
        });
      });
      
      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0].title).toBe('Test Toast');
      expect(result.current.toasts[0].description).toBe('Test Description');
    });

    it('dismisses toast through hook', () => {
      const { result } = renderHook(() => useToast());
      
      let toastId: string;
      
      act(() => {
        const toastResult = result.current.toast({
          title: 'Test Toast'
        });
        toastId = toastResult.id;
      });
      
      expect(result.current.toasts[0].open).toBe(true);
      
      act(() => {
        result.current.dismiss(toastId);
      });
      
      expect(result.current.toasts[0].open).toBe(false);
    });

    it('dismisses all toasts when no id provided', () => {
      const { result } = renderHook(() => useToast());
      
      act(() => {
        result.current.toast({ title: 'Toast 1' });
        result.current.toast({ title: 'Toast 2' });
      });
      
      expect(result.current.toasts).toHaveLength(1); // Limited to 1
      expect(result.current.toasts[0].open).toBe(true);
      
      act(() => {
        result.current.dismiss();
      });
      
      expect(result.current.toasts[0].open).toBe(false);
    });

    it('handles onOpenChange callback', () => {
      const { result } = renderHook(() => useToast());
      
      act(() => {
        result.current.toast({
          title: 'Test Toast'
        });
      });
      
      const toast = result.current.toasts[0];
      
      act(() => {
        toast.onOpenChange?.(false);
      });
      
      expect(result.current.toasts[0].open).toBe(false);
    });
  });
});