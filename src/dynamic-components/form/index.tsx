import { valueTypeMap } from './customs';
import type { FormProps } from './form';
import Form from './form';
import type { StepFormProps } from './stepForm';
import StepForm from './stepForm';
import { valueTypeMapStore } from './valueTypeMap';

export * from './form';
export { default } from './form';
export * from './stepForm';
export * from './valueTypeMap';

valueTypeMapStore.registerValueType(valueTypeMap);

export const useForm = (props: FormProps): [any, {}] => {
  return [<Form {...props} />, {}];
};

export const useStepsForm = (props: StepFormProps): [any, {}] => {
  return [<StepForm {...props} />, {}];
};
