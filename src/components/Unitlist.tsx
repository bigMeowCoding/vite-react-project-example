import React, {
  useMemo,
  forwardRef,
  useImperativeHandle,
  useEffect,
  useCallback,
  useState,
} from 'react';
import { Form, InputNumber, Select, Table } from 'antd';
import './UnitList.less';
interface IUnitMapItem {
  unitName: string;
  unitType: string;
  salesUnitFlag: number;
  purchaseUnitFlag: number;
  stockUnitFlag: number;
  unitId: string;
}
enum IUnitType {
  unit_weight = 'unit_weight',
  unit_volume = 'unit_volume',
  unit_dimension = 'unit_dimension',
}
enum IRowType {
  min_package_row = 'min_package_row',
  sales_unit_row = 'sales_unit_row',
}

// 重量单位扩展属性
interface WithWeight {
  grossWeight?: number | null;
  netWeight?: number | null;
}

// 体积单位扩展属性
interface WithVolume {
  volume?: number | null;
}

// 尺寸单位扩展属性
interface WithDimensions {
  length: number | null;
  width: number | null;
  height: number | null;
}
// 基础接口
interface IWeightDimensionItemBase {
  [key: string]: any;
  rowTypeUnitId: string | null; // 同步unitId
  rowType: IRowType; //   "min_package_row", 用料单位 "sales_unit_row",  // 销售单位
  unitType: IUnitType;
  unitId: number | null;
}
// 组合接口（使用交叉类型）
type IWeightDimensionItem =
  | (IWeightDimensionItemBase & {
      unitType: IUnitType.unit_weight;
    } & WithWeight)
  | (IWeightDimensionItemBase & {
      unitType: IUnitType.unit_volume;
    } & WithVolume)
  | (IWeightDimensionItemBase & {
      unitType: IUnitType.unit_dimension;
    } & WithDimensions);

