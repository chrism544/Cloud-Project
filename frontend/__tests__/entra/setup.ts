import '@testing-library/jest-dom';
import { server } from '@/mocks/browser';

// Establish API mocking before all tests
beforeAll(() => {
  // Start MSW server for tests
  if (typeof window !== 'undefined') {
    server.listen({ onUnhandledRequest: 'error' });
  }
});

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests
afterEach(() => {
  if (typeof window !== 'undefined') {
    server.resetHandlers();
  }
});

// Clean up after the tests are finished
afterAll(() => {
  if (typeof window !== 'undefined') {
    server.close();
  }
});

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      pathname: '/entra-admin',
      query: {},
      asPath: '/entra-admin',
    };
  },
  usePathname() {
    return '/entra-admin';
  },
  useSearchParams() {
    return new URLSearchParams();
  },
}));
