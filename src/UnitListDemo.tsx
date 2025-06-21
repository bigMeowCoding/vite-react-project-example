import React, { useRef } from 'react';
import { Button, Form, Space } from 'antd';
import UnitList from './components/Unitlist';

// 模拟物料单位数据
const mockMaterielUnitList = [
  { id: 1, name: '千克' },
  { id: 2, name: '克' },
  { id: 3, name: '毫米' },
  { id: 4, name: '厘米' },
  { id: 5, name: 'cm³' },
  { id: 6, name: 'm³' },
  { id: 7, name: '箱' },
  { id: 8, name: '件' },
];

// 模拟单位映射数据
const mockUnitsMappings = [
  {
    unitName: '箱',
    unitType: 'sales_unit',
    salesUnitFlag: 1,
    purchaseUnitFlag: 0,
    stockUnitFlag: 0,
    unitId: 7,
  },
  {
    unitName: '件',
    unitType: 'unit_mini_pack',
    salesUnitFlag: 0,
    purchaseUnitFlag: 1,
    stockUnitFlag: 1,
    unitId: 8,
  },
];

// 模拟重量、体积、尺寸信息
const mockWeightDimensionMappings = [
  {
    rowType: 'sales_unit_row',
    unitType: 'unit_weight',
    rowTypeUnitId: 'sales_unit_1',
    grossWeight: 10.5,
    netWeight: 8.2,
    unitId: 1,
  },
  {
    rowType: 'sales_unit_row',
    unitType: 'unit_dimension',
    rowTypeUnitId: 'sales_unit_1',
    length: 100,
    width: 50,
    height: 30,
    unitId: 4,
  },
  {
    rowType: 'sales_unit_row',
    unitType: 'unit_volume',
    rowTypeUnitId: 'sales_unit_1',
    volume: 150,
    unitId: 5,
  },
  {
    rowType: 'min_package_row',
    unitType: 'unit_weight',
    rowTypeUnitId: 'mini_pack_1',
    grossWeight: 5.2,
    netWeight: 4.1,
    unitId: 1,
  },
];

const ParentComponent = () => {
  const unitListRef = useRef(null);
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    try {
      // 验证主表单
      await form.validateFields();

      // 验证UnitList组件表单
      const { success, data } = await unitListRef.current.validateForm();

      if (success) {
        console.log('表单验证成功');
        console.log('单位数据:', data);
        console.log('单位数据:', unitListRef.current.getUnitsMappings());
        console.log('单位数据:', form.getFieldValue('unitList'));

        // 这里可以处理提交逻辑
        alert('提交成功');
      } else {
        console.error('UnitList表单验证失败');
      }
    } catch (error) {
      console.error('表单验证失败', error);
    }
  };

  const handleUnitChange = (data) => {
    console.log('单位数据变化:', data);
  };

  return (
    <Form form={form} layout="vertical">
      <h3>产品单位信息</h3>
      <Form.Item name="unitList" label="单位信息">
        <UnitList
          ref={unitListRef}
          disabled={false}
          unitsMappings={mockUnitsMappings}
          materielUnitList={mockMaterielUnitList}
          weightDimensionMappings={mockWeightDimensionMappings}
          sizeRequired={true}
          onChange={handleUnitChange}
        />
      </Form.Item>

      <Space style={{ marginTop: 16 }}>
        <Button type="primary" onClick={handleSubmit}>
          提交
        </Button>
        <Button>重置</Button>
      </Space>
    </Form>
  );
};

export default ParentComponent;
