import { ObjectStore } from '@/client';
import { observable } from 'mobx';
import { PageContainerProps } from '../container';
import { DescriptionsProps } from '../descriptions';
import { FormProps, StepFormProps } from '../form';
import { ListProps } from '../list';
import { TableProps } from '../table';

export type LayoutType = 'table' | 'list' | 'descriptions' | 'form' | 'step-form';

export interface TableTemplate extends TableProps {
  pageContainer?: PageContainerProps;
}
export interface ListTemplate extends ListProps {
  pageContainer?: PageContainerProps;
}
export interface FormTemplate extends FormProps {
  pageContainer?: PageContainerProps;
}
export interface StepFormTemplate extends StepFormProps {
  pageContainer?: PageContainerProps;
}
export interface DescriptionsTemplate extends DescriptionsProps {
  pageContainer?: PageContainerProps;
}

interface Resource {
  table?: TableTemplate;
  list?: ListTemplate;
  form?: FormTemplate;
  stepForm?: StepFormTemplate;
  descriptions?: DescriptionsTemplate;
  mixins?: TableTemplate | ListTemplate | DescriptionsTemplate[];
  stores?: ObjectStore<any>[];
}

export class TemplateManager {
  private stores = observable.map<string, Resource>();

  initStores(route: string) {
    (this.stores.get(route)?.stores || []).map((store) => {
      store.loadAll();
      store.watch();
    });
  }

  clearStores(route: string) {
    (this.stores.get(route)?.stores || []).map((store) => {
      store.stop();
    });
  }

  getLayout(route: string, T: LayoutType) {
    switch (T) {
      case 'table':
        return this.stores.get(route)?.table;
      case 'list':
        return this.stores.get(route)?.list;
      case 'form':
        return this.stores.get(route)?.form;
      case 'step-form':
        return this.stores.get(route)?.stepForm;
      case 'descriptions':
        return this.stores.get(route)?.descriptions;
      default:
        return null;
    }
  }

  register(route: string, resource: Resource) {
    let exist: Resource = resource;
    if (this.stores.has(route)) {
      exist = Object.assign(this.stores.get(route) || {}, exist);
    }
    this.stores.set(route, exist);
  }
}

export const templateManager = new TemplateManager();
