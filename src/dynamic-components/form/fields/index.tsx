import { Table } from '@/dynamic-components/table';
import { EditableProTable } from '@ant-design/pro-components';
import { TableProps } from '../../table';
import { Form, FormProps } from '../form';
import { valueTypeMapStore } from '../valueTypeMap';
import { bMap } from './baiduMap';
import { cardField, CardFieldProps } from './card';
import { imageUploadField, ImageUploadFieldProps } from './imageUpload';
import { monacoEditorField, MonacoEditorFieldProps } from './monacoEditor';
import { videoUploadField, VideoUploadFieldProps } from './videoUpload';

declare module '@ant-design/pro-utils' {
  interface ProFieldValueTypeWithFieldProps {
    card: CardFieldProps;
    imageUpload: ImageUploadFieldProps;
    videoUpload: VideoUploadFieldProps;
    monacoEditor: MonacoEditorFieldProps;
    table: TableProps;
    // editTable: EditTableProps;
    form: FormProps;
    map: any;
  }
}

const valueTypeMap = {
  card: cardField,
  imageUpload: imageUploadField,
  videoUpload: videoUploadField,
  editTable: EditableProTable,
  monacoEditor: monacoEditorField,
  table: Table,
  form: Form,
  map: bMap,
};

valueTypeMapStore.registerValueType(valueTypeMap);
