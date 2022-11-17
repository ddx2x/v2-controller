import type { ProRenderFieldPropsType } from '@ant-design/pro-components';

// 自定义组件 注册
class ValueTypeMapStore {
  stores: Record<string, ProRenderFieldPropsType> = {};

  registerValueType = (valueType: Record<string, ProRenderFieldPropsType>) => {
    this.stores = { ...this.stores, ...valueType };
  };
}

export const valueTypeMapStore = new ValueTypeMapStore();
