import { ProRenderFieldPropsType } from '@ant-design/pro-components';
import { editTable } from './edit-table';
import { modalForm } from './modal-form';
import { table } from './table';
import { uploader } from './uploader';

export type CustomFormType = 'uploader' | 'table' | 'editTable' | 'modalForm';

export const customsValueTypeMap: Record<string, ProRenderFieldPropsType> = {
  uploader,
  table,
  editTable,
  modalForm,
};