interface IFormData {
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
const columnConfig = {
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
};

export interface UnitListRef {
  getUnitsMappings: () => any[];
  validateForm: () => Promise<{
    success: boolean;
    data?: IWeightDimensionItem[];
    error?: any;
  }>;
}

// props类型
interface UnitListProps {
  disabled?: boolean;
  unitsMappings: IUnitMapItem[]; // 单位映射
  materielUnitList: any[]; // 物料单位树
  onChange?: (data: any[]) => void;
  sizeRequired: boolean;
  weightDimensionMappings?: (IWeightDimensionItem & IUnitMapItem)[]; // 接口返回的重量、体积、尺寸信息
}

const UnitList = forwardRef<UnitListRef, UnitListProps>((props, ref) => {
  const [form] = Form.useForm();
  const unitsMappings = useMemo(() => {
    return Array.isArray(props.unitsMappings) ? props.unitsMappings : [];
  }, [props.unitsMappings]);
  const materielUnitList = useMemo(() => {
    return Array.isArray(props.materielUnitList) ? props.materielUnitList : [];
  }, [props.materielUnitList]);
  const sizeRequired = !!props.sizeRequired;
  const [formData, setFormData] = useState<IFormData | null>(null);
  const [showError, setShowError] = useState(false);
  const makeWeightDimensionMappings = useCallback((formData: IFormData) => {
    const ret: IWeightDimensionItem[] = [];
    if (formData['sales_unit_row-unitId']) {
      ret.push({
        rowType: IRowType.sales_unit_row,
        unitType: IUnitType.unit_weight,
        rowTypeUnitId: formData['sales_unit_row-unitId'],
        grossWeight: formData['sales_unit_row-grossWeight'],
        netWeight: formData['sales_unit_row-netWeight'],
        unitId: formData['sales_unit_row-weight_unitId'],
      });
      ret.push({
        rowType: IRowType.sales_unit_row,
        unitType: IUnitType.unit_volume,
        rowTypeUnitId: formData['sales_unit_row-unitId'],
        volume: formData['sales_unit_row-volume'],
        unitId: formData['sales_unit_row-volume_unitId'],
      });
      ret.push({
        rowType: IRowType.sales_unit_row,
        unitType: IUnitType.unit_dimension,
        rowTypeUnitId: formData['sales_unit_row-unitId'],
        length: formData['sales_unit_row-length'],
        width: formData['sales_unit_row-width'],
        height: formData['sales_unit_row-height'],
        unitId: formData['sales_unit_row-dimension_unitId'],
      });
    }
    if (formData['min_package_row-unitId']) {
      ret.push({
        rowType: IRowType.min_package_row,
        unitType: IUnitType.unit_weight,
        rowTypeUnitId: formData['min_package_row-unitId'],
        grossWeight: formData['min_package_row-grossWeight'],
        netWeight: formData['min_package_row-netWeight'],
        unitId: formData['min_package_row-weight_unitId'],
      });
      ret.push({
        rowType: IRowType.min_package_row,
        unitType: IUnitType.unit_volume,
        rowTypeUnitId: formData['min_package_row-unitId'],
        volume: formData['min_package_row-volume'],
        unitId: formData['min_package_row-volume_unitId'],
      });
      ret.push({
        rowType: IRowType.min_package_row,
        unitType: IUnitType.unit_dimension,
        rowTypeUnitId: formData['min_package_row-unitId'],
        length: formData['min_package_row-length'],
        width: formData['min_package_row-width'],
        height: formData['min_package_row-height'],
        unitId: formData['min_package_row-dimension_unitId'],
      });
    }
    return ret;
  }, []);
  const getFormDataIndex = useCallback((dataIndex: string, entity: any) => {
    const rowType = entity.rowType;
    return `${rowType}-${dataIndex}`;
  }, []);
  const onChange = useCallback(
    (dataIndex: string, unitItem: any) => {
      return (value: string | number | null) => {
        const index = getFormDataIndex(dataIndex, unitItem);
        const newFormData = { ...(formData || {}) };
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
          if (['length', 'width', 'height'].includes(dataIndex)) {
            const rowType = unitItem.rowType;
            const length = newFormData[`${rowType}-length`];
            const width = newFormData[`${rowType}-width`];
            const height = newFormData[`${rowType}-height`];
            const isInvalid = (val: number | null | undefined | string) => {
              return val == null || val === '' || Number(val) <= 0;
            };

            if (!isInvalid(width) && !isInvalid(height) && !isInvalid(length)) {
              const volume = Number(length) * Number(width) * Number(height);
              newFormData[`${rowType}-volume`] = Number(volume / 1000).toFixed(
                2
              );
            } else {
              newFormData[`${rowType}-volume`] = null; // 如果有任意一个值小于0，则体积置为null
            }
            console.log('体积计算', newFormData);
          }
        } else {
          newFormData[index] = value;
        }

        setFormData(newFormData as IFormData);
        const changeFunc = props.onChange;
        changeFunc &&
          changeFunc(makeWeightDimensionMappings(newFormData as IFormData));
      };
    },
    [formData, props.onChange, makeWeightDimensionMappings, getFormDataIndex]
  );

  const getFormItemValue = useCallback(
    (dataIndex: string, entity: any) => {
      const index = getFormDataIndex(dataIndex, entity);
      const value = formData?.[index];
      // 如果是数字类型的字段，确保返回 number 或 undefined
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
        return value === null ? undefined : value;
      }
      return value;
    },
    [formData, getFormDataIndex]
  );
  // 重量默认单位kg
  const weightDefaultUni = useMemo(() => {
    return materielUnitList.find((item) => {
      return item.name === '千克';
    });
  }, [materielUnitList]);
  // 体积默认单位立方厘米
  const volumeDefaultUni = useMemo(() => {
    return materielUnitList.find((item) => {
      return item.name === 'cm³';
    });
  }, [materielUnitList]);
  // 尺寸默认单位毫米
  const dimensionDefaultUni = useMemo(() => {
    return materielUnitList.find((item) => {
      return item.name === '毫米';
    });
  }, [materielUnitList]);

  const hasSalesUnit = useMemo(() => {
    return unitsMappings.some((item) => {
      return item.salesUnitFlag == 1;
    });
  }, [unitsMappings]);

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
  const getFieldRule = useCallback(
    (dataIndex: string, entity: any) => {
      const ret = [
        {
          required: true,
          message: ' ',
          validator: () => {
            const index = getFormDataIndex(dataIndex, entity);
            const fieldValue = formData?.[index]; // 如果是必填，不能输入值为空
            // 如果值不是空，就必须是大于0的数字
            const isEmpty = fieldValue == null || fieldValue === '';
            // 1. 必填校验
            if (sizeRequired && isEmpty) {
              return Promise.reject(false);
            }
            if (formData?.[index] == null || formData?.[index] === '') {
              return Promise.reject(false);
            }

            // 2. 如果字段有值，则进行数值校验,体积字段不校验
            if (!isEmpty && dataIndex !== 'volume') {
              const numValue = Number(fieldValue);

              // 检查是否为有效数字
              if (Number.isNaN(numValue)) {
                return Promise.reject(false);
              }

              // 检查是否大于0
              if (numValue <= 0) {
                return Promise.reject(false);
              }
            }
            return Promise.resolve(true);
          },
        },
      ];

      return ret;
    },
    [sizeRequired, formData, getFormDataIndex]
  );

