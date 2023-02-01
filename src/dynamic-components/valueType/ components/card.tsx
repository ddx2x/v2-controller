import { ProCard, ProCardProps, ProFieldFCRenderProps } from '@ant-design/pro-components';
import { FormProps, useForm } from '../../form';

export declare type CardProps = FormProps & ProFieldFCRenderProps & {
  proCardProps?: ProCardProps;
};

export const Card: React.FC<CardProps> = (props) => {
  const { value, proCardProps, onChange, ...rest } = props;

  const form = useForm({
    submitter: false,
    layoutType: 'Form',
    initialValues: value || {},
    onValuesChange: (_: any, values: any) => onChange && onChange({ ...values }),
    ...rest,
  });

  return <ProCard {...proCardProps}>{form}</ProCard>;
};
