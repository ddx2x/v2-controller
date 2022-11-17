import { ProFieldFCRenderProps, ProRenderFieldPropsType } from '@ant-design/pro-components';
import { Form, FormProps } from '../form';
import { card, CardProps } from './card';
import { imageUpload, ImageUploadProps } from './image';
import { editTable, EditTableProps, table, TableProps } from './table';
import { videoUpload, VideoUploadProps } from './video';

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

declare module '@ant-design/pro-utils' {
  interface ProFieldValueTypeWithFieldProps {
    card: CardProps;
    imageUpload: ImageUploadProps;
    videoUpload: VideoUploadProps;
    table: TableProps;
    editTable: EditTableProps;
    form: ProFieldFCRenderProps & {
      fieldProps?: FormProps;
    };
  }
};