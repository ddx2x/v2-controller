import { FormProps } from '../form';
import { CardFieldProps } from './card';
import { ImageUploadFieldProps } from './imageUpload';
import { MonacoEditorFieldProps } from './monacoEditor';
import { EditTableProps, TableProps } from './table';
import { VideoUploadFieldProps } from './videoUpload';

export declare module '@ant-design/pro-utils' {
  interface ProFieldValueTypeWithFieldProps {
    card: CardFieldProps;
    imageUpload: ImageUploadFieldProps;
    videoUpload: VideoUploadFieldProps;
    monacoEditor: MonacoEditorFieldProps
    table: TableProps;
    editTable: EditTableProps;
    form: FormProps;
  }
};