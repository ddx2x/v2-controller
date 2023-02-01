import { ProCard, ProCardProps } from '@ant-design/pro-components';
import { FormProps, useForm } from '../../form';

export declare type CardFieldProps = FormProps & {
  proCardProps?: ProCardProps;
  value?: any;
  onChange?: ((...rest: any[]) => void) | undefined;
};

export const cardField: React.FC<CardFieldProps> = (props) => {
  const { value, onChange, proCardProps, ...rest } = props;

  const formDom = useForm({
    submitter: false,
    layoutType: 'Form',
    initialValues: value || {},
    onValuesChange: (_: any, values: any) => onChange && onChange({ ...values }),
    ...rest,
  });

  return <ProCard {...proCardProps}>{formDom}</ProCard>;
};
