import { ProRenderFieldPropsType, ProTable } from '@ant-design/pro-components';

const Table = (props: any) => {
  return <Table {...props} />;
};

export const table: ProRenderFieldPropsType = {
  render: (text, props, dom) => {
    return <ProTable {...props.fieldProps} dataSource={props.fieldProps.dataSource} />;
  },
  renderFormItem: (text, props, dom) => {
    return <ProTable {...props.fieldProps} dataSource={props.fieldProps.dataSource} />;
  },
};
