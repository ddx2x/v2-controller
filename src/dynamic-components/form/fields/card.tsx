import { useCard } from '@/dynamic-components/#';
import { ProCardProps } from '@ant-design/pro-components';
import { useForm } from '..';
import { FormProps } from '../form';

export declare type CardFieldProps = FormProps & {
  proCardProps?: ProCardProps;
  value?: any;
  onChange?: ((...rest: any[]) => void) | undefined;
}

export const cardField: React.FC<CardFieldProps> = (props) => {
  const { value, onChange, proCardProps, ...rest } = props;

  const [form] = useForm({
    submitter: false,
    layoutType: 'Form',
    initialValues: value || {},
    onValuesChange: (_: any, values: any) => onChange && onChange({ ...values }),
    ...rest
  })

  const [card] = useCard({
    children: form,
    ...proCardProps
  })

  return <>{card}</>
};