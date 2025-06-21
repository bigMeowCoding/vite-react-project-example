import '@testing-library/jest-dom';

// Mock Ant Design components if needed
vi.mock('antd', async () => {
  const actual = await vi.importActual('antd');
  return {
    ...actual,
    // Add specific mocks if needed
  };
});

// Mock CSS modules
vi.mock('*.less', () => ({
  default: {},
}));

// Global test utilities
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
