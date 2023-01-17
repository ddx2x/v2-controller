import type { IObject, ObjectStore, Query } from '@/client';
import type { PageContainerProps } from '../dynamic-components/container';
import type { DescriptionsProps } from '../dynamic-components/descriptions';
import type { FormProps, StepFormProps } from '../dynamic-components/form';
import type { ListProps } from '../dynamic-components/list';
import type { TableProps } from '../dynamic-components/table';

export declare type View =
  | ({ kind: 'table' } & TableProps)
  | ({ kind: 'list' } & ListProps)
  | ({ kind: 'form' } & FormProps)
  | ({ kind: 'stepForm' } & StepFormProps)
  | ({ kind: 'descriptions' } & DescriptionsProps);

export declare type Page = { view: View[]; container?: PageContainerProps };

export declare type Store<S extends ObjectStore<IObject>> = {
  store: S;
  query?: Query;
  load?: (query?: Query) => Promise<void>;
  watch?: () => void;
  exit?: () => void;
};

export declare type PageSchema<S extends Store = any> = {
  page: Page;
  stores?: S[];
};
