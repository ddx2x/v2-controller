import { ProRenderFieldPropsType } from '@ant-design/pro-components';
import { modalForm } from './modal-form';
import { editTable, table } from './table';
import { imageUpload, videoUpload } from './upload';

export type CustomFormType = 'imageUpload' | 'videoUpload' | 'table' | 'editTable' | 'modalForm';

export const customsValueTypeMap: Record<string, ProRenderFieldPropsType> = {
  imageUpload,
  videoUpload,
  table,
  editTable,
  modalForm,
};
