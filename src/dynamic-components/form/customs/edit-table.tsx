import { EditableProTable, ProRenderFieldPropsType } from '@ant-design/pro-components';

export const editTable: ProRenderFieldPropsType = {
  render: (text, props, dom) => {
    return <EditableProTable {...props} dataSource={props.fieldProps.dataSource} />;
  },
  renderFormItem: (text, props, dom) => {
    return <EditableProTable {...props} dataSource={props.fieldProps.dataSource} />;
  },
};
