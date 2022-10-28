import { ObjectStore } from '@/client';
import { observable } from 'mobx';
import {
  DescriptionsProps,
  FormProps,
  ListProps,
  PageContainerProps,
  StepFormProps,
  TableProps,
} from '../kit';

export type LayoutType = 'table' | 'list' | 'descriptions' | 'form' | 'step-form';

interface _Container {
  pageContainer?: PageContainerProps;
}

export interface TableLayout extends TableProps, _Container {}
export interface ListLayout extends ListProps, _Container {}
export interface FormLayout extends FormProps, _Container {}
export interface StepFormLayout extends StepFormProps, _Container {}
export interface DescriptionsLayout extends DescriptionsProps, _Container {}

interface ApiResource {
  table?: TableLayout;
  list?: ListLayout;
  form?: FormLayout;
  stepForm?: StepFormLayout;
  descriptions?: DescriptionsLayout;
  stores?: ObjectStore<any>[];
}

export class AppManager {
  private stores = observable.map<string, ApiResource>();

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

  register(route: string, apiResource: ApiResource) {
    let exist: ApiResource = apiResource;
    if (this.stores.has(route)) {
      exist = Object.assign(this.stores.get(route) || {}, exist);
    }
    this.stores.set(route, exist);
  }
}

export const appManager = new AppManager();
