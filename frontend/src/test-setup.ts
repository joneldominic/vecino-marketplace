import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Create a type that is more specific than 'any'
type JestDomMatchers = Record<
  string,
  (...args: unknown[]) => { pass: boolean; message: () => string }
>;

// Add necessary type definition for jest-dom
declare module 'vitest' {
  interface Assertion<T = any> {
    toBeInTheDocument(): T;
    toBeVisible(): T;
    toHaveTextContent(text: string): T;
    toHaveAttribute(attr: string, value?: string): T;
    toBeDisabled(): T;
    toBeEnabled(): T;
    toHaveClass(className: string): T;
    toHaveFocus(): T;
  }
}

// Extend Vitest's expect with Testing Library matchers
expect.extend(matchers as JestDomMatchers);

// Automatically clean up after each test
afterEach(() => {
  cleanup();
});

// Mock localStorage for tests
class LocalStorageMock {
  private store: Record<string, string> = {};

  clear() {
    this.store = {};
  }

  getItem(key: string) {
    return this.store[key] || null;
  }

  setItem(key: string, value: string) {
    this.store[key] = String(value);
  }

  removeItem(key: string) {
    delete this.store[key];
  }
}

global.localStorage = new LocalStorageMock() as unknown as Storage;

// Mock global fetch if needed
global.fetch = vi.fn();
