import { ProFieldFCRenderProps } from '@ant-design/pro-components';
import { Steps, StepsProps as AntdStepsProps } from 'antd';

export declare type StepsProps = ProFieldFCRenderProps & AntdStepsProps

export const StepsFormItem: React.FC<StepsProps> = (props) => {
  const { value, ...rest } = props
  return <Steps  {...rest} {...(value || {})} />
}
export const StepsRender: React.FC<StepsProps> = (props) => {
  const { value, ...rest } = props
  return <Steps {...rest} {...(value || {})} />
}