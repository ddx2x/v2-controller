import { ProFormColumnsType } from '@ant-design/pro-components';
import { FormFieldType } from '@ant-design/pro-form/es/components/SchemaForm/typing';
import { CustomFormType } from './customs';

export type FormColumnsType =
  | ProFormColumnsType<any, 'text' | FormFieldType | CustomFormType | any>[]
  | ProFormColumnsType<any, 'text' | FormFieldType | CustomFormType | any>[][]
  | undefined;

declare module '@ant-design/pro-utils' {
  interface ProFieldValueTypeWithFieldProps {
    tags: Record<string, any>;
    link: {
      customField: string;
    };
  }
}
