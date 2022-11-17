import { ProFieldFCRenderProps } from '@ant-design/pro-components';
import { FormProps } from '../form';
import { CardProps } from './card';
import { ImageUploadProps } from './image';
import { EditTableProps, TableProps } from './table';
import { VideoUploadProps } from './video';

export declare module '@ant-design/pro-utils' {
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