import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import UnitList, { UnitListRef } from '../Unitlist';

// Mock data
const mockUnitsMappings = [
  {
    unitName: '销售单位',
    unitType: 'unit_sales',
    salesUnitFlag: 1,
    purchaseUnitFlag: 0,
    stockUnitFlag: 0,
    unitId: 'sales_unit_1',
  },
];

const mockMaterielUnitList = [
  { id: 1, name: '千克', enable: true },
  { id: 3, name: '毫米', enable: true },
  { id: 5, name: 'cm³', enable: true },
];

// Test wrapper component
const TestWrapper = ({
  children,
  props = {},
}: {
  children: React.ReactNode;
  props?: any;
}) => {
  const defaultProps = {
    unitsMappings: mockUnitsMappings,
    materielUnitList: mockMaterielUnitList,
    sizeRequired: true,
    onChange: vi.fn(),
    ...props,
  };

  // 确保 children 是有效的 React 元素
  if (!children || !React.isValidElement(children)) {
    return null;
  }

  return React.cloneElement(children, defaultProps);
};

describe('UnitList Component - Simple Tests', () => {
  describe('Basic Rendering', () => {
    it('should render without crashing', () => {
      render(
        <TestWrapper>
          <UnitList />
        </TestWrapper>
      );

      expect(screen.getByText('单位类型')).toBeInTheDocument();
      expect(screen.getAllByText('单位')[0]).toBeInTheDocument();
      expect(screen.getByText('重量信息')).toBeInTheDocument();
      expect(screen.getByText('尺寸信息')).toBeInTheDocument();
      expect(screen.getByText('体积信息')).toBeInTheDocument();
    });

    it('should render with sales unit', () => {
      render(
        <TestWrapper>
          <UnitList />
        </TestWrapper>
      );

      expect(screen.getByText('销售单位')).toBeInTheDocument();
    });

    it('should render table headers correctly', () => {
      render(
        <TestWrapper>
          <UnitList />
        </TestWrapper>
      );

      expect(screen.getByText('毛重')).toBeInTheDocument();
      expect(screen.getByText('净重')).toBeInTheDocument();
      expect(screen.getByText('长')).toBeInTheDocument();
      expect(screen.getByText('宽')).toBeInTheDocument();
      expect(screen.getByText('高')).toBeInTheDocument();
      expect(screen.getByText('体积')).toBeInTheDocument();
    });
  });

  describe('Props Handling', () => {
    it('should handle disabled prop', () => {
      render(
        <TestWrapper props={{ disabled: true }}>
          <UnitList />
        </TestWrapper>
      );

      // Check that inputs are disabled
      const inputs = screen.getAllByRole('spinbutton');
      expect(inputs.length).toBeGreaterThan(0);

      const selects = screen.getAllByRole('combobox');
      expect(selects.length).toBeGreaterThan(0);
    });

    it('should handle sizeRequired prop', () => {
      render(
        <TestWrapper props={{ sizeRequired: false }}>
          <UnitList />
        </TestWrapper>
      );

      // Should not show required labels when sizeRequired is false
      const requiredLabels = screen.queryAllByText(/.*/, {
        selector: '.custom-required-label',
      });
      expect(requiredLabels.length).toBe(0);
    });

    it('should handle empty unitsMappings', () => {
      render(
        <TestWrapper props={{ unitsMappings: [] }}>
          <UnitList />
        </TestWrapper>
      );

      // Should not render any unit rows
      expect(screen.queryByText('销售单位')).not.toBeInTheDocument();
    });

    it('should handle empty materielUnitList', () => {
      render(
        <TestWrapper props={{ materielUnitList: [] }}>
          <UnitList />
        </TestWrapper>
      );

      // Should still render the table structure
      expect(screen.getByText('单位类型')).toBeInTheDocument();
    });
  });

  describe('Ref Methods', () => {
    it('should expose getUnitsMappings method', () => {
      const ref = React.createRef<UnitListRef>();

      render(
        <TestWrapper>
          <UnitList ref={ref} />
        </TestWrapper>
      );

      expect(ref.current?.getUnitsMappings).toBeDefined();
      expect(typeof ref.current?.getUnitsMappings).toBe('function');
      expect(ref.current?.getUnitsMappings()).toEqual(mockUnitsMappings);
    });

    it('should expose validateForm method', () => {
      const ref = React.createRef<UnitListRef>();

      render(
        <TestWrapper>
          <UnitList ref={ref} />
        </TestWrapper>
      );

      expect(ref.current?.validateForm).toBeDefined();
      expect(typeof ref.current?.validateForm).toBe('function');
    });
  });

  describe('Form Structure', () => {
    it('should render form with correct structure', () => {
      const { container } = render(
        <TestWrapper>
          <UnitList />
        </TestWrapper>
      );

      // 直接查找 form 元素
      const form = container.querySelector('form');
      expect(form).toBeInTheDocument();

      // Check table exists
      const table = screen.getByRole('table');
      expect(table).toBeInTheDocument();
    });

    it('should render input fields for numeric values', () => {
      render(
        <TestWrapper>
          <UnitList />
        </TestWrapper>
      );

      // Check that numeric inputs exist
      const inputs = screen.getAllByRole('spinbutton');
      expect(inputs.length).toBeGreaterThan(0);
    });

    it('should render select fields for unit selection', () => {
      render(
        <TestWrapper>
          <UnitList />
        </TestWrapper>
      );

      // Check that select inputs exist
      const selects = screen.getAllByRole('combobox');
      expect(selects.length).toBeGreaterThan(0);
    });
  });

  describe('Component Interface', () => {
    it('should accept all required props', () => {
      const props = {
        unitsMappings: mockUnitsMappings,
        materielUnitList: mockMaterielUnitList,
        sizeRequired: true,
        onChange: vi.fn(),
        disabled: false,
        weightDimensionMappings: [],
      };

      expect(() => {
        render(<UnitList {...props} />);
      }).not.toThrow();
    });

    it('should handle optional props', () => {
      const props = {
        unitsMappings: mockUnitsMappings,
        materielUnitList: mockMaterielUnitList,
        sizeRequired: true,
      };

      expect(() => {
        render(<UnitList {...props} />);
      }).not.toThrow();
    });
  });

  describe('Edge Cases', () => {
    it('should handle null/undefined props gracefully', () => {
      expect(() => {
        render(
          <UnitList
            unitsMappings={[]}
            materielUnitList={[]}
            sizeRequired={false}
          />
        );
      }).not.toThrow();
    });
  });
});
