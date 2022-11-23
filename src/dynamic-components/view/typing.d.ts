import type { IObject, ObjectStore, Query } from '@/client';
import type { PageContainerProps } from '../container';
import type { DescriptionsProps } from '../descriptions';
import type { FormProps, StepFormProps } from '../form';
import type { ListProps } from '../list';
import type { TableProps } from '../table';

declare type View =
  { kind: 'table'; } & TableProps |
  { kind: 'list'; } & ListProps |
  { kind: 'form'; } & FormProps |
  { kind: 'stepForm'; } & StepFormProps |
  { kind: 'descriptions'; } & DescriptionsProps

declare type Page = { view: View[], container?: PageContainerProps }

declare type Store = {
  store: ObjectStore<IObject>;
  query?: Query;
  load: (query?: Query) => Promise<void>;
  watch?: () => void;
  exit: () => void;
}

declare type PageSchema<S extends Store> = {
  page: Page;
  stores?: S[];
}

