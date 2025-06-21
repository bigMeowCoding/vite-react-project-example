// 列配置常量
export const COLUMN_CONFIG = {
  maozhongDataIndex: 'grossWeight',
  netWightDataIndex: 'netWeight',
  lengthDataIndex: 'length',
  widthDataIndex: 'width',
  heightDataIndex: 'height',
  volumeDataIndex: 'volume',
  unitIdDataIndex: 'unitId',
  weightUnitIdDataIndex: 'weight_unitId',
  dimensionUnitIdDataIndex: 'dimension_unitId',
  volumeUnitIdDataIndex: 'volume_unitId',
} as const;

// 默认单位名称
export const DEFAULT_UNIT_NAMES = {
  WEIGHT: '千克',
  DIMENSION: '毫米',
  VOLUME: 'cm³',
} as const;

// 单位类型常量
export const UNIT_TYPES = {
  MINI_PACK: 'unit_mini_pack',
} as const;

// 数字字段列表
export const NUMBER_FIELDS = [
  'grossWeight',
  'netWeight',
  'length',
  'width',
  'height',
  'volume',
] as const;

// 尺寸字段列表
export const DIMENSION_FIELDS = ['length', 'width', 'height'] as const;

// 体积计算常量
export const VOLUME_CALCULATION = {
  DIVISOR: 1000,
  PRECISION: 2,
} as const;

// 表单验证常量
export const VALIDATION = {
  DEFAULT_MESSAGE: ' ',
  MIN_VALUE: 0,
} as const;

// 样式常量
export const STYLES = {
  SELECT_WIDTH: '120px',
} as const;