  const renderUnitSelect = useCallback(
    (dataIndex: string, entity: any) => {
      console.log('renderUnitSelect', dataIndex, entity);
      const disabled = [
        columnConfig.unitIdDataIndex,
        columnConfig.weightUnitIdDataIndex,
        columnConfig.dimensionUnitIdDataIndex,
        columnConfig.volumeUnitIdDataIndex,
      ].includes(dataIndex)
        ? true
        : false;
      return (
        <Form.Item
          validateTrigger="submit"
          name={getFormDataIndex(dataIndex, entity)}
          rules={getFieldRule(dataIndex, entity)}
        >
          {/* <span style={{ display: 'none' }}>
            {JSON.stringify(getFormItemValue(dataIndex, entity))}
          </span> */}
          <Select
            defaultValue={getFormItemValue(dataIndex, entity) ?? null}
            value={getFormItemValue(dataIndex, entity)}
            key={`${entity.rowType}-${dataIndex}`}
            options={materielUnitList}
            style={{ width: '120px' }}
            placeholder="请选择"
            allowClear={true}
            disabled={props.disabled || !hasSalesUnit || disabled}
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
          ></Select>
        </Form.Item>
      );
    },
    [
      materielUnitList,
      props.disabled,
      hasSalesUnit,
      onChange,
      getFieldRule,
      getFormDataIndex,
      getFormItemValue,
    ]
  );

  const renderInputNumber = useCallback(
    (dataIndex: string, entity: any) => {
      return (
        <Form.Item
          name={getFormDataIndex(dataIndex, entity)}
          validateTrigger="submit"
          rules={getFieldRule(dataIndex, entity)}
        >
          <InputNumber
            defaultValue={
              getFormItemValue(dataIndex, entity) as number | undefined
            }
            precision={2}
            min={0}
            key={
              dataIndex === 'volume'
                ? (getFormItemValue(dataIndex, entity) as string)
                : `${entity.rowType}-${dataIndex}`
            }
            placeholder="请输入"
            value={getFormItemValue(dataIndex, entity) as number | undefined}
            disabled={props.disabled || !hasSalesUnit || dataIndex === 'volume'}
            onChange={(value) => {
              const valueChange = onChange(dataIndex, entity);
              valueChange(value as number | null);
            }}
          />
        </Form.Item>
      );
    },
    [
      props.disabled,
      hasSalesUnit,
      onChange,
      getFieldRule,
      getFormDataIndex,
      getFormItemValue,
    ]
  );

