import { ValidationRule } from './types';
import { VALIDATION } from './constants';
import { getFormDataIndex, isValueEmpty, isNumberField } from './utils';

// 验证工厂类
export class ValidationFactory {
  static createNumberValidation(
    dataIndex: string,
    entity: any,
    formData: any,
    sizeRequired: boolean
  ): ValidationRule[] {
    return [
      {
        required: true,
        message: VALIDATION.DEFAULT_MESSAGE,
        validator: () => {
          const index = getFormDataIndex(dataIndex, entity);
          const fieldValue = formData?.[index];

          // 1. 必填校验
          if (sizeRequired && isValueEmpty(fieldValue)) {
            return Promise.reject(false);
          }

          // 2. 如果字段有值，则进行数值校验
          if (!isValueEmpty(fieldValue)) {
            const numValue = Number(fieldValue);

            // 检查是否为有效数字且大于0
            if (Number.isNaN(numValue) || numValue <= VALIDATION.MIN_VALUE) {
              return Promise.reject(false);
            }
          }

          return Promise.resolve(true);
        },
      },
    ];
  }

  static createVolumeValidation(
    dataIndex: string,
    entity: any,
    formData: any
  ): ValidationRule[] {
    return [
      {
        required: true,
        message: VALIDATION.DEFAULT_MESSAGE,
        validator: () => {
          const index = getFormDataIndex(dataIndex, entity);
          const fieldValue = formData?.[index];

          if (isValueEmpty(fieldValue)) {
            return Promise.reject(false);
          }
          return Promise.resolve(true);
        },
      },
    ];
  }

  static createUnitValidation(
    dataIndex: string,
    entity: any,
    formData: any
  ): ValidationRule[] {
    return [
      {
        required: true,
        message: VALIDATION.DEFAULT_MESSAGE,
        validator: () => {
          const index = getFormDataIndex(dataIndex, entity);
          const fieldValue = formData?.[index];

          if (isValueEmpty(fieldValue)) {
            return Promise.reject(false);
          }
          return Promise.resolve(true);
        },
      },
    ];
  }

  // 根据字段类型获取验证规则
  static getValidationRules(
    dataIndex: string,
    entity: any,
    formData: any,
    sizeRequired: boolean
  ): ValidationRule[] {
    const numberFields = [
      'grossWeight',
      'netWeight',
      'length',
      'width',
      'height',
    ];
    const unitFields = [
      'unitId',
      'weight_unitId',
      'dimension_unitId',
      'volume_unitId',
    ];

    if (numberFields.includes(dataIndex)) {
      return this.createNumberValidation(
        dataIndex,
        entity,
        formData,
        sizeRequired
      );
    }

    if (dataIndex === 'volume') {
      return this.createVolumeValidation(dataIndex, entity, formData);
    }

    if (unitFields.includes(dataIndex)) {
      return this.createUnitValidation(dataIndex, entity, formData);
    }

    return [];
  }
}
