
import '@testing-library/jest-dom';
import { expect, vi, beforeAll } from 'vitest';

// Mock navigator.clipboard
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn().mockResolvedValue(undefined),
    readText: vi.fn().mockResolvedValue(''),
  },
});

// Mock crypto.randomUUID
Object.assign(global.crypto, {
  randomUUID: vi.fn().mockReturnValue('mocked-uuid-for-tests'),
});

// Set up vitest globals
beforeAll(() => {
  // Additional setup can go here
});
