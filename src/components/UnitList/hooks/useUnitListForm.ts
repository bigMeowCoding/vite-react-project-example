import { useState, useCallback, useEffect } from 'react';
import { Form } from 'antd';
import {
  IFormData,
  IWeightDimensionItem,
  IUnitMapItem,
  DefaultUnits,
} from '../types';
import {
  convertFormDataToMappings,
  getFormDataIndex,
  isValueEmpty,
  isDimensionField,
  calculateVolume,
} from '../utils';
import { UNIT_TYPES } from '../constants';

interface UseUnitListFormProps {
  unitsMappings: IUnitMapItem[];
  weightDimensionMappings?: (IWeightDimensionItem & IUnitMapItem)[];
  defaultUnits: DefaultUnits;
  onChange?: (data: any[]) => void;
}

export const useUnitListForm = ({
  unitsMappings,
  weightDimensionMappings,
  defaultUnits,
  onChange,
}: UseUnitListFormProps) => {
  const [form] = Form.useForm();
  const [formData, setFormData] = useState<IFormData | null>(null);
  const [showError, setShowError] = useState(false);

  // 初始化表单数据
  const initFormData = useCallback(() => {
    let ret = {} as IFormData;
    const salesUnit = unitsMappings.find((item) => item.salesUnitFlag == 1);

    if (salesUnit) {
      ret = {
        ...ret,
        'sales_unit_row-grossWeight': null,
        'sales_unit_row-netWeight': null,
        'sales_unit_row-length': null,
        'sales_unit_row-width': null,
        'sales_unit_row-height': null,
        'sales_unit_row-volume': null,
        'sales_unit_row-weight_unitId': defaultUnits.weight?.id ?? null,
        'sales_unit_row-dimension_unitId': defaultUnits.dimension?.id ?? null,
        'sales_unit_row-volume_unitId': defaultUnits.volume?.id ?? null,
        'sales_unit_row-unitId': salesUnit.unitId,
        'sales_unit_row-unitName': salesUnit.unitName,
      };
    }

    const unit_mini_pack = unitsMappings.find(
      (item) => item.unitType === UNIT_TYPES.MINI_PACK
    );

    if (
      unit_mini_pack &&
      salesUnit &&
      unit_mini_pack.unitId !== salesUnit.unitId
    ) {
      ret = {
        ...ret,
        'min_package_row-grossWeight': null,
        'min_package_row-netWeight': null,
        'min_package_row-length': null,
        'min_package_row-width': null,
        'min_package_row-height': null,
        'min_package_row-volume': null,
        'min_package_row-weight_unitId': defaultUnits.weight?.id ?? null,
        'min_package_row-dimension_unitId': defaultUnits.dimension?.id ?? null,
        'min_package_row-volume_unitId': defaultUnits.volume?.id ?? null,
        'min_package_row-unitId': unit_mini_pack.unitId,
        'min_package_row-unitName': unit_mini_pack.unitName,
      };
    }

    // 如果props.weightDimensionMappings存在，更新重量、体积、尺寸信息
    if (
      Array.isArray(weightDimensionMappings) &&
      weightDimensionMappings.length > 0
    ) {
      if (salesUnit) {
        weightDimensionMappings.forEach((item) => {
          if (
            item.rowType === 'sales_unit_row' &&
            item.unitType === 'unit_weight'
          ) {
            ret['sales_unit_row-grossWeight'] = item.grossWeight ?? null;
            ret['sales_unit_row-netWeight'] = item.netWeight ?? null;
          }
          if (
            item.rowType === 'sales_unit_row' &&
            item.unitType === 'unit_volume'
          ) {
            ret['sales_unit_row-volume'] = item.volume ?? null;
          }
          if (
            item.rowType === 'sales_unit_row' &&
            item.unitType === 'unit_dimension'
          ) {
            ret['sales_unit_row-length'] = item.length ?? null;
            ret['sales_unit_row-width'] = item.width ?? null;
            ret['sales_unit_row-height'] = item.height ?? null;
          }
        });
      }
      if (unit_mini_pack) {
        weightDimensionMappings.forEach((item) => {
          if (
            item.rowType === 'min_package_row' &&
            item.unitType === 'unit_weight'
          ) {
            ret['min_package_row-grossWeight'] = item.grossWeight ?? null;
            ret['min_package_row-netWeight'] = item.netWeight ?? null;
          }
          if (
            item.rowType === 'min_package_row' &&
            item.unitType === 'unit_volume'
          ) {
            ret['min_package_row-volume'] = item.volume ?? null;
          }
          if (
            item.rowType === 'min_package_row' &&
            item.unitType === 'unit_dimension'
          ) {
            ret['min_package_row-length'] = item.length ?? null;
            ret['min_package_row-width'] = item.width ?? null;
            ret['min_package_row-height'] = item.height ?? null;
          }
        });
      }
    }

    setFormData(ret as IFormData);
  }, [unitsMappings, weightDimensionMappings, defaultUnits]);

  // 处理字段变化
  const handleFieldChange = useCallback(
    (dataIndex: string, unitItem: any) => {
      return (value: string | number | null) => {
        setFormData((prevFormData) => {
          if (!prevFormData) prevFormData = {} as IFormData;
          const newFormData = { ...prevFormData };
          const index = getFormDataIndex(dataIndex, unitItem);

          // 如果是数字类型的字段，确保存储为 number 或 null
          if (
            [
              'grossWeight',
              'netWeight',
              'length',
              'width',
              'height',
              'volume',
            ].includes(dataIndex)
          ) {
            newFormData[index] = value === undefined ? null : value;

            // 如果是长宽高变化，自动更新体积
            if (isDimensionField(dataIndex)) {
              const rowType = unitItem.rowType;
              const length = newFormData[`${rowType}-length`];
              const width = newFormData[`${rowType}-width`];
              const height = newFormData[`${rowType}-height`];

              if (
                !isValueEmpty(width) &&
                !isValueEmpty(height) &&
                !isValueEmpty(length)
              ) {
                const volume = calculateVolume(
                  Number(length),
                  Number(width),
                  Number(height)
                );
                newFormData[`${rowType}-volume`] = volume;
              } else {
                newFormData[`${rowType}-volume`] = null;
              }
            }
          } else {
            newFormData[index] = value;
          }

          const changeFunc = onChange;
          changeFunc &&
            changeFunc(convertFormDataToMappings(newFormData as IFormData));
          return newFormData;
        });
      };
    },
    [onChange]
  );

  // 验证表单
  const validateForm = useCallback(async () => {
    try {
      const formData = await form.validateFields();
      setShowError(false);
      const weightDimensionMappings = convertFormDataToMappings(
        formData as IFormData
      );
      return {
        success: true,
        data: weightDimensionMappings,
      };
    } catch (err) {
      setShowError(true);
      return {
        success: false,
        error: err,
      };
    }
  }, [form]);

  // 重置错误状态
  const resetError = useCallback(() => {
    setShowError(false);
    form.resetFields();
  }, [form]);

  // 初始化表单数据
  useEffect(() => {
    initFormData();
  }, [initFormData]);

  // 监听 unitsMappings 变化，清空表单错误
  useEffect(() => {
    resetError();
  }, [unitsMappings, resetError]);

  return {
    form,
    formData,
    showError,
    handleFieldChange,
    validateForm,
    resetError,
  };
};
