import React from 'react';
import { Form, Select } from 'antd';
import { COLUMN_CONFIG, STYLES } from '../constants';

interface UnitSelectProps {
  dataIndex: string;
  entity: any;
  materielUnitList: any[];
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

export const UnitSelect: React.FC<UnitSelectProps> = ({
  dataIndex,
  entity,
  materielUnitList,
  disabled,
  hasSalesUnit,
  getFormDataIndex,
  getFormItemValue,
  getFieldRule,
  onChange,
}) => {
  const isDisabled = [
    COLUMN_CONFIG.unitIdDataIndex,
    COLUMN_CONFIG.weightUnitIdDataIndex,
    COLUMN_CONFIG.dimensionUnitIdDataIndex,
    COLUMN_CONFIG.volumeUnitIdDataIndex,
  ].includes(dataIndex);

  return (
    <Form.Item
      validateTrigger="submit"
      name={getFormDataIndex(dataIndex, entity)}
      rules={getFieldRule(dataIndex, entity)}
    >
      <Select
        defaultValue={getFormItemValue(dataIndex, entity) ?? null}
        value={getFormItemValue(dataIndex, entity)}
        key={`${entity.rowType}-${dataIndex}`}
        options={materielUnitList}
        style={{ width: STYLES.SELECT_WIDTH }}
        placeholder="请选择"
        allowClear={true}
        disabled={disabled || !hasSalesUnit || isDisabled}
        fieldNames={{
          label: 'name',
          value: 'id',
        }}
        showSearch
        filterOption={(input, option) => {
          return (option?.name ?? '')
            .toLowerCase()
            .includes(input.toLowerCase());
        }}
        onChange={onChange(dataIndex, entity)}
      />
    </Form.Item>
  );
};
