
import type { ProRenderFieldPropsType } from '@ant-design/pro-components';
import React from 'react';

class ValueTypeMapStore {
  stores: Record<string, ProRenderFieldPropsType> = {};

  registerValueType = (valueType: Record<string, React.FC<unknown>>) => {
    let vT: Record<string, ProRenderFieldPropsType> = {}
    // 自定义组件 注册
    Object.entries(valueType).map(([key, Component]) => vT[key] = {
      render: (text) => {
        return text;
      },
      renderFormItem: (props) => {
        return <Component {...props} {...props?.fieldProps} />;
      },
    })

    this.stores = { ...this.stores, ...vT };
  };
}

export const valueTypeMapStore = new ValueTypeMapStore();
