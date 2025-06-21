// 单位映射项接口
export interface IUnitMapItem {
  unitName: string;
  unitType: string;
  salesUnitFlag: number;
  purchaseUnitFlag: number;
  stockUnitFlag: number;
  unitId: string;
}

// 单位类型枚举
export enum UnitType {
  unit_weight = 'unit_weight',
  unit_volume = 'unit_volume',
  unit_dimension = 'unit_dimension',
}

// 行类型枚举
export enum RowType {
  min_package_row = 'min_package_row',
  sales_unit_row = 'sales_unit_row',
}

// 重量单位扩展属性
export interface WithWeight {
  grossWeight?: number | null;
  netWeight?: number | null;
}

// 体积单位扩展属性
export interface WithVolume {
  volume?: number | null;
}

// 尺寸单位扩展属性
export interface WithDimensions {
  length: number | null;
  width: number | null;
  height: number | null;
}

// 基础接口
export interface IWeightDimensionItemBase {
  [key: string]: any;
  rowTypeUnitId: string | null; // 同步unitId
  rowType: RowType; //   "min_package_row", 用料单位 "sales_unit_row",  // 销售单位
  unitType: UnitType;
  unitId: number | null;
}

// 组合接口（使用交叉类型）
export type IWeightDimensionItem =
  | (IWeightDimensionItemBase & {
      unitType: UnitType.unit_weight;
    } & WithWeight)
  | (IWeightDimensionItemBase & {
      unitType: UnitType.unit_volume;
    } & WithVolume)
  | (IWeightDimensionItemBase & {
      unitType: UnitType.unit_dimension;
    } & WithDimensions);

// 表单数据类型
export interface IFormData {
  [key: string]: number | string | null | undefined;
  'min_package_row-grossWeight': number | null;
  'min_package_row-netWeight': number | null;
  'min_package_row-length': number | null;
  'min_package_row-width': number | null;
  'min_package_row-height': number | null;
  'min_package_row-volume': number | null;
  'min_package_row-weight_unitId': number | null;
  'min_package_row-dimension_unitId': number | null;
  'min_package_row-volume_unitId': number | null;
  'min_package_row-unitId': string | null;
  'min_package_row-unitName': string | null;
  'sales_unit_row-grossWeight': number | null;
  'sales_unit_row-netWeight': number | null;
  'sales_unit_row-length': number | null;
  'sales_unit_row-width': number | null;
  'sales_unit_row-height': number | null;
  'sales_unit_row-volume': number | null;
  'sales_unit_row-unitName': string | null;
  'sales_unit_row-weight_unitId': number | null;
  'sales_unit_row-dimension_unitId': number | null;
  'sales_unit_row-volume_unitId': number | null;
  'sales_unit_row-unitId': string | null;
}

// 组件引用接口
export interface UnitListRef {
  getUnitsMappings: () => any[];
  validateForm: () => Promise<{
    success: boolean;
    data?: IWeightDimensionItem[];
    error?: any;
  }>;
}

// 组件属性接口
export interface UnitListProps {
  disabled?: boolean;
  unitsMappings: IUnitMapItem[]; // 单位映射
  materielUnitList: any[]; // 物料单位树
  onChange?: (data: any[]) => void;
  sizeRequired: boolean;
  weightDimensionMappings?: (IWeightDimensionItem & IUnitMapItem)[]; // 接口返回的重量、体积、尺寸信息
}

// 默认单位接口
export interface DefaultUnits {
  weight: any;
  dimension: any;
  volume: any;
}

// 验证规则类型
export type ValidationRule = {
  required: boolean;
  message: string;
  validator: () => Promise<boolean>;
};
