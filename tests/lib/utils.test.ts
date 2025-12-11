import { describe, it, expect } from 'vitest';
import { cn } from '@/lib/utils';

describe('utils', () => {
  describe('cn function', () => {
    it('combines class names', () => {
      const result = cn('class1', 'class2');
      expect(result).toBe('class1 class2');
    });

    it('handles conditional classes', () => {
      const result = cn('base', true && 'conditional', false && 'hidden');
      expect(result).toBe('base conditional');
    });

    it('merges tailwind classes correctly', () => {
      const result = cn('px-2 py-1', 'px-4');
      expect(result).toBe('py-1 px-4');
    });

    it('handles undefined and null values', () => {
      const result = cn('base', undefined, null, 'end');
      expect(result).toBe('base end');
    });

    it('handles empty strings', () => {
      const result = cn('base', '', 'end');
      expect(result).toBe('base end');
    });

    it('handles arrays of classes', () => {
      const result = cn(['class1', 'class2'], 'class3');
      expect(result).toBe('class1 class2 class3');
    });

    it('handles objects with boolean values', () => {
      const result = cn({
        'class1': true,
        'class2': false,
        'class3': true
      });
      expect(result).toBe('class1 class3');
    });

    it('handles complex combinations', () => {
      const result = cn(
        'base',
        ['array1', 'array2'],
        {
          'conditional1': true,
          'conditional2': false
        },
        'end'
      );
      expect(result).toBe('base array1 array2 conditional1 end');
    });

    it('returns empty string for no arguments', () => {
      const result = cn();
      expect(result).toBe('');
    });

    it('handles duplicate classes', () => {
      const result = cn('class1', 'class1', 'class2');
      // clsx and twMerge will keep duplicates in different positions
      expect(result).toContain('class1');
      expect(result).toContain('class2');
    });
  });
});