import { ProRenderFieldPropsType } from '@ant-design/pro-components';
import Form from '../form';

export const modalForm: ProRenderFieldPropsType = {
  render: (text, props, dom) => {
    return <Form {...props.fieldProps} />;
  },
  renderFormItem: (text, props, dom) => {
    return <Form {...props.fieldProps} />;
  },
};

export interface ModalFormProps extends ProRenderFieldPropsType {}
