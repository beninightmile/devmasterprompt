
import '@testing-library/jest-dom/vitest';
import { expect, vi } from 'vitest';
import matchers from '@testing-library/jest-dom/matchers';

// Extend Vitest's expect with Jest-DOM matchers
expect.extend(matchers);

// Mock navigator.clipboard for tests
Object.defineProperty(global.navigator, 'clipboard', {
  value: {
    writeText: vi.fn().mockResolvedValue(undefined),
    readText: vi.fn().mockResolvedValue(''),
  },
  writable: true,
});

// Mock crypto.randomUUID for tests
Object.defineProperty(global.crypto, 'randomUUID', {
  value: vi.fn().mockReturnValue('mocked-uuid-for-tests' as `${string}-${string}-${string}-${string}-${string}`),
  writable: true,
});
