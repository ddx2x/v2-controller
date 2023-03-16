import { ProFieldFCRenderProps } from '@ant-design/pro-components';
import { AutoComplete as AntdAutoComplete, AutoCompleteProps as AntdAutoCompleteProps } from 'antd';
import { Component } from 'react';

export declare type AutoCompleteProps = ProFieldFCRenderProps &
  Omit<AntdAutoCompleteProps, 'onSearch'> & {
    onSearch?: (text: string) => { value: string }[];
  };

export class AutoComplete extends Component<AutoCompleteProps> {
  state = {
    options: [],
  };

  render() {
    const { value, onChange, onSearch, fieldProps, ...rest } = this.props;

    return (
      <AntdAutoComplete
        value={value}
        options={this.state.options}
        onChange={onChange}
        {...rest}
        onSearch={async (text) => {
          if (onSearch && text) {
            this.setState({ options: await onSearch(text) });
          }
        }}
      />
    );
  }
}

export const AutoCompleteRenderFormItem: React.FC<AutoCompleteProps> = (props) => {
  return <AutoComplete {...props} />;
};

export const AutoCompleteRender: React.FC<AutoCompleteProps> = (props) => {
  return props.value;
};