  useEffect(() => {
    let ret = {} as IFormData;
    const weightDimensionMappings = props.weightDimensionMappings;
    const salesUnit = unitsMappings.find((item) => {
      return item.salesUnitFlag == 1;
    });
    if (salesUnit) {
      ret = {
        ...ret,
        'sales_unit_row-grossWeight': null,
        'sales_unit_row-netWeight': null,
        'sales_unit_row-length': null,
        'sales_unit_row-width': null,
        'sales_unit_row-height': null,
        'sales_unit_row-volume': null,
        'sales_unit_row-weight_unitId': weightDefaultUni?.id ?? null,
        'sales_unit_row-dimension_unitId': dimensionDefaultUni?.id ?? null,
        'sales_unit_row-volume_unitId': volumeDefaultUni?.id ?? null,
        'sales_unit_row-unitId': salesUnit.unitId,
        'sales_unit_row-unitName': salesUnit.unitName,
      };
    }
    const unit_mini_pack = unitsMappings.find((item) => {
      return item.unitType === 'unit_mini_pack';
    });

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
        'min_package_row-weight_unitId': weightDefaultUni?.id ?? null,
        'min_package_row-dimension_unitId': dimensionDefaultUni?.id ?? null,
        'min_package_row-volume_unitId': volumeDefaultUni?.id ?? null,
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
  }, [
    unitsMappings,
    weightDefaultUni,
    volumeDefaultUni,
    dimensionDefaultUni,
    props.weightDimensionMappings,
  ]);
  // 监听 unitsMappings 变化，清空表单错误
  useEffect(() => {
    // 重置表单错误状态
    setShowError(false);
    // 重置表单字段的错误状态
    form.resetFields();
  }, [unitsMappings, form]);
  const makeThRender = (title: string, validateRequired = true) => {
    if (!validateRequired) {
      return title;
    }
    return (
      <span className={sizeRequired ? 'custom-required-label' : ''}>
        {title}
      </span>
    );
  };
  useImperativeHandle(ref, () => ({
    getUnitsMappings: () => {
      return unitsMappings;
    },
    validateForm: async () => {
      try {
        const formData = await form.validateFields();
        setShowError(false);
        const weightDimensionMappings = makeWeightDimensionMappings(
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
    },
  }));

  return (
    <Form form={form}>
      <Table
        className="custom-unit-list-table" // 关键样式类
        scroll={{ x: 'max-content' }}
        pagination={false}
        columns={[
          {
            title: makeThRender('单位类型'),
            dataIndex: 'unitName',
            key: 'unitName',
            width: 120,
            fixed: 'left',
            render: (value) => {
              return value;
            },
          },
          {
            title: makeThRender('单位'),
            dataIndex: columnConfig.unitIdDataIndex,
            key: columnConfig.unitIdDataIndex,
            width: 100,
            fixed: 'left',
            render: (value, entity) => {
              return renderUnitSelect(columnConfig.unitIdDataIndex, entity);
            },
          },
          {
            title: '重量信息',
            dataIndex: 'unit_weight',
            key: 'unit_weight',
            children: [
              {
                title: makeThRender('单位'),
                dataIndex: columnConfig.weightUnitIdDataIndex,
                key: columnConfig.weightUnitIdDataIndex,
                render: (value, entity) => {
                  return renderUnitSelect(
                    columnConfig.weightUnitIdDataIndex,
                    entity
                  );
                },
              },
              {
                title: makeThRender('毛重'),
                width: 100,
                dataIndex: columnConfig.maozhongDataIndex,
                key: columnConfig.maozhongDataIndex,
                render: (value, entity) => {
                  return renderInputNumber(
                    columnConfig.maozhongDataIndex,
                    entity
                  );
                },
              },
              {
                title: makeThRender('净重'),
                width: 100,
                dataIndex: columnConfig.netWightDataIndex,
                key: columnConfig.netWightDataIndex,
                render: (value, entity) => {
                  return renderInputNumber(
                    columnConfig.netWightDataIndex,
                    entity
                  );
                },
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
                dataIndex: columnConfig.dimensionUnitIdDataIndex,
                key: columnConfig.dimensionUnitIdDataIndex,
                // width: 200,
                render: (value, entity) => {
                  return renderUnitSelect(
                    columnConfig.dimensionUnitIdDataIndex,
                    entity
                  );
                },
              },
              {
                title: makeThRender('长'),
                dataIndex: columnConfig.lengthDataIndex,
                key: columnConfig.lengthDataIndex,
                width: 100,
                render: (value, entity) => {
                  return renderInputNumber(
                    columnConfig.lengthDataIndex,
                    entity
                  );
                },
              },
              {
                title: makeThRender('宽'),
                dataIndex: columnConfig.widthDataIndex,
                key: columnConfig.widthDataIndex,
                width: 100,
                render: (value, entity) => {
                  return renderInputNumber(columnConfig.widthDataIndex, entity);
                },
              },
              {
                title: makeThRender('高'),
                dataIndex: columnConfig.heightDataIndex,
                key: columnConfig.heightDataIndex,
                width: 100,
                render: (value, entity) => {
                  return renderInputNumber(
                    columnConfig.heightDataIndex,
                    entity
                  );
                },
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
                dataIndex: columnConfig.volumeUnitIdDataIndex,
                key: columnConfig.volumeUnitIdDataIndex,
                render: (value, entity) => {
                  return renderUnitSelect(
                    columnConfig.volumeUnitIdDataIndex,
                    entity
                  );
                },
                width: 100,
              },
              {
                title: makeThRender('体积'),
                dataIndex: 'volume',
                key: 'volume',
                width: 100,
                render: (value, entity) => {
                  return renderInputNumber(
                    columnConfig.volumeDataIndex,
                    entity
                  );
                },
              },
            ],
          },
        ]}
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
