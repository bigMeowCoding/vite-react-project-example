import React from 'react';
import { Form, InputNumber } from 'antd';

interface UnitInputNumberProps {
  dataIndex: string;
  entity: any;
  disabled?: boolean;
  hasSalesUnit: boolean;
  getFormDataIndex: (dataIndex: string, entity: any) => string;
  getFormItemValue: (dataIndex: string, entity: any) => any;
  getFieldRule: (dataIndex: string, entity: any) => any[];
  onChange: (
    dataIndex: string,
    unitItem: any
  ) => (value: string | number | null) => void;
}

export const UnitInputNumber: React.FC<UnitInputNumberProps> = ({
  dataIndex,
  entity,
  disabled,
  hasSalesUnit,
  getFormDataIndex,
  getFormItemValue,
  getFieldRule,
  onChange,
}) => {
  return (
    <Form.Item
      name={getFormDataIndex(dataIndex, entity)}
      validateTrigger="submit"
      rules={getFieldRule(dataIndex, entity)}
    >
      <InputNumber
        defaultValue={getFormItemValue(dataIndex, entity) as number | undefined}
        precision={2}
        min={0}
        key={
          dataIndex === 'volume'
            ? (getFormItemValue(dataIndex, entity) as string)
            : `${entity.rowType}-${dataIndex}`
        }
        placeholder="请输入"
        value={getFormItemValue(dataIndex, entity) as number | undefined}
        disabled={disabled || !hasSalesUnit || dataIndex === 'volume'}
        onChange={(value) => {
          const valueChange = onChange(dataIndex, entity);
          valueChange(value as number | null);
        }}
      />
    </Form.Item>
  );
};
