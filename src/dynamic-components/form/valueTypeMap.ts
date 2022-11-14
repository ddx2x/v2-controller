import { ProRenderFieldPropsType } from '@ant-design/pro-components';

class ValueTypeMapStore {
  stores: Record<string, ProRenderFieldPropsType> = {};

  registerValueType = (valueType: Record<string, ProRenderFieldPropsType>) => {
    this.stores = { ...this.stores, ...valueType };
  };
}

export const valueTypeMapStore = new ValueTypeMapStore();
