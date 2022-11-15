import type { ObjectStore } from '@/client';
import { observable } from 'mobx';
import type {
  DescriptionsTemplate,
  FormTemplate,
  LayoutType,
  ListTemplate,
  StepFormTemplate,
  TableTemplate
} from '../typing';

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
    (this.stores.get(route)?.stores || []).map(() => {
      // store.stop();
    });
  }

  Layout(route: string, T: LayoutType) {
    const store = this.stores.get(route);
    switch (T) {
      case 'table':
        return store?.table;
      case 'list':
        return store?.list;
      case 'form':
        return store?.form;
      case 'step-form':
        return store?.stepForm;
      case 'descriptions':
        return store?.descriptions;
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
