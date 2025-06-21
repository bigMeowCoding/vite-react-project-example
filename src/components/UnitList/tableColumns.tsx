import React, { useMemo } from 'react';
import { COLUMN_CONFIG } from './constants';
import { UnitSelect } from './components/UnitSelect';
import { UnitInputNumber } from './components/UnitInputNumber';

interface UseTableColumnsProps {
  materielUnitList: any[];
  disabled?: boolean;
  hasSalesUnit: boolean;
  sizeRequired: boolean;
  getFormDataIndex: (dataIndex: string, entity: any) => string;
  getFormItemValue: (dataIndex: string, entity: any) => any;
  getFieldRule: (dataIndex: string, entity: any) => any[];
  onChange: (
    dataIndex: string,
    unitItem: any
  ) => (value: string | number | null) => void;
}

export const useTableColumns = ({
  materielUnitList,
  disabled,
  hasSalesUnit,
  sizeRequired,
  getFormDataIndex,
  getFormItemValue,
  getFieldRule,
  onChange,
}: UseTableColumnsProps) => {
  const makeThRender = useMemo(() => {
    // eslint-disable-next-line react/display-name
    return (title: string, validateRequired = true) => {
      if (!validateRequired) {
        return title;
      }
      return (
        <span className={sizeRequired ? 'custom-required-label' : ''}>
          {title}
        </span>
      );
    };
  }, [sizeRequired]);

  const columns = useMemo(() => {
    return [
      {
        title: makeThRender('单位类型'),
        dataIndex: 'unitName',
        key: 'unitName',
        width: 120,
        fixed: 'left' as const,
        render: (value: string) => value,
      },
      {
        title: makeThRender('单位'),
        dataIndex: COLUMN_CONFIG.unitIdDataIndex,
        key: COLUMN_CONFIG.unitIdDataIndex,
        width: 100,
        fixed: 'left' as const,
        render: (value: any, entity: any) => (
          <UnitSelect
            dataIndex={COLUMN_CONFIG.unitIdDataIndex}
            entity={entity}
            materielUnitList={materielUnitList}
            disabled={disabled || !hasSalesUnit}
            hasSalesUnit={hasSalesUnit}
            getFormDataIndex={getFormDataIndex}
            getFormItemValue={getFormItemValue}
            getFieldRule={getFieldRule}
            onChange={onChange}
          />
        ),
      },
      {
        title: '重量信息',
        dataIndex: 'unit_weight',
        key: 'unit_weight',
        children: [
          {
            title: makeThRender('单位'),
            dataIndex: COLUMN_CONFIG.weightUnitIdDataIndex,
            key: COLUMN_CONFIG.weightUnitIdDataIndex,
            render: (value: any, entity: any) => (
              <UnitSelect
                dataIndex={COLUMN_CONFIG.weightUnitIdDataIndex}
                entity={entity}
                materielUnitList={materielUnitList}
                disabled={disabled || !hasSalesUnit}
                hasSalesUnit={hasSalesUnit}
                getFormDataIndex={getFormDataIndex}
                getFormItemValue={getFormItemValue}
                getFieldRule={getFieldRule}
                onChange={onChange}
              />
            ),
          },
          {
            title: makeThRender('毛重'),
            width: 100,
            dataIndex: COLUMN_CONFIG.maozhongDataIndex,
            key: COLUMN_CONFIG.maozhongDataIndex,
            render: (value: any, entity: any) => (
              <UnitInputNumber
                dataIndex={COLUMN_CONFIG.maozhongDataIndex}
                entity={entity}
                disabled={disabled || !hasSalesUnit}
                hasSalesUnit={hasSalesUnit}
                getFormDataIndex={getFormDataIndex}
                getFormItemValue={getFormItemValue}
                getFieldRule={getFieldRule}
                onChange={onChange}
              />
            ),
          },
          {
            title: makeThRender('净重'),
            width: 100,
            dataIndex: COLUMN_CONFIG.netWightDataIndex,
            key: COLUMN_CONFIG.netWightDataIndex,
            render: (value: any, entity: any) => (
              <UnitInputNumber
                dataIndex={COLUMN_CONFIG.netWightDataIndex}
                entity={entity}
                disabled={disabled || !hasSalesUnit}
                hasSalesUnit={hasSalesUnit}
                getFormDataIndex={getFormDataIndex}
                getFormItemValue={getFormItemValue}
                getFieldRule={getFieldRule}
                onChange={onChange}
              />
            ),
          },
        ],
      },
      {
        title: '尺寸信息',
        dataIndex: 'unit_dimension',
        key: 'unit_dimension',
        children: [
          {
            title: makeThRender('单位'),
            dataIndex: COLUMN_CONFIG.dimensionUnitIdDataIndex,
            key: COLUMN_CONFIG.dimensionUnitIdDataIndex,
            render: (value: any, entity: any) => (
              <UnitSelect
                dataIndex={COLUMN_CONFIG.dimensionUnitIdDataIndex}
                entity={entity}
                materielUnitList={materielUnitList}
                disabled={disabled || !hasSalesUnit}
                hasSalesUnit={hasSalesUnit}
                getFormDataIndex={getFormDataIndex}
                getFormItemValue={getFormItemValue}
                getFieldRule={getFieldRule}
                onChange={onChange}
              />
            ),
          },
          {
            title: makeThRender('长'),
            dataIndex: COLUMN_CONFIG.lengthDataIndex,
            key: COLUMN_CONFIG.lengthDataIndex,
            width: 100,
            render: (value: any, entity: any) => (
              <UnitInputNumber
                dataIndex={COLUMN_CONFIG.lengthDataIndex}
                entity={entity}
                disabled={disabled || !hasSalesUnit}
                hasSalesUnit={hasSalesUnit}
                getFormDataIndex={getFormDataIndex}
                getFormItemValue={getFormItemValue}
                getFieldRule={getFieldRule}
                onChange={onChange}
              />
            ),
          },
          {
            title: makeThRender('宽'),
            dataIndex: COLUMN_CONFIG.widthDataIndex,
            key: COLUMN_CONFIG.widthDataIndex,
            width: 100,
            render: (value: any, entity: any) => (
              <UnitInputNumber
                dataIndex={COLUMN_CONFIG.widthDataIndex}
                entity={entity}
                disabled={disabled || !hasSalesUnit}
                hasSalesUnit={hasSalesUnit}
                getFormDataIndex={getFormDataIndex}
                getFormItemValue={getFormItemValue}
                getFieldRule={getFieldRule}
                onChange={onChange}
              />
            ),
          },
          {
            title: makeThRender('高'),
            dataIndex: COLUMN_CONFIG.heightDataIndex,
            key: COLUMN_CONFIG.heightDataIndex,
            width: 100,
            render: (value: any, entity: any) => (
              <UnitInputNumber
                dataIndex={COLUMN_CONFIG.heightDataIndex}
                entity={entity}
                disabled={disabled || !hasSalesUnit}
                hasSalesUnit={hasSalesUnit}
                getFormDataIndex={getFormDataIndex}
                getFormItemValue={getFormItemValue}
                getFieldRule={getFieldRule}
                onChange={onChange}
              />
            ),
          },
        ],
      },
      {
        title: '体积信息',
        dataIndex: 'unit_volume',
        key: 'unit_volume',
        children: [
          {
            title: makeThRender('单位'),
            dataIndex: COLUMN_CONFIG.volumeUnitIdDataIndex,
            key: COLUMN_CONFIG.volumeUnitIdDataIndex,
            render: (value: any, entity: any) => (
              <UnitSelect
                dataIndex={COLUMN_CONFIG.volumeUnitIdDataIndex}
                entity={entity}
                materielUnitList={materielUnitList}
                disabled={disabled || !hasSalesUnit}
                hasSalesUnit={hasSalesUnit}
                getFormDataIndex={getFormDataIndex}
                getFormItemValue={getFormItemValue}
                getFieldRule={getFieldRule}
                onChange={onChange}
              />
            ),
            width: 100,
          },
          {
            title: makeThRender('体积'),
            dataIndex: 'volume',
            key: 'volume',
            width: 100,
            render: (value: any, entity: any) => (
              <UnitInputNumber
                dataIndex={COLUMN_CONFIG.volumeDataIndex}
                entity={entity}
                disabled={disabled || !hasSalesUnit}
                hasSalesUnit={hasSalesUnit}
                getFormDataIndex={getFormDataIndex}
                getFormItemValue={getFormItemValue}
                getFieldRule={getFieldRule}
                onChange={onChange}
              />
            ),
          },
        ],
      },
    ];
  }, [
    makeThRender,
    materielUnitList,
    disabled,
    hasSalesUnit,
    getFormDataIndex,
    getFormItemValue,
    getFieldRule,
    onChange,
  ]);

  return columns;
};
