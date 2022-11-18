
import { EditableProTable } from '@ant-design/pro-components';
import { Form } from '../form';
import { valueTypeMapStore } from '../valueTypeMap';
import { card } from './card';
import { imageUpload } from './image';
import { videoUpload } from './video';

const valueTypeMap = {
  card,
  imageUpload,
  videoUpload,
  // table: Table,
  form: Form,
  editTable: EditableProTable,
};

valueTypeMapStore.registerValueType(valueTypeMap);

export * from './typing.d';
