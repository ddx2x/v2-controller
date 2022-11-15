import type { IObject, ObjectStore } from '@/client';
import { observable } from 'mobx';
import type {
  DescriptionsTemplate,
  FormTemplate,
  ListTemplate,
  StepFormTemplate,
  TableTemplate,
} from '../typing';

export type Template =
  | TableTemplate
  | ListTemplate
  | FormTemplate
  | StepFormTemplate
  | DescriptionsTemplate
  | Template[];

export interface TemplateResource<S extends ObjectStore<IObject>> {
  template: Template;
  stores?: S[];
}

export class TemplateManager<S extends ObjectStore<IObject>> {
  private stores = observable.map<string, TemplateResource<S>>();

  initStores(route: string) {
    (this.stores.get(route)?.stores || []).map((store) => {
      store.next(10, '');
    });
  }

  clearStores(route: string) {
    (this.stores.get(route)?.stores || []).map(() => {
      // store.stop();
    });
  }

  layout(route: string, kind: string) {
    return this.stores.get(route)?.template[kind] || null;
  }

  register(route: string, resource: TemplateResource<S>) {
    this.stores.set(route, resource);
  }
}

export const templateManager = new TemplateManager();
