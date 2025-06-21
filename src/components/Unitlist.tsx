import React, { useMemo, forwardRef, useImperativeHandle } from 'react';
import { Table, Form } from 'antd';
import './UnitList.less';

// 导入类型定义
import {
  UnitListProps,
  UnitListRef,
  IWeightDimensionItem,
  DefaultUnits,
} from './UnitList/types';

// 导入常量
import { DEFAULT_UNIT_NAMES } from './UnitList/constants';

// 导入工具函数
import { getFormDataIndex, getFormItemValue } from './UnitList/utils';

// 导入验证工厂
import { ValidationFactory } from './UnitList/validation';

// 导入自定义 Hook
import { useUnitListForm } from './UnitList/hooks/useUnitListForm';

// 导入表格列配置
import { createTableColumns } from './UnitList/tableColumns';

const UnitList = forwardRef<UnitListRef, UnitListProps>((props, ref) => {
  // 处理 props
  const unitsMappings = useMemo(() => {
    return Array.isArray(props.unitsMappings) ? props.unitsMappings : [];
  }, [props.unitsMappings]);

  const materielUnitList = useMemo(() => {
    return Array.isArray(props.materielUnitList) ? props.materielUnitList : [];
  }, [props.materielUnitList]);

  const sizeRequired = !!props.sizeRequired;

  // 获取默认单位
  const getDefaultUnits = useMemo((): DefaultUnits => {
    return {
      weight: materielUnitList.find(
        (item) => item.name === DEFAULT_UNIT_NAMES.WEIGHT
      ),
      dimension: materielUnitList.find(
        (item) => item.name === DEFAULT_UNIT_NAMES.DIMENSION
      ),
      volume: materielUnitList.find(
        (item) => item.name === DEFAULT_UNIT_NAMES.VOLUME
      ),
    };
  }, [materielUnitList]);

  // 检查是否有销售单位
  const hasSalesUnit = useMemo(() => {
    return unitsMappings.some((item) => item.salesUnitFlag == 1);
  }, [unitsMappings]);

  // 使用自定义 Hook 管理表单状态
  const { form, formData, showError, handleFieldChange, validateForm } =
    useUnitListForm({
      unitsMappings,
      weightDimensionMappings: props.weightDimensionMappings,
      defaultUnits: getDefaultUnits,
      onChange: props.onChange,
    });

  // 生成数据源
  const dataSource = useMemo<IWeightDimensionItem[]>(() => {
    if (!formData) {
      return [];
    }

    let salesData: Partial<IWeightDimensionItem> = null;
    let miniPackData: Partial<IWeightDimensionItem> = null;

    // 提取销售单位数据
    if (formData['sales_unit_row-unitId']) {
      salesData = { rowType: 'sales_unit_row' } as IWeightDimensionItem;
      Object.keys(formData).forEach((key) => {
        if (key.startsWith('sales_unit_row-')) {
          const field = key.split('-')[1];
          salesData[field] = formData[key];
        }
      });
    }

    // 提取最小包装单位数据
    if (formData['min_package_row-unitId']) {
      miniPackData = { rowType: 'min_package_row' } as IWeightDimensionItem;
      Object.keys(formData).forEach((key) => {
        if (key.startsWith('min_package_row-')) {
          const field = key.split('-')[1];
          miniPackData[field] = formData[key];
        }
      });
    }

    return [
      ...(salesData ? [salesData as IWeightDimensionItem] : []),
      ...(miniPackData ? [miniPackData as IWeightDimensionItem] : []),
    ];
  }, [formData]);

  // 获取字段验证规则
  const getFieldRule = (dataIndex: string, entity: any) => {
    return ValidationFactory.getValidationRules(
      dataIndex,
      entity,
      formData,
      sizeRequired
    );
  };

  // 获取表单字段值
  const getFormItemValueWithData = (dataIndex: string, entity: any) => {
    return getFormItemValue(dataIndex, entity, formData);
  };

  // 暴露给父组件的方法
  useImperativeHandle(ref, () => ({
    getUnitsMappings: () => unitsMappings,
    validateForm,
  }));

  // 创建表格列配置
  const columns = createTableColumns({
    materielUnitList,
    disabled: props.disabled,
    hasSalesUnit,
    sizeRequired,
    formData,
    getFormDataIndex,
    getFormItemValue: getFormItemValueWithData,
    getFieldRule,
    onChange: handleFieldChange,
  });

  return (
    <Form form={form}>
      <Table
        className="custom-unit-list-table"
        scroll={{ x: 'max-content' }}
        pagination={false}
        columns={columns}
        dataSource={dataSource}
        bordered
        size="middle"
      />
      {showError && (
        <div style={{ color: 'red' }}>
          尺寸列为必填数据，请输入大于0的尺寸值！
        </div>
      )}
    </Form>
  );
});

UnitList.displayName = 'UnitList';
export default UnitList;
