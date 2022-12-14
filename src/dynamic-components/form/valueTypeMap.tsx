import type { ProRenderFieldPropsType } from '@ant-design/pro-components';

class ValueTypeMapStore {
  stores: Record<string, ProRenderFieldPropsType> = {};

  registerValueType = (valueType: Record<string, any>) => {
    let vT: Record<string, ProRenderFieldPropsType> = {};
    // 自定义组件 注册
    Object.entries(valueType).map(
      ([key, Component]) =>
        (vT[key] = {
        render: (text, props) => {
            return <Component {...props} {...props?.fieldProps} />;
          },
        renderFormItem: (_, props) => {
            return <Component {...props} {...props?.fieldProps} />;
          },
        }),
    );

    this.stores = { ...this.stores, ...vT };
  };
}

export const valueTypeMapStore = new ValueTypeMapStore();
