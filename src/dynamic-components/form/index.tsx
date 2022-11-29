
import { randomKey } from '../helper';
import { Form, FormProps } from './form';
import { StepForm, StepFormProps } from './stepForm';

export * from './fields';
export * from './form';
export * from './stepForm';
export * from './valueTypeMap';

export const ProFieldValueTypeKeys = [
  'text',
  'password',
  'money',
  'index',
  'indexBorder',
  'option',
  'textarea',
  'date',
  'dateWeek',
  'dateMonth',
  'dateQuarter',
  'dateYear',
  'dateTime',
  'fromNow',
  'dateRange',
  'dateTimeRange',
  'time',
  'timeRange',
  'select',
  'checkbox',
  'rate',
  'slider',
  'radio',
  'radioButton',
  'progress',
  'percent',
  'digit',
  'digitRange',
  'second',
  'code',
  'jsonCode',
  'avatar',
  'switch',
  'image',
  'cascader',
  'treeSelect',
  'color',
  'segmented',
  //
  'formList',
  'formSet',
]

export const useForm = (props: FormProps): [React.ReactNode, {}] => {
  return [<Form key={randomKey(10, { numbers: false })} {...props} />, {}];
};

export const useStepsForm = (props: StepFormProps): [React.ReactNode, {}] => {
  return [<StepForm key={randomKey(10, { numbers: false })} {...props} />, {}];
};
