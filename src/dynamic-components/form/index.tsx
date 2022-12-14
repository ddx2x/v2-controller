import { ProFormColumnsType } from '@ant-design/pro-components';

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
];


export declare type FormColumnsType = ProFormColumnsType<any, 'text'>