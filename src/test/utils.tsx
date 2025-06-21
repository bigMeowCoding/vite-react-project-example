import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { vi } from 'vitest';

// Custom render function with providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Mock data generators
export const createMockUnitsMappings = (overrides = {}) => [
  {
    unitName: '销售单位',
    unitType: 'unit_sales',
    salesUnitFlag: 1,
    purchaseUnitFlag: 0,
    stockUnitFlag: 0,
    unitId: 'sales_unit_1',
    ...overrides,
  },
];

export const createMockMaterielUnitList = (overrides = {}) => [
  { id: 1, name: '千克', enable: true, ...overrides },
  { id: 2, name: '克', enable: true, ...overrides },
  { id: 3, name: '毫米', enable: true, ...overrides },
  { id: 4, name: '厘米', enable: true, ...overrides },
  { id: 5, name: 'cm³', enable: true, ...overrides },
  { id: 6, name: 'm³', enable: true, ...overrides },
];

export const createMockWeightDimensionMappings = (overrides = {}) => [
  {
    rowType: 'sales_unit_row',
    unitType: 'unit_weight',
    rowTypeUnitId: 'sales_unit_1',
    grossWeight: 10.5,
    netWeight: 8.2,
    unitId: 1,
    unitName: '销售单位',
    unitType: 'unit_sales',
    salesUnitFlag: 1,
    purchaseUnitFlag: 0,
    stockUnitFlag: 0,
    ...overrides,
  },
];

// Test helpers
export const waitForAsync = (ms = 0) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const mockConsoleError = () => {
  const originalError = console.error;
  const mockError = vi.fn();
  console.error = mockError;
  return {
    mockError,
    restore: () => {
      console.error = originalError;
    },
  };
};

export const mockConsoleWarn = () => {
  const originalWarn = console.warn;
  const mockWarn = vi.fn();
  console.warn = mockWarn;
  return {
    mockWarn,
    restore: () => {
      console.warn = originalWarn;
    },
  };
};

// Re-export everything
export * from '@testing-library/react';
export { customRender as render };
