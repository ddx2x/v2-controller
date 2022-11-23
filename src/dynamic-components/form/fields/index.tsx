
import { Table } from '@/dynamic-components/table';
import { EditableProTable } from '@ant-design/pro-components';
import { Form } from '../form';
import { valueTypeMapStore } from '../valueTypeMap';
import { cardField } from './card';
import { imageUploadField } from './imageUpload';
import { monacoEditorField } from './monacoEditor';
import { videoUploadField } from './videoUpload';

const valueTypeMap = {
  card: cardField,
  imageUpload: imageUploadField,
  videoUpload: videoUploadField,
  editTable: EditableProTable,
  monacoEditor: monacoEditorField,
  table: Table,
  form: Form,
};

valueTypeMapStore.registerValueType(valueTypeMap);

export * from './typing.d';
