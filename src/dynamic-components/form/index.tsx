
import { Form, FormProps } from './form';
import { StepForm, StepFormProps } from './stepForm';

export * from './customs';
export * from './form';
export * from './stepForm';
export * from './valueTypeMap';

export const useForm = (props: FormProps): [any, {}] => {
  return [<Form {...props} />, {}];
};

export const useStepsForm = (props: StepFormProps): [any, {}] => {
  return [<StepForm {...props} />, {}];
};
