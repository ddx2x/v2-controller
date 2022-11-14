import { ProRenderFieldPropsType } from '@ant-design/pro-components';
import { card } from './card';
import { imageUpload } from './image';
import { modalForm } from './modalForm';
import { editTable, table } from './table';
import { videoUpload } from './video';

export const valueTypeMap: Record<string, ProRenderFieldPropsType> = {
  card,
  imageUpload,
  videoUpload,
  table,
  editTable,
  modalForm,
};

export declare type ValueTypeMapType =
  | 'card'
  | 'imageUpload'
  | 'videoUpload'
  | 'table'
  | 'editTable'
  | 'modalForm';
