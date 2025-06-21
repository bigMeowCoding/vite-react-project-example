import { IFormData, IWeightDimensionItem, RowType, UnitType } from './types';
import {
  NUMBER_FIELDS,
  DIMENSION_FIELDS,
  VOLUME_CALCULATION,
} from './constants';

// 获取表单数据索引
export const getFormDataIndex = (dataIndex: string, entity: any): string => {
  const rowType = entity.rowType;
  return `${rowType}-${dataIndex}`;
};

// 检查值是否为空
export const isValueEmpty = (
  value: string | number | null | undefined
): boolean => {
  return value == null || value === '';
};

// 检查值是否无效（小于等于0）
export const isValueInvalid = (
  value: number | null | undefined | string
): boolean => {
  return value == null || value === '' || Number(value) <= 0;
};

// 计算体积
export const calculateVolume = (
  length: number,
  width: number,
  height: number
): string => {
  const volume = length * width * height;
  return Number(volume / VOLUME_CALCULATION.DIVISOR).toFixed(
    VOLUME_CALCULATION.PRECISION
  );
};

// 转换表单数据为重量尺寸映射
export const convertFormDataToMappings = (
  formData: IFormData
): IWeightDimensionItem[] => {
  const result: IWeightDimensionItem[] = [];

  // 处理销售单位数据
  if (formData['sales_unit_row-unitId']) {
    result.push({
      rowType: RowType.sales_unit_row,
      unitType: UnitType.unit_weight,
      rowTypeUnitId: formData['sales_unit_row-unitId'],
      grossWeight: formData['sales_unit_row-grossWeight'],
      netWeight: formData['sales_unit_row-netWeight'],
      unitId: formData['sales_unit_row-weight_unitId'],
    });
    result.push({
      rowType: RowType.sales_unit_row,
      unitType: UnitType.unit_volume,
      rowTypeUnitId: formData['sales_unit_row-unitId'],
      volume: formData['sales_unit_row-volume'],
      unitId: formData['sales_unit_row-volume_unitId'],
    });
    result.push({
      rowType: RowType.sales_unit_row,
      unitType: UnitType.unit_dimension,
      rowTypeUnitId: formData['sales_unit_row-unitId'],
      length: formData['sales_unit_row-length'],
      width: formData['sales_unit_row-width'],
      height: formData['sales_unit_row-height'],
      unitId: formData['sales_unit_row-dimension_unitId'],
    });
  }

  // 处理最小包装单位数据
  if (formData['min_package_row-unitId']) {
    result.push({
      rowType: RowType.min_package_row,
      unitType: UnitType.unit_weight,
      rowTypeUnitId: formData['min_package_row-unitId'],
      grossWeight: formData['min_package_row-grossWeight'],
      netWeight: formData['min_package_row-netWeight'],
      unitId: formData['min_package_row-weight_unitId'],
    });
    result.push({
      rowType: RowType.min_package_row,
      unitType: UnitType.unit_volume,
      rowTypeUnitId: formData['min_package_row-unitId'],
      volume: formData['min_package_row-volume'],
      unitId: formData['min_package_row-volume_unitId'],
    });
    result.push({
      rowType: RowType.min_package_row,
      unitType: UnitType.unit_dimension,
      rowTypeUnitId: formData['min_package_row-unitId'],
      length: formData['min_package_row-length'],
      width: formData['min_package_row-width'],
      height: formData['min_package_row-height'],
      unitId: formData['min_package_row-dimension_unitId'],
    });
  }

  return result;
};

// 检查是否为数字字段
export const isNumberField = (dataIndex: string): boolean => {
  return NUMBER_FIELDS.includes(dataIndex as any);
};

// 检查是否为尺寸字段
export const isDimensionField = (dataIndex: string): boolean => {
  return DIMENSION_FIELDS.includes(dataIndex as any);
};

// 获取表单字段值
export const getFormItemValue = (
  dataIndex: string,
  entity: any,
  formData: IFormData | null
): any => {
  const index = getFormDataIndex(dataIndex, entity);
  const value = formData?.[index];

  // 如果是数字类型的字段，确保返回 number 或 undefined
  if (isNumberField(dataIndex)) {
    return value === null ? undefined : value;
  }
  return value;
};
