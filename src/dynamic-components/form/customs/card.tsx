import { ProCard, ProCardProps, ProRenderFieldPropsType } from '@ant-design/pro-components';
import { ProFieldFCRenderProps } from '@ant-design/pro-provider';
import { Form, FormProps } from '../form';

export interface CardProps extends ProFieldFCRenderProps {
  proFieldProps?: ProCardProps;
  fieldProps?: FormProps;
}

const Card: React.FC<CardProps> = (props) => {
  const { proFieldProps, fieldProps } = props;

  return (
    <ProCard title="卡片组展开" collapsible {...proFieldProps}>
      <Form layoutType="Form" submitter={false} columns={[]} {...fieldProps} />
    </ProCard>
  );
};

export const card: ProRenderFieldPropsType = {
  render: (text, props, dom) => {
    return <Card {...props} fieldProps={props.fieldProps} />;
  },
  renderFormItem: (text, props, dom) => {
    return <Card {...props} fieldProps={props.fieldProps} />;
  },
};
