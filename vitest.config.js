// Vitest configuration
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.js'],
    include: ['tests/**/*.{test,spec}.{js,ts,tsx}'],
    exclude: ['node_modules', 'dist', '.git'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'json-summary', 'html', 'lcov'],
      reportsDirectory: './coverage',
      exclude: [
        'node_modules/',
        'tests/',
        'dist/',
        '**/*.config.js',
        '**/*.config.ts',
        '**/*.d.ts',
        'coverage/',
        '.github/',
        'vite.config.ts',
        'postcss.config.js'
      ],
      include: [
        'client/src/**/*.{js,ts,tsx}',
        'server/**/*.{js,ts}',
        'shared/**/*.{js,ts}'
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './client/src'),
      '~': path.resolve(__dirname, './')
    }
  }
});