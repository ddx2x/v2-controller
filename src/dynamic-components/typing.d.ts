import type { PageContainerProps } from './container';
import type { DescriptionsProps, FormProps, StepFormProps, TableProps } from './form';
import type { ListProps } from './list';

export declare type LayoutType = FormProps | StepFormProps | TableProps;

export declare type TableTemplate = TableProps & {
  pageContainer?: PageContainerProps;
};

export declare type ListTemplate = ListProps & {
  pageContainer?: PageContainerProps;
}

export declare type FormTemplate = FormProps & {
  pageContainer?: PageContainerProps;
};

export declare type StepFormTemplate = StepFormProps & {
  pageContainer?: PageContainerProps;
};

export declare interface DescriptionsTemplate extends DescriptionsProps {
  pageContainer?: PageContainerProps;
}
