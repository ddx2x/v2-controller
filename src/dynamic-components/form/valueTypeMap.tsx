import type { ProRenderFieldPropsType } from '@ant-design/pro-components';

class ValueTypeMapStore {
  stores: Record<string, ProRenderFieldPropsType> = {};

  registerValueType = (valueType: Record<string, any>) => {
    let vT: Record<string, ProRenderFieldPropsType> = {};
    // 自定义组件 注册
    Object.entries(valueType).map(
      ([key, [ReadComponent, EditComponent]]) =>
      (vT[key] = {
        renderFormItem: (text, props, dom) => {
          return <ReadComponent {...props} {...props?.fieldProps} />;
        },
        render: (text, props, dom) => {
          return <EditComponent {...props} {...props?.fieldProps} />;
        },
      }),
    );

    this.stores = { ...this.stores, ...vT };
  };
}

export const valueTypeMapStore = new ValueTypeMapStore();
