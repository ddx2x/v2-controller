export * from './form';
export * from './step-form'
export { default } from './form';

declare module '@ant-design/pro-utils' {
  interface ProFieldValueTypeWithFieldProps {
    tags: Record<string, any>;
    link: {
      customField: string;
    };
  }
}
