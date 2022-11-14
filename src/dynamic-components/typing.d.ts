export declare type LayoutType = 'table' | 'list' | 'descriptions' | 'form' | 'step-form';

import { DescriptionsProps, FormProps, ListProps, StepFormProps, TableProps } from './form';

export declare type TableTemplate = TableProps & {
  pageContainer?: PageContainerProps;
};
export declare interface ListTemplate extends ListProps {
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

declare module '@ant-design/pro-utils' {
  interface ProFieldValueTypeWithFieldProps {
    tags: Record<string, any>;
    link: {
      customField: string;
    };
  }
}
