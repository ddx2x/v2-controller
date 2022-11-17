import type { PageContainerProps } from './container';
import type { DescriptionsProps, FormProps, StepFormProps, TableProps } from './form';
import type { ListProps } from './list';

export declare type LayoutType = FormProps | StepFormProps | TableProps;

export declare type TableTemplate = TableProps & {
  kind?: 'table';
  pageContainer?: PageContainerProps;
};

export declare type ListTemplate = ListProps & {
  kind?: 'List';
  pageContainer?: PageContainerProps;
};

export declare type FormTemplate = FormProps & {
  kind?: 'Form';
  pageContainer?: PageContainerProps;
};

export declare type StepFormTemplate = StepFormProps & {
  kind?: 'StepForm';
  pageContainer?: PageContainerProps;
};

export declare type DescriptionsTemplate = DescriptionsProps & {
  kind?: 'Descriptions';
  pageContainer?: PageContainerProps;
};
