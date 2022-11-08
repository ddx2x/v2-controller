import {} from '@ant-design/pro-components';

import {
  EditableProTable,
  ProFieldFCRenderProps,
  ProRenderFieldPropsType,
  ProTable,
} from '@ant-design/pro-components';

const EditTable = (props: ProFieldFCRenderProps) => {
  return <EditableProTable dataSource={props.fieldProps.dataSource} />;
};

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

export const editTable: ProRenderFieldPropsType = {
  render: (text, props, dom) => {
    return <EditTable {...props} {...props.fieldProps} />;
  },
  renderFormItem: (text, props, dom) => {
    return <EditTable {...props} {...props.fieldProps} />;
  },
};
