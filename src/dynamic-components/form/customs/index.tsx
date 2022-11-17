import { ProRenderFieldPropsType } from '@ant-design/pro-components';
import { Form } from '../form';
import { card } from './card';
import { imageUpload } from './image';
import { editTable, table } from './table';
import { videoUpload } from './video';

export const form: ProRenderFieldPropsType = {
  render: (text, props, dom) => {
    return <Form {...props.fieldProps} />;
  },
  renderFormItem: (text, props, dom) => {
    return <Form {...props.fieldProps} />;
  },
};

export const valueTypeMap: Record<string, ProRenderFieldPropsType> = {
  card,
  imageUpload,
  videoUpload,
  table,
  editTable,
  form,
};