import { ProCard, ProCardProps } from '@ant-design/pro-components';
import { ProFieldFCRenderProps } from '@ant-design/pro-provider';
import { Form, FormProps } from '../form';

export type CardProps = ProFieldFCRenderProps & {
  proFieldProps?: ProCardProps;
  fieldProps?: FormProps;
}

export const card: React.FC<CardProps> = (props) => {
  const { proFieldProps, fieldProps } = props;

  return (
    <ProCard title="卡片组展开" collapsible {...proFieldProps}>
      <Form layoutType="Form" submitter={false} columns={[]} {...fieldProps} />
    </ProCard>
  );
};