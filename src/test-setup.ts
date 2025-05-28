
import '@testing-library/jest-dom';

// Mock crypto.randomUUID globally
Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: () => 'mocked-uuid-for-tests' as `${string}-${string}-${string}-${string}-${string}`,
  },
});

// Mock clipboard API
Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: vi.fn(() => Promise.resolve()),
  },
});
