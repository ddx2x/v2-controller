import { ProFormColumnsType } from '@ant-design/pro-components';
import { FormFieldType } from '@ant-design/pro-form/es/components/SchemaForm/typing';
import { valueTypeMap, ValueTypeMapType } from './customs';
import Form, { FormProps } from './form';
import StepForm, { StepFormProps } from './stepForm';
import { valueTypeMapStore } from './valueTypeMap';

export * from './form';
export { default } from './form';
export * from './stepForm';
export * from './valueTypeMap';

valueTypeMapStore.registerValueType(valueTypeMap);

export const useForm = (props: FormProps): [any, {}] => {
  return [<Form {...props} />, {}];
};

export const useStepsForm = (props: StepFormProps): [any, {}] => {
  return [<StepForm {...props} />, {}];
};

export type FormColumnsType =
  | ProFormColumnsType<any, 'text' | FormFieldType | ValueTypeMapType>[]
  | ProFormColumnsType<any, 'text' | FormFieldType | ValueTypeMapType>[][];
