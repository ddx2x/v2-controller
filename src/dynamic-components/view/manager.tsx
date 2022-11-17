import type { IObject, ObjectStore } from '@/client';
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
  | TableTemplate[];

export interface TemplateResource<S extends ObjectStore<IObject>> {
  template: Template;
  stores?: S[];
}

export class TemplateManager<S extends ObjectStore<IObject>> {
  private stores = new Map<string, TemplateResource<S>>();

  init(key: string) {
    (this.stores.get(key)?.stores || []).map((store) => {
      store.next(10, '');
    });
  }

  clear(key: string) {
    (this.stores.get(key)?.stores || []).map((store) => {
      store.reset();
    });
  }

  getLayoutTemplate(key: string): Template[] {
    const template = this.stores.get(key)?.template;
    if (Array.isArray(template)) {
      return template;
    }
    return [template];
  }

  register(key: string, template: TemplateResource<S>) {
    this.stores.set(key, template);
  }
}

export const templateManager = new TemplateManager();
