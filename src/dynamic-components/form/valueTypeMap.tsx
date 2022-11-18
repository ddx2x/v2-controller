
import type { ProRenderFieldPropsType } from '@ant-design/pro-components';
import React from 'react';

// 自定义组件 注册
class ValueTypeMapStore {
  stores: Record<string, ProRenderFieldPropsType> = {};

  registerValueType = (valueType: Record<string, React.FC<any>>) => {
    let vT: Record<string, ProRenderFieldPropsType> = {}

    Object.entries(valueType).map(([key, Component]) => vT[key] = {
      render: (text, props, dom) => {
        return <Component {...props} fieldProps={props.fieldProps} />;
      },
      renderFormItem: (text, props, dom) => {
        return <Component {...props} fieldProps={props.fieldProps} />;
      },
    })

    this.stores = { ...this.stores, ...vT };
  };
}

export const valueTypeMapStore = new ValueTypeMapStore();
