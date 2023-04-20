
import { ProFieldFCRenderProps, ProFormSelect, ProFormSelectProps } from '@ant-design/pro-components';

import { Component } from 'react';

export declare type ObjectSelectProps = ProFieldFCRenderProps & ProFormSelectProps

export class ObjectSelect extends Component<ObjectSelectProps> {

  render() {
    const { value, onChange, fieldProps, ...rest } = this.props;

    return (
      <ProFormSelect
        value={value}
        onChange={(value: string, option: any) => onChange && onChange(option['data-item'])}
        {...rest}
      />
    );
  }
}

export const ObjectSelectRenderFormItem: React.FC<ObjectSelectProps> = (props) => {
  return <ObjectSelect {...props} />;
};

export const ObjectSelectRender: React.FC<ObjectSelectProps> = (props) => {
  return <ObjectSelect {...props} />;
};